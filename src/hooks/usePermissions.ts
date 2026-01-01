import { useAuth } from './useAuth';
import type { Database } from '@/integrations/supabase/types';

type AppRole = Database['public']['Enums']['app_role'];

// Permission definitions - what each role can do
const ROLE_PERMISSIONS = {
  admin: [
    'view:dashboard',
    'view:sources',
    'edit:sources',
    'view:automations',
    'edit:automations',
    'view:settings',
    'edit:settings',
    'view:team',
    'edit:team',
    'view:billing',
    'edit:billing',
    'view:organization',
    'edit:organization',
  ],
  editor: [
    'view:dashboard',
    'view:sources',
    'edit:sources',
    'view:automations',
    'edit:automations',
    'view:settings',
    'edit:settings',
  ],
  viewer: [
    'view:dashboard',
    'view:sources',
    'view:settings',
  ],
} as const;

type Permission = typeof ROLE_PERMISSIONS.admin[number];

// Navigation items with required permissions
export interface NavPermission {
  path: string;
  requiredPermission: Permission;
}

export const NAV_PERMISSIONS: NavPermission[] = [
  { path: '/dashboard', requiredPermission: 'view:dashboard' },
  { path: '/dashboard/sources', requiredPermission: 'view:sources' },
  { path: '/dashboard/automations', requiredPermission: 'view:automations' },
  { path: '/dashboard/team', requiredPermission: 'view:team' },
  { path: '/dashboard/settings', requiredPermission: 'view:settings' },
];

export function usePermissions() {
  const { role, isLoading } = useAuth();

  const hasPermission = (permission: string): boolean => {
    if (!role) return false;
    const permissions = ROLE_PERMISSIONS[role] as readonly string[];
    return permissions.includes(permission);
  };

  const hasAnyPermission = (permissions: string[]): boolean => {
    return permissions.some(p => hasPermission(p));
  };

  const hasAllPermissions = (permissions: string[]): boolean => {
    return permissions.every(p => hasPermission(p));
  };

  const canAccessRoute = (path: string): boolean => {
    const navPermission = NAV_PERMISSIONS.find(np => np.path === path);
    if (!navPermission) return true; // If no permission defined, allow access
    return hasPermission(navPermission.requiredPermission);
  };

  const canEdit = (resource: 'sources' | 'automations' | 'settings' | 'team' | 'billing' | 'organization'): boolean => {
    return hasPermission(`edit:${resource}` as Permission);
  };

  const canView = (resource: 'dashboard' | 'sources' | 'automations' | 'settings' | 'team' | 'billing' | 'organization'): boolean => {
    return hasPermission(`view:${resource}` as Permission);
  };

  return {
    role,
    isLoading,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canAccessRoute,
    canEdit,
    canView,
  };
}

// Role label helper for localization
export function getRoleLabel(role: AppRole | null, language: 'he' | 'en'): string {
  if (!role) return '';
  
  const labels: Record<AppRole, Record<'he' | 'en', string>> = {
    admin: { he: 'מנהל', en: 'Admin' },
    editor: { he: 'עורך', en: 'Editor' },
    viewer: { he: 'צופה', en: 'Viewer' },
  };
  
  return labels[role][language];
}
