-- Fix 1: Restrict email visibility in profiles - only show to admins or self
DROP POLICY IF EXISTS "Users can view profiles in their organization" ON public.profiles;

CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
USING (id = auth.uid());

CREATE POLICY "Admins can view profiles in their organization"
ON public.profiles
FOR SELECT
USING (
  organization_id = get_user_organization_id(auth.uid()) 
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Fix 2: Restrict automation_runs INSERT to admins/editors only (system actions via service role)
DROP POLICY IF EXISTS "System can create runs" ON public.automation_runs;

CREATE POLICY "Editors can create automation runs"
ON public.automation_runs
FOR INSERT
WITH CHECK (
  organization_id = get_user_organization_id(auth.uid())
  AND (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role))
);

-- Also ensure UPDATE is restricted to editors/admins
DROP POLICY IF EXISTS "System can update runs" ON public.automation_runs;

CREATE POLICY "Editors can update automation runs"
ON public.automation_runs
FOR UPDATE
USING (
  organization_id = get_user_organization_id(auth.uid())
  AND (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role))
);