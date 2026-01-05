import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface Automation {
  id: string;
  name: string;
  triggerType: 'new_data' | 'schedule' | 'manual' | 'webhook';
  triggerConfig: Record<string, any>;
  sourceId: string | null;
  sourceName?: string;
  actionType: 'notify' | 'export' | 'transform' | 'api_call';
  actionConfig: Record<string, any>;
  isActive: boolean;
  createdAt: string;
}

export interface AutomationRun {
  id: string;
  automationId: string;
  automationName?: string;
  status: 'running' | 'completed' | 'failed' | 'cancelled';
  startedAt: string;
  completedAt: string | null;
  rowsProcessed: number;
  errorMessage: string | null;
}

export function useAutomations() {
  const { organization, user } = useAuth();
  const { toast } = useToast();
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [runs, setRuns] = useState<AutomationRun[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAutomations = useCallback(async () => {
    if (!organization?.id) return;

    try {
      const { data, error: fetchError } = await supabase
        .from('automations')
        .select('*, sources(name)')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setAutomations(
        (data || []).map((a: any) => ({
          id: a.id,
          name: a.name,
          triggerType: a.trigger_type,
          triggerConfig: a.trigger_config || {},
          sourceId: a.source_id,
          sourceName: a.sources?.name,
          actionType: a.action_type,
          actionConfig: a.action_config || {},
          isActive: a.is_active,
          createdAt: a.created_at,
        }))
      );
    } catch (err) {
      console.error('Error fetching automations:', err);
      setError('Failed to load automations');
    }
  }, [organization?.id]);

  const fetchRuns = useCallback(async () => {
    if (!organization?.id) return;

    try {
      const { data, error: fetchError } = await supabase
        .from('automation_runs')
        .select('*, automations(name)')
        .order('started_at', { ascending: false })
        .limit(100);

      if (fetchError) throw fetchError;

      setRuns(
        (data || []).map((r: any) => ({
          id: r.id,
          automationId: r.automation_id,
          automationName: r.automations?.name,
          status: r.status,
          startedAt: r.started_at,
          completedAt: r.completed_at,
          rowsProcessed: r.rows_processed || 0,
          errorMessage: r.error_message,
        }))
      );
    } catch (err) {
      console.error('Error fetching runs:', err);
    }
  }, [organization?.id]);

  useEffect(() => {
    if (!organization?.id) {
      setIsLoading(false);
      return;
    }

    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchAutomations(), fetchRuns()]);
      setIsLoading(false);
    };

    loadData();

    // Realtime subscriptions
    const channel = supabase
      .channel('automations-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'automations' }, () => {
        fetchAutomations();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'automation_runs' }, () => {
        fetchRuns();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [organization?.id, fetchAutomations, fetchRuns]);

  const createAutomation = async (
    name: string,
    triggerType: Automation['triggerType'],
    actionType: Automation['actionType'],
    sourceId?: string,
    triggerConfig?: Record<string, any>,
    actionConfig?: Record<string, any>
  ) => {
    if (!organization?.id || !user?.id) {
      toast({
        title: 'Error',
        description: 'Not authenticated',
        variant: 'destructive',
      });
      return null;
    }

    try {
      const { data, error: insertError } = await supabase
        .from('automations')
        .insert({
          organization_id: organization.id,
          created_by: user.id,
          name,
          trigger_type: triggerType,
          trigger_config: triggerConfig || {},
          source_id: sourceId || null,
          action_type: actionType,
          action_config: actionConfig || {},
          is_active: true,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      toast({
        title: 'Success',
        description: 'Automation created successfully',
      });

      return data;
    } catch (err) {
      console.error('Error creating automation:', err);
      toast({
        title: 'Error',
        description: 'Failed to create automation',
        variant: 'destructive',
      });
      return null;
    }
  };

  const toggleAutomation = async (automationId: string, isActive: boolean) => {
    try {
      const { error: updateError } = await supabase
        .from('automations')
        .update({ is_active: isActive })
        .eq('id', automationId);

      if (updateError) throw updateError;

      setAutomations(prev =>
        prev.map(a => (a.id === automationId ? { ...a, isActive } : a))
      );

      toast({
        title: 'Success',
        description: isActive ? 'Automation activated' : 'Automation paused',
      });
    } catch (err) {
      console.error('Error toggling automation:', err);
      toast({
        title: 'Error',
        description: 'Failed to update automation',
        variant: 'destructive',
      });
    }
  };

  const runAutomation = async (automationId: string) => {
    if (!organization?.id) return null;

    // Check limits
    const { data: limitError } = await supabase.rpc('check_usage_limit', {
      _organization_id: organization.id,
      _limit_type: 'automations',
    });

    if (limitError) {
      toast({
        title: 'Limit Reached',
        description: limitError,
        variant: 'destructive',
      });
      return null;
    }

    try {
      // Create a run record
      const { data: run, error: insertError } = await supabase
        .from('automation_runs')
        .insert({
          automation_id: automationId,
          organization_id: organization.id,
          status: 'running',
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // Simulate automation processing
      setTimeout(async () => {
        const success = Math.random() > 0.1; // 90% success rate
        const rowsProcessed = Math.floor(Math.random() * 100) + 1;

        await supabase
          .from('automation_runs')
          .update({
            status: success ? 'completed' : 'failed',
            completed_at: new Date().toISOString(),
            rows_processed: rowsProcessed,
            error_message: success ? null : 'Simulated error for testing',
          })
          .eq('id', run.id);

        // Increment usage counter
        await supabase.rpc('increment_usage', {
          _organization_id: organization.id,
          _counter_type: 'automations',
          _amount: 1,
        });

        // Increment rows processed
        if (success) {
          await supabase.rpc('increment_usage', {
            _organization_id: organization.id,
            _counter_type: 'rows',
            _amount: rowsProcessed,
          });
        }
      }, 2000 + Math.random() * 3000);

      toast({
        title: 'Started',
        description: 'Automation is running...',
      });

      return run;
    } catch (err) {
      console.error('Error running automation:', err);
      toast({
        title: 'Error',
        description: 'Failed to run automation',
        variant: 'destructive',
      });
      return null;
    }
  };

  const deleteAutomation = async (automationId: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('automations')
        .delete()
        .eq('id', automationId);

      if (deleteError) throw deleteError;

      toast({
        title: 'Success',
        description: 'Automation deleted successfully',
      });
    } catch (err) {
      console.error('Error deleting automation:', err);
      toast({
        title: 'Error',
        description: 'Failed to delete automation',
        variant: 'destructive',
      });
    }
  };

  const getRunsForAutomation = (automationId: string) => {
    return runs.filter(r => r.automationId === automationId);
  };

  return {
    automations,
    runs,
    isLoading,
    error,
    createAutomation,
    toggleAutomation,
    runAutomation,
    deleteAutomation,
    getRunsForAutomation,
    refetch: () => {
      fetchAutomations();
      fetchRuns();
    },
  };
}
