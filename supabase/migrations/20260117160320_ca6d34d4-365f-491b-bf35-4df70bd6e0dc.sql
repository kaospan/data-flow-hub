-- Patient Routines & Meds Tracking System
-- Core tables for medication management with smart escalation

-- Enum for routine types
DO $$ BEGIN
  CREATE TYPE routine_type AS ENUM ('medication', 'pickup', 'hygiene', 'chore', 'gate', 'custom');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Enum for priority tiers
DO $$ BEGIN
  CREATE TYPE routine_priority AS ENUM ('critical', 'important', 'flexible');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Enum for reminder status
DO $$ BEGIN
  CREATE TYPE routine_reminder_status AS ENUM ('pending', 'sent', 'confirmed', 'snoozed', 'skipped', 'escalated', 'expired');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Enum for day of week
DO $$ BEGIN
  CREATE TYPE day_of_week AS ENUM ('sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 1. Routines table - the main routine definitions
CREATE TABLE IF NOT EXISTS public.routines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type routine_type NOT NULL DEFAULT 'custom',
  priority routine_priority NOT NULL DEFAULT 'flexible',
  is_active BOOLEAN NOT NULL DEFAULT true,
  description TEXT,
  -- Medication-specific fields (stored as JSON for flexibility)
  medication_info JSONB DEFAULT '{}'::jsonb,
  -- Settings
  quiet_hours_start TIME,
  quiet_hours_end TIME,
  timezone TEXT DEFAULT 'Asia/Jerusalem',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Routine Steps - for multi-phase routines
CREATE TABLE IF NOT EXISTS public.routine_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  routine_id UUID NOT NULL REFERENCES public.routines(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  step_order INTEGER NOT NULL DEFAULT 0,
  is_optional BOOLEAN DEFAULT false,
  estimated_minutes INTEGER,
  -- For linked tasks (e.g., after washer → dryer)
  triggers_step_id UUID REFERENCES public.routine_steps(id),
  trigger_delay_minutes INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Schedule Rules - when routines should fire
CREATE TABLE IF NOT EXISTS public.schedule_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  routine_id UUID NOT NULL REFERENCES public.routines(id) ON DELETE CASCADE,
  days_of_week day_of_week[] NOT NULL DEFAULT ARRAY['sunday','monday','tuesday','wednesday','thursday','friday','saturday']::day_of_week[],
  time_of_day TIME NOT NULL,
  -- Trigger type: 'clock' (fixed time), 'trigger' (event-based)
  trigger_type TEXT NOT NULL DEFAULT 'clock',
  trigger_description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Routine Reminders - individual reminder instances
CREATE TABLE IF NOT EXISTS public.routine_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  routine_id UUID NOT NULL REFERENCES public.routines(id) ON DELETE CASCADE,
  step_id UUID REFERENCES public.routine_steps(id),
  schedule_rule_id UUID REFERENCES public.schedule_rules(id),
  scheduled_at TIMESTAMPTZ NOT NULL,
  status routine_reminder_status NOT NULL DEFAULT 'pending',
  escalation_level INTEGER NOT NULL DEFAULT 0,
  -- Response tracking
  responded_at TIMESTAMPTZ,
  response_type TEXT, -- 'taken', 'snoozed', 'skipped'
  skip_reason TEXT,
  snooze_until TIMESTAMPTZ,
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Routine Completions - historical log of completed routines
CREATE TABLE IF NOT EXISTS public.routine_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  routine_id UUID NOT NULL REFERENCES public.routines(id) ON DELETE CASCADE,
  step_id UUID REFERENCES public.routine_steps(id),
  reminder_id UUID REFERENCES public.routine_reminders(id),
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completion_type TEXT NOT NULL, -- 'confirmed', 'skipped', 'auto_dismissed'
  notes TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. Patient Medications - specific med tracking
CREATE TABLE IF NOT EXISTS public.patient_medications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  dosage TEXT,
  instructions TEXT, -- User's own clinician/pharmacy instructions
  refill_reminder_days INTEGER DEFAULT 7,
  current_supply INTEGER,
  last_refill_date DATE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_routines_patient ON public.routines(patient_id);
CREATE INDEX IF NOT EXISTS idx_routines_org ON public.routines(organization_id);
CREATE INDEX IF NOT EXISTS idx_routine_reminders_patient ON public.routine_reminders(patient_id);
CREATE INDEX IF NOT EXISTS idx_routine_reminders_scheduled ON public.routine_reminders(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_routine_reminders_status ON public.routine_reminders(status);
CREATE INDEX IF NOT EXISTS idx_routine_completions_patient ON public.routine_completions(patient_id);
CREATE INDEX IF NOT EXISTS idx_patient_medications_patient ON public.patient_medications(patient_id);

-- Enable RLS on all tables
ALTER TABLE public.routines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routine_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedule_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routine_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routine_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_medications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for routines
CREATE POLICY "Users can view routines in their organization" ON public.routines
  FOR SELECT USING (organization_id = get_user_organization_id(auth.uid()));

CREATE POLICY "Users can create routines in their organization" ON public.routines
  FOR INSERT WITH CHECK (organization_id = get_user_organization_id(auth.uid()));

CREATE POLICY "Users can update routines in their organization" ON public.routines
  FOR UPDATE USING (organization_id = get_user_organization_id(auth.uid()));

CREATE POLICY "Users can delete routines in their organization" ON public.routines
  FOR DELETE USING (organization_id = get_user_organization_id(auth.uid()));

-- RLS Policies for routine_steps (via routine ownership)
CREATE POLICY "Users can view routine steps" ON public.routine_steps
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.routines r 
    WHERE r.id = routine_id AND r.organization_id = get_user_organization_id(auth.uid())
  ));

CREATE POLICY "Users can manage routine steps" ON public.routine_steps
  FOR ALL USING (EXISTS (
    SELECT 1 FROM public.routines r 
    WHERE r.id = routine_id AND r.organization_id = get_user_organization_id(auth.uid())
  ));

-- RLS Policies for schedule_rules
CREATE POLICY "Users can view schedule rules" ON public.schedule_rules
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.routines r 
    WHERE r.id = routine_id AND r.organization_id = get_user_organization_id(auth.uid())
  ));

CREATE POLICY "Users can manage schedule rules" ON public.schedule_rules
  FOR ALL USING (EXISTS (
    SELECT 1 FROM public.routines r 
    WHERE r.id = routine_id AND r.organization_id = get_user_organization_id(auth.uid())
  ));

-- RLS Policies for routine_reminders
CREATE POLICY "Users can view reminders in their organization" ON public.routine_reminders
  FOR SELECT USING (organization_id = get_user_organization_id(auth.uid()));

CREATE POLICY "Users can create reminders in their organization" ON public.routine_reminders
  FOR INSERT WITH CHECK (organization_id = get_user_organization_id(auth.uid()));

CREATE POLICY "Users can update reminders in their organization" ON public.routine_reminders
  FOR UPDATE USING (organization_id = get_user_organization_id(auth.uid()));

-- RLS Policies for routine_completions
CREATE POLICY "Users can view completions in their organization" ON public.routine_completions
  FOR SELECT USING (organization_id = get_user_organization_id(auth.uid()));

CREATE POLICY "Users can create completions in their organization" ON public.routine_completions
  FOR INSERT WITH CHECK (organization_id = get_user_organization_id(auth.uid()));

-- RLS Policies for patient_medications
CREATE POLICY "Users can view medications in their organization" ON public.patient_medications
  FOR SELECT USING (organization_id = get_user_organization_id(auth.uid()));

CREATE POLICY "Users can manage medications in their organization" ON public.patient_medications
  FOR ALL USING (organization_id = get_user_organization_id(auth.uid()));

-- Enable realtime for key tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.routine_reminders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.routine_completions;

-- Function to get today's routines for a patient
CREATE OR REPLACE FUNCTION public.get_patient_today_routines(
  p_organization_id UUID,
  p_patient_id UUID
)
RETURNS TABLE (
  routine_id UUID,
  routine_name TEXT,
  routine_type routine_type,
  priority routine_priority,
  scheduled_time TIME,
  reminder_id UUID,
  reminder_status routine_reminder_status,
  scheduled_at TIMESTAMPTZ,
  escalation_level INTEGER
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    r.id as routine_id,
    r.name as routine_name,
    r.type as routine_type,
    r.priority,
    sr.time_of_day as scheduled_time,
    rr.id as reminder_id,
    rr.status as reminder_status,
    rr.scheduled_at,
    rr.escalation_level
  FROM routines r
  LEFT JOIN schedule_rules sr ON sr.routine_id = r.id AND sr.is_active = true
  LEFT JOIN routine_reminders rr ON rr.routine_id = r.id 
    AND rr.scheduled_at::date = CURRENT_DATE
  WHERE r.organization_id = p_organization_id
    AND r.patient_id = p_patient_id
    AND r.is_active = true
  ORDER BY sr.time_of_day ASC NULLS LAST;
END;
$$;