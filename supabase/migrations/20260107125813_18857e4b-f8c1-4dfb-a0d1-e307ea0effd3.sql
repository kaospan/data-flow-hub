-- Fix profiles: The current policies are already correct (self + admins only)
-- The scanner may have found false positive. Let's verify by recreating cleaner policies.

-- First, let's make usage_stats more secure
DROP POLICY IF EXISTS "System can manage usage stats" ON public.usage_stats;
DROP POLICY IF EXISTS "Users can view their organization usage" ON public.usage_stats;

-- Only admins can view usage stats
CREATE POLICY "Admins can view organization usage"
ON public.usage_stats
FOR SELECT
USING (
  organization_id = get_user_organization_id(auth.uid())
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- For INSERT/UPDATE/DELETE, restrict to service role only (no direct user access)
-- The service role bypasses RLS, so regular users can't modify usage stats
-- We create a restrictive policy that effectively blocks all direct user modifications
CREATE POLICY "No direct user modifications to usage stats"
ON public.usage_stats
FOR ALL
USING (false)
WITH CHECK (false);

-- Actually, the above would block everything. Let's be smarter:
-- Allow SELECT for admins, block all modifications from regular users
DROP POLICY IF EXISTS "No direct user modifications to usage stats" ON public.usage_stats;

-- Create separate policies for each operation
CREATE POLICY "Block user INSERT on usage stats"
ON public.usage_stats
FOR INSERT
WITH CHECK (false);

CREATE POLICY "Block user UPDATE on usage stats"
ON public.usage_stats
FOR UPDATE
USING (false);

CREATE POLICY "Block user DELETE on usage stats"
ON public.usage_stats
FOR DELETE
USING (false);