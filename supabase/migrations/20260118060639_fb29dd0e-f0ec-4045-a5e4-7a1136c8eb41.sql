-- ============================================
-- PATIENT SELF-MANAGEMENT MODULE SCHEMA
-- ============================================

-- 1. Add medical_items table for Medical Vault
CREATE TABLE IF NOT EXISTS public.medical_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id),
  patient_id UUID NOT NULL REFERENCES public.patients(id),
  kind TEXT NOT NULL CHECK (kind IN ('document', 'image', 'note')),
  title TEXT NOT NULL,
  storage_url TEXT,
  tags JSONB DEFAULT '[]'::jsonb,
  extracted_text TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 2. Add routine_dependencies table for phase-linked tasks
CREATE TABLE IF NOT EXISTS public.routine_dependencies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  from_step_id UUID NOT NULL REFERENCES public.routine_steps(id) ON DELETE CASCADE,
  to_step_id UUID NOT NULL REFERENCES public.routine_steps(id) ON DELETE CASCADE,
  delay_minutes INTEGER DEFAULT 0,
  next_fire_strategy TEXT DEFAULT 'schedule_after' CHECK (next_fire_strategy IN ('schedule_after', 'schedule_at_time', 'immediate')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(from_step_id, to_step_id)
);

-- 3. Add day_type to schedule_rules for adapting to day types
ALTER TABLE public.schedule_rules 
  ADD COLUMN IF NOT EXISTS day_type TEXT DEFAULT 'regular' CHECK (day_type IN ('regular', 'weekend', 'holiday', 'school_day'));

-- 4. Add buffer_minutes to schedule_rules for pickups
ALTER TABLE public.schedule_rules 
  ADD COLUMN IF NOT EXISTS buffer_minutes INTEGER DEFAULT 0;

-- 5. Add travel_mode and timezone to patients for travel adjustments
ALTER TABLE public.patients 
  ADD COLUMN IF NOT EXISTS travel_mode BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS travel_timezone TEXT,
  ADD COLUMN IF NOT EXISTS home_timezone TEXT DEFAULT 'Asia/Jerusalem';

-- 6. Add escalation_config to routines for customizable escalation
ALTER TABLE public.routines 
  ADD COLUMN IF NOT EXISTS escalation_config JSONB DEFAULT '{"levels": [{"delay_minutes": 5, "type": "gentle"}, {"delay_minutes": 15, "type": "louder"}, {"delay_minutes": 30, "type": "persistent"}]}'::jsonb,
  ADD COLUMN IF NOT EXISTS notify_contacts JSONB DEFAULT '[]'::jsonb;

-- 7. Add gate_routine_id for morning gate logic
ALTER TABLE public.routines 
  ADD COLUMN IF NOT EXISTS gate_routine_id UUID REFERENCES public.routines(id);

-- 8. Create index for better querying
CREATE INDEX IF NOT EXISTS idx_medical_items_patient ON public.medical_items(patient_id);
CREATE INDEX IF NOT EXISTS idx_medical_items_kind ON public.medical_items(kind);
CREATE INDEX IF NOT EXISTS idx_medical_items_tags ON public.medical_items USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_routine_completions_date ON public.routine_completions(completed_at);
CREATE INDEX IF NOT EXISTS idx_routine_reminders_status ON public.routine_reminders(status);

-- ============================================
-- RLS POLICIES FOR MEDICAL ITEMS
-- ============================================

ALTER TABLE public.medical_items ENABLE ROW LEVEL SECURITY;

-- Patients can view their own medical items
CREATE POLICY "Patients can view their own medical items"
  ON public.medical_items FOR SELECT
  USING (
    organization_id = get_user_organization_id(auth.uid()) AND
    (
      has_role(auth.uid(), 'admin'::app_role) OR
      has_role(auth.uid(), 'editor'::app_role) OR
      EXISTS (
        SELECT 1 FROM public.patients p
        JOIN public.profiles pr ON pr.email = p.email
        WHERE p.id = medical_items.patient_id
        AND pr.id = auth.uid()
      )
    )
  );

-- Patients can insert their own medical items
CREATE POLICY "Users can insert medical items"
  ON public.medical_items FOR INSERT
  WITH CHECK (
    organization_id = get_user_organization_id(auth.uid()) AND
    (
      has_role(auth.uid(), 'admin'::app_role) OR
      has_role(auth.uid(), 'editor'::app_role) OR
      EXISTS (
        SELECT 1 FROM public.patients p
        JOIN public.profiles pr ON pr.email = p.email
        WHERE p.id = medical_items.patient_id
        AND pr.id = auth.uid()
      )
    )
  );

-- Users can update their own medical items
CREATE POLICY "Users can update medical items"
  ON public.medical_items FOR UPDATE
  USING (
    organization_id = get_user_organization_id(auth.uid()) AND
    (
      has_role(auth.uid(), 'admin'::app_role) OR
      has_role(auth.uid(), 'editor'::app_role) OR
      EXISTS (
        SELECT 1 FROM public.patients p
        JOIN public.profiles pr ON pr.email = p.email
        WHERE p.id = medical_items.patient_id
        AND pr.id = auth.uid()
      )
    )
  );

-- Only admins can delete medical items
CREATE POLICY "Admins can delete medical items"
  ON public.medical_items FOR DELETE
  USING (
    organization_id = get_user_organization_id(auth.uid()) AND
    has_role(auth.uid(), 'admin'::app_role)
  );

-- ============================================
-- RLS POLICIES FOR ROUTINE DEPENDENCIES
-- ============================================

ALTER TABLE public.routine_dependencies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view dependencies in their org"
  ON public.routine_dependencies FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.routine_steps rs
      JOIN public.routines r ON r.id = rs.routine_id
      WHERE rs.id = routine_dependencies.from_step_id
      AND r.organization_id = get_user_organization_id(auth.uid())
    )
  );

CREATE POLICY "Editors can manage dependencies"
  ON public.routine_dependencies FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.routine_steps rs
      JOIN public.routines r ON r.id = rs.routine_id
      WHERE rs.id = routine_dependencies.from_step_id
      AND r.organization_id = get_user_organization_id(auth.uid())
      AND (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role))
    )
  );

-- ============================================
-- STORAGE BUCKET FOR MEDICAL FILES
-- ============================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'medical-files',
  'medical-files',
  false,
  52428800,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'application/pdf', 'text/plain']
)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for medical files
CREATE POLICY "Users can view their medical files"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'medical-files' AND
    (storage.foldername(name))[1] = get_user_organization_id(auth.uid())::text
  );

CREATE POLICY "Users can upload medical files"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'medical-files' AND
    (storage.foldername(name))[1] = get_user_organization_id(auth.uid())::text
  );

CREATE POLICY "Users can delete their medical files"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'medical-files' AND
    (storage.foldername(name))[1] = get_user_organization_id(auth.uid())::text AND
    has_role(auth.uid(), 'admin'::app_role)
  );

-- ============================================
-- FUNCTION: Schedule next step after completion
-- ============================================

CREATE OR REPLACE FUNCTION public.schedule_dependent_step()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql AS $$
DECLARE
  dep RECORD;
  next_fire TIMESTAMP WITH TIME ZONE;
BEGIN
  IF NEW.completion_type = 'confirmed' AND NEW.step_id IS NOT NULL THEN
    FOR dep IN 
      SELECT rd.*, rs.routine_id
      FROM routine_dependencies rd
      JOIN routine_steps rs ON rs.id = rd.to_step_id
      WHERE rd.from_step_id = NEW.step_id
    LOOP
      IF dep.next_fire_strategy = 'immediate' THEN
        next_fire := now();
      ELSE
        next_fire := now() + (dep.delay_minutes || ' minutes')::interval;
      END IF;
      
      INSERT INTO routine_reminders (
        organization_id,
        patient_id,
        routine_id,
        step_id,
        scheduled_at,
        status
      ) VALUES (
        NEW.organization_id,
        NEW.patient_id,
        dep.routine_id,
        dep.to_step_id,
        next_fire,
        'pending'
      );
    END LOOP;
  END IF;
  
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_schedule_dependent ON public.routine_completions;
CREATE TRIGGER trigger_schedule_dependent
  AFTER INSERT ON public.routine_completions
  FOR EACH ROW
  EXECUTE FUNCTION public.schedule_dependent_step();

-- ============================================
-- FUNCTION: Log to audit table
-- ============================================

CREATE OR REPLACE FUNCTION public.log_audit_entry(
  p_organization_id UUID,
  p_action TEXT,
  p_entity_type TEXT,
  p_entity_id UUID,
  p_before_state JSONB DEFAULT NULL,
  p_after_state JSONB DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql AS $$
DECLARE
  v_id UUID;
BEGIN
  INSERT INTO audit_log (
    organization_id,
    user_id,
    action,
    entity_type,
    entity_id,
    before_state,
    after_state,
    metadata
  ) VALUES (
    p_organization_id,
    auth.uid(),
    p_action,
    p_entity_type,
    p_entity_id,
    p_before_state,
    p_after_state,
    p_metadata
  )
  RETURNING id INTO v_id;
  
  RETURN v_id;
END;
$$;

-- ============================================
-- FUNCTION: Check if morning gate is cleared
-- ============================================

CREATE OR REPLACE FUNCTION public.is_gate_cleared(
  p_patient_id UUID,
  p_gate_routine_id UUID
)
RETURNS BOOLEAN
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql AS $$
DECLARE
  v_cleared BOOLEAN := true;
  v_step RECORD;
BEGIN
  FOR v_step IN
    SELECT rs.id, rs.is_optional
    FROM routine_steps rs
    WHERE rs.routine_id = p_gate_routine_id
    ORDER BY rs.step_order
  LOOP
    IF NOT v_step.is_optional THEN
      IF NOT EXISTS (
        SELECT 1 FROM routine_completions rc
        WHERE rc.step_id = v_step.id
        AND rc.patient_id = p_patient_id
        AND rc.completion_type = 'confirmed'
        AND rc.completed_at >= CURRENT_DATE
      ) THEN
        v_cleared := false;
        EXIT;
      END IF;
    END IF;
  END LOOP;
  
  RETURN v_cleared;
END;
$$;

-- ============================================
-- FUNCTION: Search medical items
-- ============================================

CREATE OR REPLACE FUNCTION public.search_medical_items(
  p_organization_id UUID,
  p_patient_id UUID,
  p_search_text TEXT DEFAULT NULL,
  p_kind TEXT DEFAULT NULL,
  p_tags TEXT[] DEFAULT NULL,
  p_from_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  p_to_date TIMESTAMP WITH TIME ZONE DEFAULT NULL
)
RETURNS SETOF public.medical_items
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT mi.*
  FROM medical_items mi
  WHERE mi.organization_id = p_organization_id
  AND mi.patient_id = p_patient_id
  AND (p_kind IS NULL OR mi.kind = p_kind)
  AND (p_from_date IS NULL OR mi.created_at >= p_from_date)
  AND (p_to_date IS NULL OR mi.created_at <= p_to_date)
  AND (p_tags IS NULL OR mi.tags ?| p_tags)
  AND (
    p_search_text IS NULL 
    OR mi.title ILIKE '%' || p_search_text || '%'
    OR mi.extracted_text ILIKE '%' || p_search_text || '%'
  )
  ORDER BY mi.created_at DESC;
END;
$$;

-- Enable realtime for new tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.medical_items;