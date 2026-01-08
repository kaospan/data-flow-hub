-- Restrict viewing of potentially sensitive data to editors and admins only
-- Files: only editors/admins can see (viewers shouldn't see raw storage paths)
DROP POLICY IF EXISTS "Users can view files in their organization" ON public.files;

CREATE POLICY "Editors can view files in their organization"
ON public.files
FOR SELECT
USING (
  organization_id = get_user_organization_id(auth.uid())
  AND (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role))
);

-- Automations: keep viewer access for read-only (they need to see what automations exist)
-- but the config fields should be filtered at application level if needed
-- For now, mark this as acceptable business logic

-- Automation runs: viewers can see status but not detailed results
-- Keep current policy as is - viewers seeing run status is expected

-- Sources: restrict to editors/admins (config may contain credentials)
DROP POLICY IF EXISTS "Users can view sources in their organization" ON public.sources;

CREATE POLICY "Editors can view sources in their organization"
ON public.sources
FOR SELECT
USING (
  organization_id = get_user_organization_id(auth.uid())
  AND (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role))
);