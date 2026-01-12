import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import type { Json } from '@/integrations/supabase/types';

export interface Patient {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  contact_preferences: Json;
  consent_flags: Json;
  created_at: string;
}

export interface FollowupItem {
  id: string;
  patient_id: string;
  event_id: string | null;
  category: string;
  description: string;
  due_at: string;
  priority: string;
  status: string;
  closure_reason: string | null;
  owner_role: string;
  assigned_to: string | null;
  created_by: string;
  created_at: string;
  patients?: { id: string; name: string; email: string | null };
}

export interface SlipCheckSummary {
  open_count: number;
  overdue_count: number;
  unassigned_count: number;
  high_priority_overdue: number;
  referrals_without_appointments: number;
}

export function useHealITData() {
  const { organization } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [followups, setFollowups] = useState<FollowupItem[]>([]);
  const [slipCheck, setSlipCheck] = useState<SlipCheckSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!organization?.id) return;

    try {
      setIsLoading(true);
      setError(null);

      // Fetch patients
      const { data: patientsData, error: patientsError } = await supabase
        .from('patients')
        .select('*')
        .eq('organization_id', organization.id)
        .order('name');

      if (patientsError) throw patientsError;
      setPatients(patientsData || []);

      // Fetch follow-up items with patient info
      const { data: followupsData, error: followupsError } = await supabase
        .from('followup_items')
        .select(`
          *,
          patients (id, name, email)
        `)
        .eq('organization_id', organization.id)
        .in('status', ['open', 'in_progress'])
        .order('due_at', { ascending: true });

      if (followupsError) throw followupsError;
      setFollowups(followupsData || []);

      // Fetch slip check summary using RPC
      const { data: slipData, error: slipError } = await supabase
        .rpc('get_slip_check_summary', { org_id: organization.id });

      if (slipError) {
        console.error('Slip check error:', slipError);
      } else if (slipData && slipData.length > 0) {
        setSlipCheck(slipData[0]);
      }
    } catch (err) {
      console.error('Error fetching HealIT data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  }, [organization?.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Real-time subscription
  useEffect(() => {
    if (!organization?.id) return;

    const channel = supabase
      .channel('healit-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'followup_items' }, () => {
        fetchData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'patients' }, () => {
        fetchData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, () => {
        fetchData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [organization?.id, fetchData]);

  const createPatient = async (name: string, email?: string, phone?: string) => {
    if (!organization?.id) throw new Error('No organization');

    const { data, error } = await supabase
      .from('patients')
      .insert({
        organization_id: organization.id,
        name,
        email: email || null,
        phone: phone || null,
      })
      .select()
      .single();

    if (error) throw error;
    await fetchData();
    return data;
  };

  const createEvent = async (
    patientId: string,
    type: 'referral' | 'lab_result' | 'discharge' | 'visit_note' | 'message' | 'appointment',
    payload: Record<string, unknown> = {}
  ) => {
    if (!organization?.id) throw new Error('No organization');

    const { data, error } = await supabase
      .from('events')
      .insert([{
        organization_id: organization.id,
        patient_id: patientId,
        type,
        payload_json: payload as Json,
        occurred_at: new Date().toISOString(),
      }])
      .select()
      .single();

    if (error) throw error;
    await fetchData();
    return data;
  };

  const updateFollowupStatus = async (
    followupId: string,
    status: 'open' | 'in_progress' | 'done' | 'dismissed',
    closureReason?: string
  ) => {
    const { error } = await supabase
      .from('followup_items')
      .update({
        status,
        closure_reason: closureReason || null,
      })
      .eq('id', followupId);

    if (error) throw error;
    await fetchData();
  };

  return {
    patients,
    followups,
    slipCheck,
    isLoading,
    error,
    refetch: fetchData,
    createPatient,
    createEvent,
    updateFollowupStatus,
  };
}
