import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { usePermissions } from './usePermissions';

interface DashboardStats {
  sourcesCount: number;
  automationsCount: number;
  totalRuns: number;
  filesCount: number;
}

interface UsageData {
  rowsProcessed: number;
  maxRows: number;
  automationRuns: number;
  maxAutomationRuns: number;
  filesUploaded: number;
  maxFiles: number;
  sourcesCount: number;
  maxSources: number;
  planType: string;
  isViewOnly: boolean;
  gracePeriodEndsAt: string | null;
}

interface TeamMember {
  id: string;
  email: string;
  name: string | null;
  role: 'admin' | 'editor' | 'viewer';
}

interface RecentActivity {
  id: string;
  type: 'upload' | 'automation' | 'source';
  name: string;
  status: 'success' | 'processing' | 'error';
  createdAt: string;
}

export function useDashboardData() {
  const { organization, isAdmin } = useAuth();
  const { canView } = usePermissions();
  const [stats, setStats] = useState<DashboardStats>({
    sourcesCount: 0,
    automationsCount: 0,
    totalRuns: 0,
    filesCount: 0,
  });
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Polling ref for processing files
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  const fetchDashboardData = useCallback(async (showLoading = false) => {
    if (!organization?.id) return;

    if (showLoading) {
      setIsLoading(true);
    }
    setError(null);

    try {
      // Fetch stats in parallel
      const [sourcesRes, automationsRes, runsRes, filesRes] = await Promise.all([
        supabase.from('sources').select('id', { count: 'exact', head: true }),
        supabase.from('automations').select('id', { count: 'exact', head: true }),
        supabase.from('automation_runs').select('id', { count: 'exact', head: true }),
        supabase.from('files').select('id', { count: 'exact', head: true }),
      ]);

      setStats({
        sourcesCount: sourcesRes.count || 0,
        automationsCount: automationsRes.count || 0,
        totalRuns: runsRes.count || 0,
        filesCount: filesRes.count || 0,
      });

      // Only admins can view usage stats
      if (isAdmin) {
        const usageRes = await supabase
          .from('usage_stats')
          .select('*')
          .eq('organization_id', organization.id)
          .single();

        if (usageRes.data) {
          setUsage({
            rowsProcessed: usageRes.data.rows_processed_month || 0,
            maxRows: usageRes.data.max_rows_month || 1000,
            automationRuns: usageRes.data.automation_runs_month || 0,
            maxAutomationRuns: usageRes.data.max_automation_runs_month || 50,
            filesUploaded: usageRes.data.files_uploaded_month || 0,
            maxFiles: usageRes.data.max_files_month || 10,
            sourcesCount: usageRes.data.sources_count || 0,
            maxSources: usageRes.data.max_sources || 3,
            planType: usageRes.data.plan_type || 'free',
            isViewOnly: usageRes.data.is_view_only || false,
            gracePeriodEndsAt: usageRes.data.grace_period_ends_at,
          });
        }
      }

      // Fetch team members with roles
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, email, name, organization_id')
        .eq('organization_id', organization.id);

      // Only admins can see team members (they have access to profiles)
      if (isAdmin && profiles) {
        const { data: roles } = await supabase
          .from('user_roles')
          .select('user_id, role');

        const membersWithRoles = profiles.map(profile => ({
          id: profile.id,
          email: profile.email,
          name: profile.name,
          role: (roles?.find(r => r.user_id === profile.id)?.role || 'viewer') as 'admin' | 'editor' | 'viewer',
        }));

        setTeamMembers(membersWithRoles);
      } else if (profiles) {
        // Non-admins can only see their own profile
        setTeamMembers(profiles.map(profile => ({
          id: profile.id,
          email: profile.email,
          name: profile.name,
          role: 'viewer' as 'admin' | 'editor' | 'viewer',
        })));
      }

      // Fetch recent activity (files + automation runs)
      const [recentFilesRes, runsActivityRes] = await Promise.all([
        supabase
          .from('files')
          .select('id, name, status, created_at')
          .order('created_at', { ascending: false })
          .limit(5),
        supabase
          .from('automation_runs')
          .select('id, status, started_at, automations(name)')
          .order('started_at', { ascending: false })
          .limit(5),
      ]);

      const activities: RecentActivity[] = [];

      if (recentFilesRes.data) {
        recentFilesRes.data.forEach(file => {
          activities.push({
            id: file.id,
            type: 'upload',
            name: file.name,
            status: file.status === 'processed' ? 'success' : file.status === 'error' ? 'error' : 'processing',
            createdAt: file.created_at,
          });
        });
      }

      if (runsActivityRes.data) {
        runsActivityRes.data.forEach((run: any) => {
          activities.push({
            id: run.id,
            type: 'automation',
            name: run.automations?.name || 'Automation',
            status: run.status === 'completed' ? 'success' : run.status === 'failed' ? 'error' : 'processing',
            createdAt: run.started_at,
          });
        });
      }

      // Sort by date and take top 10
      activities.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setRecentActivity(activities.slice(0, 10));

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  }, [organization?.id, isAdmin]);

  // Check if any recent activities are in processing state
  const hasProcessingItems = recentActivity.some(a => a.status === 'processing');

  useEffect(() => {
    if (!organization?.id) {
      setIsLoading(false);
      return;
    }

    fetchDashboardData(true);

    // Set up realtime subscription for updates
    const channel = supabase
      .channel('dashboard-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'sources' }, () => {
        fetchDashboardData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'automations' }, () => {
        fetchDashboardData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'automation_runs' }, () => {
        fetchDashboardData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'files' }, () => {
        fetchDashboardData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'usage_stats' }, () => {
        fetchDashboardData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [organization?.id, isAdmin, fetchDashboardData]);

  // Status polling for items in processing state (fallback for realtime)
  useEffect(() => {
    // Clear any existing polling
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }

    // Start polling if there are items in processing state
    if (hasProcessingItems && organization?.id) {
      pollingRef.current = setInterval(() => {
        fetchDashboardData();
      }, 3000); // Poll every 3 seconds
    }

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };
  }, [hasProcessingItems, organization?.id, fetchDashboardData]);

  return { 
    stats, 
    usage, 
    teamMembers, 
    recentActivity, 
    isLoading, 
    error, 
    isAdmin,
    refetch: () => fetchDashboardData(false),
  };
}
