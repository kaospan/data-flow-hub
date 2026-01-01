import { ReactNode } from 'react';
import { usePermissions } from '@/hooks/usePermissions';
import type { Database } from '@/integrations/supabase/types';

type AppRole = Database['public']['Enums']['app_role'];

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles?: AppRole[];
  requiredPermission?: string;
  fallback?: ReactNode;
}

/**
 * RoleGuard - Conditionally renders children based on user's role
 * Use this to hide UI elements that shouldn't be visible to certain roles
 * 
 * @param allowedRoles - Array of roles that can see the content
 * @param requiredPermission - Alternative: specific permission required
 * @param fallback - Optional component to render if access is denied
 */
export function RoleGuard({ 
  children, 
  allowedRoles, 
  requiredPermission,
  fallback = null 
}: RoleGuardProps) {
  const { role, hasPermission, isLoading } = usePermissions();

  // Don't render anything while loading
  if (isLoading) return null;

  // If no role, deny access
  if (!role) return <>{fallback}</>;

  // Check by allowed roles
  if (allowedRoles) {
    if (!allowedRoles.includes(role)) {
      return <>{fallback}</>;
    }
  }

  // Check by permission
  if (requiredPermission) {
    if (!hasPermission(requiredPermission as any)) {
      return <>{fallback}</>;
    }
  }

  return <>{children}</>;
}

// Convenience components for common role checks
export function AdminOnly({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return <RoleGuard allowedRoles={['admin']} fallback={fallback}>{children}</RoleGuard>;
}

export function EditorOrAbove({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return <RoleGuard allowedRoles={['admin', 'editor']} fallback={fallback}>{children}</RoleGuard>;
}

export function CanEdit({ 
  resource, 
  children, 
  fallback 
}: { 
  resource: 'sources' | 'automations' | 'settings' | 'team' | 'billing' | 'organization';
  children: ReactNode; 
  fallback?: ReactNode;
}) {
  return (
    <RoleGuard requiredPermission={`edit:${resource}`} fallback={fallback}>
      {children}
    </RoleGuard>
  );
}
