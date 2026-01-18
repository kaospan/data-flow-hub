import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import type { Json } from '@/integrations/supabase/types';

export interface MedicalItem {
  id: string;
  organization_id: string;
  patient_id: string;
  kind: 'document' | 'image' | 'note';
  title: string;
  storage_url: string | null;
  tags: string[];
  extracted_text: string | null;
  metadata: Json;
  created_at: string;
  updated_at: string;
}

export interface RoutineDependency {
  id: string;
  from_step_id: string;
  to_step_id: string;
  delay_minutes: number;
  next_fire_strategy: 'schedule_after' | 'schedule_at_time' | 'immediate';
}

export interface DashboardData {
  nowItems: Json[];
  nextItems: Json[];
  todayItems: Json[];
  overdueCount: number;
  pendingCount: number;
  completedCount: number;
  gateCleared: boolean;
}

export function usePatientDashboard(patientId?: string) {
  const { organization } = useAuth();
  const [medicalItems, setMedicalItems] = useState<MedicalItem[]>([]);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMedicalItems = useCallback(async () => {
    if (!organization?.id || !patientId) return;

    const { data, error } = await supabase
      .from('medical_items')
      .select('*')
      .eq('organization_id', organization.id)
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching medical items:', error);
      return;
    }

    setMedicalItems((data || []).map(item => ({
      ...item,
      kind: item.kind as 'document' | 'image' | 'note',
      tags: Array.isArray(item.tags) ? item.tags as string[] : [],
    })));
  }, [organization?.id, patientId]);

  const fetchDashboardData = useCallback(async () => {
    if (!organization?.id || !patientId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Get counts manually since we removed the complex function
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const { data: reminders, error: remindersError } = await supabase
        .from('routine_reminders')
        .select('*, routine:routines(*)')
        .eq('organization_id', organization.id)
        .eq('patient_id', patientId)
        .gte('scheduled_at', today.toISOString())
        .lt('scheduled_at', tomorrow.toISOString())
        .order('scheduled_at', { ascending: true });

      if (remindersError) throw remindersError;

      const now = new Date();
      const pending = (reminders || []).filter(r => ['pending', 'sent', 'snoozed'].includes(r.status));
      const overdue = pending.filter(r => new Date(r.scheduled_at) < now);
      const completed = (reminders || []).filter(r => r.status === 'confirmed');

      // Categorize into NOW/NEXT/TODAY
      const nowItems = pending.filter(r => {
        const scheduled = new Date(r.scheduled_at);
        const isPast = scheduled <= now;
        const routine = r.routine as Record<string, unknown> | null;
        const isCritical = routine?.priority === 'critical';
        return isPast || (isCritical && scheduled <= new Date(now.getTime() + 15 * 60 * 1000));
      });

      const nextItems = pending.filter(r => {
        const scheduled = new Date(r.scheduled_at);
        return scheduled > now && scheduled <= new Date(now.getTime() + 2 * 60 * 60 * 1000);
      }).slice(0, 5);

      const todayItems = pending.filter(r => {
        const scheduled = new Date(r.scheduled_at);
        return scheduled > new Date(now.getTime() + 2 * 60 * 60 * 1000);
      });

      // Check gate status
      const { data: gateRoutine } = await supabase
        .from('routines')
        .select('id')
        .eq('organization_id', organization.id)
        .eq('patient_id', patientId)
        .eq('type', 'gate')
        .eq('is_active', true)
        .single();

      let gateCleared = true;
      if (gateRoutine) {
        const { data: gateSteps } = await supabase
          .from('routine_steps')
          .select('id, is_optional')
          .eq('routine_id', gateRoutine.id)
          .order('step_order');

        if (gateSteps) {
          for (const step of gateSteps) {
            if (!step.is_optional) {
              const { data: completion } = await supabase
                .from('routine_completions')
                .select('id')
                .eq('step_id', step.id)
                .eq('patient_id', patientId)
                .eq('completion_type', 'confirmed')
                .gte('completed_at', today.toISOString())
                .single();

              if (!completion) {
                gateCleared = false;
                break;
              }
            }
          }
        }
      }

      setDashboardData({
        nowItems: nowItems as unknown as Json[],
        nextItems: nextItems as unknown as Json[],
        todayItems: todayItems as unknown as Json[],
        overdueCount: overdue.length,
        pendingCount: pending.length,
        completedCount: completed.length,
        gateCleared,
      });

      await fetchMedicalItems();
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard');
    } finally {
      setIsLoading(false);
    }
  }, [organization?.id, patientId, fetchMedicalItems]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Real-time subscription
  useEffect(() => {
    if (!organization?.id || !patientId) return;

    const channel = supabase
      .channel('patient-dashboard')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'medical_items',
        filter: `patient_id=eq.${patientId}`
      }, () => {
        fetchMedicalItems();
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'routine_reminders',
        filter: `patient_id=eq.${patientId}`
      }, () => {
        fetchDashboardData();
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'routine_completions',
        filter: `patient_id=eq.${patientId}`
      }, () => {
        fetchDashboardData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [organization?.id, patientId, fetchMedicalItems, fetchDashboardData]);

  // Upload medical item
  const uploadMedicalItem = async (
    file: File,
    title: string,
    kind: 'document' | 'image' | 'note',
    tags: string[] = []
  ) => {
    if (!organization?.id || !patientId) throw new Error('No organization or patient');

    // Upload file to storage
    const filePath = `${organization.id}/${patientId}/${Date.now()}_${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from('medical-files')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('medical-files')
      .getPublicUrl(filePath);

    // Create medical item record
    const { data, error } = await supabase
      .from('medical_items')
      .insert({
        organization_id: organization.id,
        patient_id: patientId,
        kind,
        title,
        storage_url: urlData.publicUrl,
        tags: tags as unknown as Json,
        metadata: { original_name: file.name, size: file.size, type: file.type },
      })
      .select()
      .single();

    if (error) throw error;

    // Log audit entry
    await supabase.rpc('log_audit_entry', {
      p_organization_id: organization.id,
      p_action: 'upload',
      p_entity_type: 'medical_item',
      p_entity_id: data.id,
      p_after_state: data as unknown as Json,
    });

    await fetchMedicalItems();
    return data;
  };

  // Add note
  const addMedicalNote = async (title: string, content: string, tags: string[] = []) => {
    if (!organization?.id || !patientId) throw new Error('No organization or patient');

    const { data, error } = await supabase
      .from('medical_items')
      .insert({
        organization_id: organization.id,
        patient_id: patientId,
        kind: 'note',
        title,
        extracted_text: content,
        tags: tags as unknown as Json,
      })
      .select()
      .single();

    if (error) throw error;

    await supabase.rpc('log_audit_entry', {
      p_organization_id: organization.id,
      p_action: 'create',
      p_entity_type: 'medical_item',
      p_entity_id: data.id,
      p_after_state: data as unknown as Json,
    });

    await fetchMedicalItems();
    return data;
  };

  // Search medical items
  const searchMedicalItems = async (
    searchText?: string,
    kind?: string,
    tags?: string[],
    fromDate?: Date,
    toDate?: Date
  ) => {
    if (!organization?.id || !patientId) return [];

    const { data, error } = await supabase.rpc('search_medical_items', {
      p_organization_id: organization.id,
      p_patient_id: patientId,
      p_search_text: searchText || null,
      p_kind: kind || null,
      p_tags: tags || null,
      p_from_date: fromDate?.toISOString() || null,
      p_to_date: toDate?.toISOString() || null,
    });

    if (error) {
      console.error('Error searching medical items:', error);
      return [];
    }

    return (data || []).map((item: Record<string, unknown>) => ({
      ...item,
      kind: item.kind as 'document' | 'image' | 'note',
      tags: Array.isArray(item.tags) ? item.tags as string[] : [],
    })) as MedicalItem[];
  };

  return {
    medicalItems,
    dashboardData,
    isLoading,
    error,
    refetch: fetchDashboardData,
    uploadMedicalItem,
    addMedicalNote,
    searchMedicalItems,
  };
}
