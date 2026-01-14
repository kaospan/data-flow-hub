-- Conclusions Table - The "final conclusions" module with change tracking
CREATE TABLE public.conclusions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
  
  -- The conclusion itself
  conclusion_type TEXT NOT NULL,
  conclusion_key TEXT NOT NULL,
  conclusion_value JSONB NOT NULL,
  
  -- Confidence and reasoning
  confidence NUMERIC(3,2) DEFAULT 1.00 CHECK (confidence >= 0 AND confidence <= 1),
  reasoning TEXT,
  
  -- Source tracking
  source_type TEXT NOT NULL CHECK (source_type IN ('conversation', 'document', 'manual', 'system')),
  source_id UUID,
  source_details JSONB DEFAULT '{}'::jsonb,
  
  -- Change tracking
  previous_value JSONB,
  change_reason TEXT,
  changed_by UUID REFERENCES public.profiles(id),
  
  -- Status
  is_current BOOLEAN DEFAULT true,
  superseded_by UUID REFERENCES public.conclusions(id),
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Partial unique index for current conclusions
CREATE UNIQUE INDEX idx_conclusions_unique_current 
  ON public.conclusions(organization_id, patient_id, conclusion_type, conclusion_key) 
  WHERE is_current = true;

-- Other indexes
CREATE INDEX idx_conclusions_org ON public.conclusions(organization_id);
CREATE INDEX idx_conclusions_patient ON public.conclusions(patient_id);
CREATE INDEX idx_conclusions_type ON public.conclusions(conclusion_type);
CREATE INDEX idx_conclusions_current ON public.conclusions(is_current) WHERE is_current = true;

-- Enable RLS
ALTER TABLE public.conclusions ENABLE ROW LEVEL SECURITY;

-- RLS Policies - using correct has_role(user_id, role) order
CREATE POLICY "Users can view conclusions in their organization"
  ON public.conclusions FOR SELECT
  USING (organization_id = get_user_organization_id(auth.uid()));

CREATE POLICY "Editors and admins can insert conclusions"
  ON public.conclusions FOR INSERT
  WITH CHECK (
    organization_id = get_user_organization_id(auth.uid())
    AND (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role))
  );

CREATE POLICY "Editors and admins can update conclusions"
  ON public.conclusions FOR UPDATE
  USING (
    organization_id = get_user_organization_id(auth.uid())
    AND (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role))
  );

-- Trigger for updated_at
CREATE TRIGGER update_conclusions_updated_at
  BEFORE UPDATE ON public.conclusions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to update a conclusion with history tracking
CREATE OR REPLACE FUNCTION public.update_conclusion(
  p_organization_id UUID,
  p_patient_id UUID,
  p_conclusion_type TEXT,
  p_conclusion_key TEXT,
  p_new_value JSONB,
  p_confidence NUMERIC,
  p_reasoning TEXT,
  p_source_type TEXT,
  p_source_id UUID,
  p_source_details JSONB,
  p_change_reason TEXT
) RETURNS UUID AS $$
DECLARE
  v_old_conclusion public.conclusions%ROWTYPE;
  v_new_id UUID;
BEGIN
  -- Find current conclusion
  SELECT * INTO v_old_conclusion
  FROM public.conclusions
  WHERE organization_id = p_organization_id
    AND (patient_id = p_patient_id OR (patient_id IS NULL AND p_patient_id IS NULL))
    AND conclusion_type = p_conclusion_type
    AND conclusion_key = p_conclusion_key
    AND is_current = true;
  
  -- If exists, mark as superseded
  IF FOUND THEN
    UPDATE public.conclusions
    SET is_current = false, updated_at = now()
    WHERE id = v_old_conclusion.id;
  END IF;
  
  -- Insert new conclusion
  INSERT INTO public.conclusions (
    organization_id, patient_id, conclusion_type, conclusion_key,
    conclusion_value, confidence, reasoning,
    source_type, source_id, source_details,
    previous_value, change_reason, changed_by
  ) VALUES (
    p_organization_id, p_patient_id, p_conclusion_type, p_conclusion_key,
    p_new_value, p_confidence, p_reasoning,
    p_source_type, p_source_id, p_source_details,
    v_old_conclusion.conclusion_value, p_change_reason, auth.uid()
  )
  RETURNING id INTO v_new_id;
  
  -- Link old to new
  IF v_old_conclusion.id IS NOT NULL THEN
    UPDATE public.conclusions
    SET superseded_by = v_new_id
    WHERE id = v_old_conclusion.id;
  END IF;
  
  RETURN v_new_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Function to get all current conclusions for a patient
CREATE OR REPLACE FUNCTION public.get_patient_conclusions(
  p_organization_id UUID,
  p_patient_id UUID
) RETURNS TABLE (
  conclusion_type TEXT,
  conclusion_key TEXT,
  conclusion_value JSONB,
  confidence NUMERIC,
  reasoning TEXT,
  source_type TEXT,
  updated_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.conclusion_type,
    c.conclusion_key,
    c.conclusion_value,
    c.confidence,
    c.reasoning,
    c.source_type,
    c.updated_at
  FROM public.conclusions c
  WHERE c.organization_id = p_organization_id
    AND (c.patient_id = p_patient_id OR c.patient_id IS NULL)
    AND c.is_current = true
  ORDER BY c.conclusion_type, c.updated_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;