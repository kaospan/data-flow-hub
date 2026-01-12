-- =====================================================
-- HealIT Medical Follow-up Assistant Database Schema
-- =====================================================

-- Create enum for event types
CREATE TYPE public.event_type AS ENUM (
  'referral',
  'lab_result', 
  'discharge',
  'visit_note',
  'message',
  'appointment'
);

-- Create enum for followup categories
CREATE TYPE public.followup_category AS ENUM (
  'schedule_appointment',
  'repeat_test',
  'review_result',
  'medication_check',
  'admin_other'
);

-- Create enum for priority levels
CREATE TYPE public.priority_level AS ENUM (
  'low',
  'medium',
  'high'
);

-- Create enum for followup status
CREATE TYPE public.followup_status AS ENUM (
  'open',
  'in_progress',
  'done',
  'dismissed'
);

-- Create enum for owner role
CREATE TYPE public.owner_role AS ENUM (
  'patient',
  'staff',
  'clinician'
);

-- Create enum for reminder channel
CREATE TYPE public.reminder_channel AS ENUM (
  'email',
  'sms',
  'whatsapp',
  'push',
  'in_app'
);

-- Create enum for reminder status
CREATE TYPE public.reminder_status AS ENUM (
  'queued',
  'sent',
  'delivered',
  'failed',
  'canceled'
);

-- Create enum for escalation level
CREATE TYPE public.escalation_level AS ENUM (
  '1',
  '2',
  '3'
);

-- Create enum for note type
CREATE TYPE public.note_type AS ENUM (
  'slip_check',
  'weekly_summary',
  'intake_summary'
);

-- =====================================================
-- PATIENTS TABLE
-- =====================================================
CREATE TABLE public.patients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  contact_preferences JSONB DEFAULT '{"email": true, "sms": false, "push": true}'::jsonb,
  consent_flags JSONB DEFAULT '{"data_processing": false, "reminders": false}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view patients in their organization"
  ON public.patients FOR SELECT
  USING (organization_id = get_user_organization_id(auth.uid()));

CREATE POLICY "Editors can create patients"
  ON public.patients FOR INSERT
  WITH CHECK (organization_id = get_user_organization_id(auth.uid()) 
    AND (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role)));

CREATE POLICY "Editors can update patients"
  ON public.patients FOR UPDATE
  USING (organization_id = get_user_organization_id(auth.uid())
    AND (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role)));

CREATE POLICY "Admins can delete patients"
  ON public.patients FOR DELETE
  USING (organization_id = get_user_organization_id(auth.uid()) 
    AND has_role(auth.uid(), 'admin'::app_role));

-- =====================================================
-- EVENTS TABLE (raw medical events)
-- =====================================================
CREATE TABLE public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  type event_type NOT NULL,
  source TEXT NOT NULL DEFAULT 'user', -- 'user', 'clinic_system', 'import'
  payload_json JSONB DEFAULT '{}'::jsonb,
  occurred_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  processed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view events in their organization"
  ON public.events FOR SELECT
  USING (organization_id = get_user_organization_id(auth.uid()));

CREATE POLICY "Editors can create events"
  ON public.events FOR INSERT
  WITH CHECK (organization_id = get_user_organization_id(auth.uid())
    AND (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role)));

CREATE POLICY "Editors can update events"
  ON public.events FOR UPDATE
  USING (organization_id = get_user_organization_id(auth.uid())
    AND (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role)));

-- =====================================================
-- FOLLOWUP_ITEMS TABLE
-- =====================================================
CREATE TABLE public.followup_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  event_id UUID REFERENCES public.events(id) ON DELETE SET NULL,
  category followup_category NOT NULL,
  description TEXT NOT NULL,
  due_at TIMESTAMP WITH TIME ZONE NOT NULL,
  priority priority_level NOT NULL DEFAULT 'medium',
  status followup_status NOT NULL DEFAULT 'open',
  closure_reason TEXT,
  owner_role owner_role NOT NULL DEFAULT 'staff',
  assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_by TEXT NOT NULL DEFAULT 'assistant', -- 'assistant', 'user', 'staff'
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.followup_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view followups in their organization"
  ON public.followup_items FOR SELECT
  USING (organization_id = get_user_organization_id(auth.uid()));

CREATE POLICY "Editors can create followups"
  ON public.followup_items FOR INSERT
  WITH CHECK (organization_id = get_user_organization_id(auth.uid())
    AND (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role)));

CREATE POLICY "Editors can update followups"
  ON public.followup_items FOR UPDATE
  USING (organization_id = get_user_organization_id(auth.uid())
    AND (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role)));

-- =====================================================
-- REMINDERS TABLE
-- =====================================================
CREATE TABLE public.reminders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  followup_item_id UUID NOT NULL REFERENCES public.followup_items(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  channel reminder_channel NOT NULL DEFAULT 'in_app',
  recipient_email TEXT,
  recipient_phone TEXT,
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE,
  status reminder_status NOT NULL DEFAULT 'queued',
  message_content TEXT,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view reminders in their organization"
  ON public.reminders FOR SELECT
  USING (organization_id = get_user_organization_id(auth.uid()));

CREATE POLICY "System can manage reminders"
  ON public.reminders FOR ALL
  USING (organization_id = get_user_organization_id(auth.uid())
    AND (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role)));

-- =====================================================
-- ESCALATIONS TABLE
-- =====================================================
CREATE TABLE public.escalations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  followup_item_id UUID NOT NULL REFERENCES public.followup_items(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  level escalation_level NOT NULL DEFAULT '1',
  trigger_at TIMESTAMP WITH TIME ZONE NOT NULL,
  target_role owner_role NOT NULL DEFAULT 'clinician',
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'triggered', 'resolved'
  triggered_at TIMESTAMP WITH TIME ZONE,
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.escalations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view escalations in their organization"
  ON public.escalations FOR SELECT
  USING (organization_id = get_user_organization_id(auth.uid()));

CREATE POLICY "Editors can manage escalations"
  ON public.escalations FOR ALL
  USING (organization_id = get_user_organization_id(auth.uid())
    AND (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role)));

-- =====================================================
-- ASSISTANT_NOTES TABLE (slip-checks, summaries)
-- =====================================================
CREATE TABLE public.assistant_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
  note_type note_type NOT NULL,
  content TEXT NOT NULL,
  citations_json JSONB DEFAULT '[]'::jsonb, -- array of event/followup IDs
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.assistant_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view notes in their organization"
  ON public.assistant_notes FOR SELECT
  USING (organization_id = get_user_organization_id(auth.uid()));

CREATE POLICY "System can create notes"
  ON public.assistant_notes FOR INSERT
  WITH CHECK (organization_id = get_user_organization_id(auth.uid()));

-- =====================================================
-- SLA_POLICIES TABLE (org-specific rules)
-- =====================================================
CREATE TABLE public.sla_policies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  event_type event_type NOT NULL,
  condition_json JSONB DEFAULT '{}'::jsonb, -- optional conditions
  due_in_days INTEGER NOT NULL DEFAULT 7,
  escalation_schedule_json JSONB DEFAULT '[7, 14, 21]'::jsonb, -- days after due
  reminder_schedule_json JSONB DEFAULT '[0, -2, 0]'::jsonb, -- relative to due (0=immediately, -2=2 days before)
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(organization_id, event_type)
);

ALTER TABLE public.sla_policies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view SLA policies in their organization"
  ON public.sla_policies FOR SELECT
  USING (organization_id = get_user_organization_id(auth.uid()));

CREATE POLICY "Admins can manage SLA policies"
  ON public.sla_policies FOR ALL
  USING (organization_id = get_user_organization_id(auth.uid())
    AND has_role(auth.uid(), 'admin'::app_role));

-- =====================================================
-- AUDIT_LOG TABLE (append-only)
-- =====================================================
CREATE TABLE public.audit_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL, -- 'create', 'update', 'delete', 'send_reminder', 'escalate'
  entity_type TEXT NOT NULL, -- 'patient', 'event', 'followup_item', 'reminder', etc.
  entity_id UUID NOT NULL,
  before_state JSONB,
  after_state JSONB,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view audit logs in their organization"
  ON public.audit_log FOR SELECT
  USING (organization_id = get_user_organization_id(auth.uid()));

CREATE POLICY "System can insert audit logs"
  ON public.audit_log FOR INSERT
  WITH CHECK (organization_id = get_user_organization_id(auth.uid()));

-- Block updates and deletes on audit_log
CREATE POLICY "Block UPDATE on audit_log"
  ON public.audit_log FOR UPDATE
  USING (false);

CREATE POLICY "Block DELETE on audit_log"
  ON public.audit_log FOR DELETE
  USING (false);

-- =====================================================
-- INDEXES for performance
-- =====================================================
CREATE INDEX idx_patients_org ON public.patients(organization_id);
CREATE INDEX idx_events_org_patient ON public.events(organization_id, patient_id);
CREATE INDEX idx_events_type_processed ON public.events(type, processed);
CREATE INDEX idx_followup_items_org_status ON public.followup_items(organization_id, status);
CREATE INDEX idx_followup_items_due_at ON public.followup_items(due_at) WHERE status IN ('open', 'in_progress');
CREATE INDEX idx_reminders_scheduled ON public.reminders(scheduled_at, status) WHERE status = 'queued';
CREATE INDEX idx_escalations_trigger ON public.escalations(trigger_at, status) WHERE status = 'pending';
CREATE INDEX idx_audit_log_entity ON public.audit_log(entity_type, entity_id);

-- =====================================================
-- TRIGGERS for updated_at
-- =====================================================
CREATE TRIGGER update_patients_updated_at
  BEFORE UPDATE ON public.patients
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_followup_items_updated_at
  BEFORE UPDATE ON public.followup_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sla_policies_updated_at
  BEFORE UPDATE ON public.sla_policies
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- FUNCTION: Create follow-up items from events (rules engine)
-- =====================================================
CREATE OR REPLACE FUNCTION public.process_event_to_followup()
RETURNS TRIGGER AS $$
DECLARE
  sla_policy RECORD;
  due_date TIMESTAMP WITH TIME ZONE;
  followup_category followup_category;
  followup_description TEXT;
  new_followup_id UUID;
BEGIN
  -- Skip if already processed
  IF NEW.processed THEN
    RETURN NEW;
  END IF;

  -- Get SLA policy for this event type and organization
  SELECT * INTO sla_policy
  FROM public.sla_policies
  WHERE organization_id = NEW.organization_id
    AND event_type = NEW.type
    AND is_active = true
  LIMIT 1;

  -- If no policy, use defaults
  IF NOT FOUND THEN
    sla_policy := ROW(
      NULL, -- id
      NEW.organization_id,
      NEW.type,
      '{}'::jsonb,
      7, -- due_in_days
      '[7, 14, 21]'::jsonb,
      '[0, -2, 0]'::jsonb,
      true,
      now(),
      now()
    )::sla_policies;
  END IF;

  -- Determine follow-up based on event type
  CASE NEW.type
    WHEN 'referral' THEN
      followup_category := 'schedule_appointment';
      followup_description := 'Schedule appointment for referral';
    WHEN 'lab_result' THEN
      followup_category := 'review_result';
      followup_description := 'Review and acknowledge lab result';
    WHEN 'discharge' THEN
      followup_category := 'schedule_appointment';
      followup_description := 'Schedule follow-up visit after discharge';
    WHEN 'visit_note' THEN
      followup_category := 'admin_other';
      followup_description := 'Review visit notes and action items';
    WHEN 'message' THEN
      followup_category := 'admin_other';
      followup_description := 'Respond to patient message';
    WHEN 'appointment' THEN
      -- Appointments don't create follow-ups by default
      NEW.processed := true;
      RETURN NEW;
    ELSE
      followup_category := 'admin_other';
      followup_description := 'Review event';
  END CASE;

  -- Calculate due date
  due_date := NEW.occurred_at + (sla_policy.due_in_days || ' days')::interval;

  -- Create follow-up item
  INSERT INTO public.followup_items (
    organization_id,
    patient_id,
    event_id,
    category,
    description,
    due_at,
    priority,
    status,
    owner_role,
    created_by
  ) VALUES (
    NEW.organization_id,
    NEW.patient_id,
    NEW.id,
    followup_category,
    followup_description,
    due_date,
    CASE 
      WHEN NEW.type IN ('lab_result', 'discharge') THEN 'high'::priority_level
      WHEN NEW.type = 'referral' THEN 'medium'::priority_level
      ELSE 'low'::priority_level
    END,
    'open',
    'staff',
    'assistant'
  ) RETURNING id INTO new_followup_id;

  -- Create initial reminders
  -- Reminder 1: immediately (or next morning)
  INSERT INTO public.reminders (followup_item_id, organization_id, channel, scheduled_at)
  VALUES (new_followup_id, NEW.organization_id, 'in_app', 
    CASE 
      WHEN EXTRACT(HOUR FROM now()) < 9 THEN date_trunc('day', now()) + interval '9 hours'
      ELSE now() + interval '1 minute'
    END
  );

  -- Reminder 2: 2 days before due date
  IF due_date - interval '2 days' > now() THEN
    INSERT INTO public.reminders (followup_item_id, organization_id, channel, scheduled_at)
    VALUES (new_followup_id, NEW.organization_id, 'email', due_date - interval '2 days');
  END IF;

  -- Reminder 3: on due date
  INSERT INTO public.reminders (followup_item_id, organization_id, channel, scheduled_at)
  VALUES (new_followup_id, NEW.organization_id, 'email', due_date);

  -- Create escalation entries
  INSERT INTO public.escalations (followup_item_id, organization_id, level, trigger_at, target_role)
  VALUES 
    (new_followup_id, NEW.organization_id, '1', due_date + interval '7 days', 'staff'),
    (new_followup_id, NEW.organization_id, '2', due_date + interval '14 days', 'clinician'),
    (new_followup_id, NEW.organization_id, '3', due_date + interval '21 days', 'clinician');

  -- Mark event as processed
  NEW.processed := true;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to process events
CREATE TRIGGER trigger_process_event
  BEFORE INSERT OR UPDATE ON public.events
  FOR EACH ROW
  WHEN (NEW.processed = false)
  EXECUTE FUNCTION public.process_event_to_followup();

-- =====================================================
-- FUNCTION: Get slip-check summary for organization
-- =====================================================
CREATE OR REPLACE FUNCTION public.get_slip_check_summary(org_id UUID)
RETURNS TABLE (
  open_count BIGINT,
  overdue_count BIGINT,
  unassigned_count BIGINT,
  high_priority_overdue BIGINT,
  referrals_without_appointments BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*) FILTER (WHERE f.status IN ('open', 'in_progress')) as open_count,
    COUNT(*) FILTER (WHERE f.status IN ('open', 'in_progress') AND f.due_at < now()) as overdue_count,
    COUNT(*) FILTER (WHERE f.status IN ('open', 'in_progress') AND f.assigned_to IS NULL) as unassigned_count,
    COUNT(*) FILTER (WHERE f.status IN ('open', 'in_progress') AND f.due_at < now() AND f.priority = 'high') as high_priority_overdue,
    (
      SELECT COUNT(*)
      FROM public.events e
      LEFT JOIN public.followup_items fi ON fi.event_id = e.id AND fi.status = 'done'
      WHERE e.organization_id = org_id
        AND e.type = 'referral'
        AND fi.id IS NULL
    ) as referrals_without_appointments
  FROM public.followup_items f
  WHERE f.organization_id = org_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- =====================================================
-- Insert default SLA policies for new organizations (trigger)
-- =====================================================
CREATE OR REPLACE FUNCTION public.create_default_sla_policies()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.sla_policies (organization_id, event_type, due_in_days, escalation_schedule_json)
  VALUES 
    (NEW.id, 'referral', 7, '[7, 14, 21]'),
    (NEW.id, 'lab_result', 3, '[3, 7, 14]'),
    (NEW.id, 'discharge', 7, '[7, 14, 21]'),
    (NEW.id, 'visit_note', 14, '[7, 14, 28]'),
    (NEW.id, 'message', 2, '[2, 5, 7]');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER trigger_create_default_sla
  AFTER INSERT ON public.organizations
  FOR EACH ROW
  EXECUTE FUNCTION public.create_default_sla_policies();