-- Create sources table for data sources (spreadsheets, APIs, etc.)
CREATE TABLE public.sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  created_by UUID NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('spreadsheet', 'api', 'database', 'file')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('active', 'processing', 'error', 'pending')),
  config JSONB DEFAULT '{}',
  record_count INTEGER DEFAULT 0,
  last_sync_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create files table for uploaded files
CREATE TABLE public.files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  source_id UUID REFERENCES public.sources(id) ON DELETE SET NULL,
  uploaded_by UUID NOT NULL,
  name TEXT NOT NULL,
  original_name TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size_bytes BIGINT NOT NULL,
  storage_path TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'uploaded' CHECK (status IN ('uploaded', 'processing', 'processed', 'error')),
  ocr_confidence NUMERIC(5,2),
  text_direction TEXT DEFAULT 'auto' CHECK (text_direction IN ('ltr', 'rtl', 'auto', 'mixed')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create automations table
CREATE TABLE public.automations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  created_by UUID NOT NULL,
  name TEXT NOT NULL,
  trigger_type TEXT NOT NULL CHECK (trigger_type IN ('new_data', 'schedule', 'manual', 'webhook')),
  trigger_config JSONB DEFAULT '{}',
  source_id UUID REFERENCES public.sources(id) ON DELETE SET NULL,
  action_type TEXT NOT NULL CHECK (action_type IN ('notify', 'export', 'transform', 'api_call')),
  action_config JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create automation_runs table for tracking runs
CREATE TABLE public.automation_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  automation_id UUID NOT NULL REFERENCES public.automations(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'running' CHECK (status IN ('running', 'completed', 'failed', 'cancelled')),
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  rows_processed INTEGER DEFAULT 0,
  error_message TEXT,
  result JSONB DEFAULT '{}'
);

-- Create usage_stats table for tracking limits
CREATE TABLE public.usage_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE UNIQUE,
  plan_type TEXT NOT NULL DEFAULT 'free' CHECK (plan_type IN ('free', 'pro', 'enterprise')),
  rows_processed_month INTEGER DEFAULT 0,
  files_uploaded_month INTEGER DEFAULT 0,
  automation_runs_month INTEGER DEFAULT 0,
  sources_count INTEGER DEFAULT 0,
  -- Limits based on plan
  max_rows_month INTEGER DEFAULT 1000,
  max_files_month INTEGER DEFAULT 10,
  max_automation_runs_month INTEGER DEFAULT 50,
  max_sources INTEGER DEFAULT 3,
  -- Grace period tracking
  limits_exceeded_at TIMESTAMP WITH TIME ZONE,
  grace_period_ends_at TIMESTAMP WITH TIME ZONE,
  is_view_only BOOLEAN DEFAULT false,
  billing_cycle_start TIMESTAMP WITH TIME ZONE DEFAULT date_trunc('month', now()),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automation_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_stats ENABLE ROW LEVEL SECURITY;

-- Sources policies
CREATE POLICY "Users can view sources in their organization"
ON public.sources FOR SELECT
USING (organization_id = get_user_organization_id(auth.uid()));

CREATE POLICY "Editors can create sources"
ON public.sources FOR INSERT
WITH CHECK (
  organization_id = get_user_organization_id(auth.uid()) 
  AND (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'editor'))
);

CREATE POLICY "Editors can update sources"
ON public.sources FOR UPDATE
USING (
  organization_id = get_user_organization_id(auth.uid()) 
  AND (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'editor'))
);

CREATE POLICY "Admins can delete sources"
ON public.sources FOR DELETE
USING (
  organization_id = get_user_organization_id(auth.uid()) 
  AND has_role(auth.uid(), 'admin')
);

-- Files policies
CREATE POLICY "Users can view files in their organization"
ON public.files FOR SELECT
USING (organization_id = get_user_organization_id(auth.uid()));

CREATE POLICY "Editors can upload files"
ON public.files FOR INSERT
WITH CHECK (
  organization_id = get_user_organization_id(auth.uid()) 
  AND (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'editor'))
);

CREATE POLICY "Editors can update files"
ON public.files FOR UPDATE
USING (
  organization_id = get_user_organization_id(auth.uid()) 
  AND (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'editor'))
);

CREATE POLICY "Admins can delete files"
ON public.files FOR DELETE
USING (
  organization_id = get_user_organization_id(auth.uid()) 
  AND has_role(auth.uid(), 'admin')
);

-- Automations policies
CREATE POLICY "Users can view automations in their organization"
ON public.automations FOR SELECT
USING (organization_id = get_user_organization_id(auth.uid()));

CREATE POLICY "Editors can create automations"
ON public.automations FOR INSERT
WITH CHECK (
  organization_id = get_user_organization_id(auth.uid()) 
  AND (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'editor'))
);

CREATE POLICY "Editors can update automations"
ON public.automations FOR UPDATE
USING (
  organization_id = get_user_organization_id(auth.uid()) 
  AND (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'editor'))
);

CREATE POLICY "Admins can delete automations"
ON public.automations FOR DELETE
USING (
  organization_id = get_user_organization_id(auth.uid()) 
  AND has_role(auth.uid(), 'admin')
);

-- Automation runs policies
CREATE POLICY "Users can view runs in their organization"
ON public.automation_runs FOR SELECT
USING (organization_id = get_user_organization_id(auth.uid()));

CREATE POLICY "System can create runs"
ON public.automation_runs FOR INSERT
WITH CHECK (organization_id = get_user_organization_id(auth.uid()));

CREATE POLICY "System can update runs"
ON public.automation_runs FOR UPDATE
USING (organization_id = get_user_organization_id(auth.uid()));

-- Usage stats policies
CREATE POLICY "Users can view their organization usage"
ON public.usage_stats FOR SELECT
USING (organization_id = get_user_organization_id(auth.uid()));

CREATE POLICY "System can manage usage stats"
ON public.usage_stats FOR ALL
USING (organization_id = get_user_organization_id(auth.uid()));

-- Create triggers for updated_at
CREATE TRIGGER update_sources_updated_at BEFORE UPDATE ON public.sources
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_files_updated_at BEFORE UPDATE ON public.files
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_automations_updated_at BEFORE UPDATE ON public.automations
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_usage_stats_updated_at BEFORE UPDATE ON public.usage_stats
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to initialize usage stats for new organizations
CREATE OR REPLACE FUNCTION public.initialize_organization_usage()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.usage_stats (organization_id)
  VALUES (NEW.id)
  ON CONFLICT (organization_id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Trigger to create usage stats when organization is created
CREATE TRIGGER on_organization_created
AFTER INSERT ON public.organizations
FOR EACH ROW EXECUTE FUNCTION public.initialize_organization_usage();

-- Function to check and enforce usage limits (returns error message or null if OK)
CREATE OR REPLACE FUNCTION public.check_usage_limit(
  _organization_id UUID,
  _limit_type TEXT
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  usage_record usage_stats%ROWTYPE;
  error_msg TEXT;
BEGIN
  SELECT * INTO usage_record FROM usage_stats WHERE organization_id = _organization_id;
  
  IF NOT FOUND THEN
    RETURN NULL; -- No limits if no record
  END IF;
  
  -- Check if in view-only mode
  IF usage_record.is_view_only THEN
    RETURN 'Your account is in view-only mode. Please upgrade to continue.';
  END IF;
  
  -- Check specific limits
  CASE _limit_type
    WHEN 'rows' THEN
      IF usage_record.rows_processed_month >= usage_record.max_rows_month THEN
        error_msg := format('Monthly row limit reached (%s/%s). Upgrade for more.', 
          usage_record.rows_processed_month, usage_record.max_rows_month);
      END IF;
    WHEN 'files' THEN
      IF usage_record.files_uploaded_month >= usage_record.max_files_month THEN
        error_msg := format('Monthly file limit reached (%s/%s). Upgrade for more.', 
          usage_record.files_uploaded_month, usage_record.max_files_month);
      END IF;
    WHEN 'automations' THEN
      IF usage_record.automation_runs_month >= usage_record.max_automation_runs_month THEN
        error_msg := format('Monthly automation runs limit reached (%s/%s). Upgrade for more.', 
          usage_record.automation_runs_month, usage_record.max_automation_runs_month);
      END IF;
    WHEN 'sources' THEN
      IF usage_record.sources_count >= usage_record.max_sources THEN
        error_msg := format('Sources limit reached (%s/%s). Upgrade for more.', 
          usage_record.sources_count, usage_record.max_sources);
      END IF;
    ELSE
      error_msg := NULL;
  END CASE;
  
  -- If limit exceeded, set grace period if not already set
  IF error_msg IS NOT NULL AND usage_record.limits_exceeded_at IS NULL THEN
    UPDATE usage_stats 
    SET limits_exceeded_at = now(),
        grace_period_ends_at = now() + interval '7 days'
    WHERE organization_id = _organization_id;
  END IF;
  
  RETURN error_msg;
END;
$$;

-- Function to increment usage counters
CREATE OR REPLACE FUNCTION public.increment_usage(
  _organization_id UUID,
  _counter_type TEXT,
  _amount INTEGER DEFAULT 1
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  CASE _counter_type
    WHEN 'rows' THEN
      UPDATE usage_stats SET rows_processed_month = rows_processed_month + _amount 
      WHERE organization_id = _organization_id;
    WHEN 'files' THEN
      UPDATE usage_stats SET files_uploaded_month = files_uploaded_month + _amount 
      WHERE organization_id = _organization_id;
    WHEN 'automations' THEN
      UPDATE usage_stats SET automation_runs_month = automation_runs_month + _amount 
      WHERE organization_id = _organization_id;
    WHEN 'sources' THEN
      UPDATE usage_stats SET sources_count = sources_count + _amount 
      WHERE organization_id = _organization_id;
  END CASE;
END;
$$;

-- Create storage bucket for file uploads
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'files',
  'files',
  false,
  52428800, -- 50MB limit
  ARRAY['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'application/pdf', 
        'text/csv', 'application/vnd.ms-excel', 
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/plain', 'application/json']
);

-- Storage policies
CREATE POLICY "Users can view files in their organization"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'files' 
  AND (storage.foldername(name))[1] = get_user_organization_id(auth.uid())::text
);

CREATE POLICY "Editors can upload files"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'files' 
  AND (storage.foldername(name))[1] = get_user_organization_id(auth.uid())::text
  AND (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'editor'))
);

CREATE POLICY "Editors can update files"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'files' 
  AND (storage.foldername(name))[1] = get_user_organization_id(auth.uid())::text
  AND (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'editor'))
);

CREATE POLICY "Admins can delete files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'files' 
  AND (storage.foldername(name))[1] = get_user_organization_id(auth.uid())::text
  AND has_role(auth.uid(), 'admin')
);