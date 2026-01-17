import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import type { Json } from '@/integrations/supabase/types';

export interface Routine {
  id: string;
  organization_id: string;
  patient_id: string;
  name: string;
  type: 'medication' | 'pickup' | 'hygiene' | 'chore' | 'gate' | 'custom';
  priority: 'critical' | 'important' | 'flexible';
  is_active: boolean;
  description: string | null;
  medication_info: Json;
  quiet_hours_start: string | null;
  quiet_hours_end: string | null;
  timezone: string;
  created_at: string;
  updated_at: string;
}

export interface ScheduleRule {
  id: string;
  routine_id: string;
  days_of_week: string[];
  time_of_day: string;
  trigger_type: string;
  trigger_description: string | null;
  is_active: boolean;
  created_at: string;
}

export interface RoutineReminder {
  id: string;
  organization_id: string;
  patient_id: string;
  routine_id: string;
  step_id: string | null;
  schedule_rule_id: string | null;
  scheduled_at: string;
  status: 'pending' | 'sent' | 'confirmed' | 'snoozed' | 'skipped' | 'escalated' | 'expired';
  escalation_level: number;
  responded_at: string | null;
  response_type: string | null;
  skip_reason: string | null;
  snooze_until: string | null;
  metadata: Json;
  created_at: string;
  updated_at: string;
  routine?: Routine;
}

export interface PatientMedication {
  id: string;
  organization_id: string;
  patient_id: string;
  name: string;
  dosage: string | null;
  instructions: string | null;
  refill_reminder_days: number | null;
  current_supply: number | null;
  last_refill_date: string | null;
  is_active: boolean;
  metadata: Json;
  created_at: string;
  updated_at: string;
}

export interface TodayRoutine {
  routine_id: string;
  routine_name: string;
  routine_type: string;
  priority: string;
  scheduled_time: string | null;
  reminder_id: string | null;
  reminder_status: string | null;
  scheduled_at: string | null;
  escalation_level: number | null;
}

export function usePatientRoutines(patientId?: string) {
  const { organization } = useAuth();
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [reminders, setReminders] = useState<RoutineReminder[]>([]);
  const [medications, setMedications] = useState<PatientMedication[]>([]);
  const [todayRoutines, setTodayRoutines] = useState<TodayRoutine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!organization?.id || !patientId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Fetch routines
      const { data: routinesData, error: routinesError } = await supabase
        .from('routines')
        .select('*')
        .eq('organization_id', organization.id)
        .eq('patient_id', patientId)
        .eq('is_active', true)
        .order('priority', { ascending: true });

      if (routinesError) throw routinesError;
      // Type assertion for the routine data
      setRoutines((routinesData || []) as unknown as Routine[]);

      // Fetch today's reminders
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const { data: remindersData, error: remindersError } = await supabase
        .from('routine_reminders')
        .select(`
          *,
          routine:routines(*)
        `)
        .eq('organization_id', organization.id)
        .eq('patient_id', patientId)
        .gte('scheduled_at', today.toISOString())
        .lt('scheduled_at', tomorrow.toISOString())
        .order('scheduled_at', { ascending: true });

      if (remindersError) throw remindersError;
      setReminders((remindersData || []) as unknown as RoutineReminder[]);

      // Fetch medications
      const { data: medsData, error: medsError } = await supabase
        .from('patient_medications')
        .select('*')
        .eq('organization_id', organization.id)
        .eq('patient_id', patientId)
        .eq('is_active', true)
        .order('name');

      if (medsError) throw medsError;
      setMedications((medsData || []) as unknown as PatientMedication[]);

      // Fetch today's routine summary using RPC
      const { data: todayData, error: todayError } = await supabase
        .rpc('get_patient_today_routines', {
          p_organization_id: organization.id,
          p_patient_id: patientId
        });

      if (todayError) {
        console.error('Today routines error:', todayError);
      } else {
        setTodayRoutines((todayData || []) as unknown as TodayRoutine[]);
      }

    } catch (err) {
      console.error('Error fetching patient routines:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  }, [organization?.id, patientId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Real-time subscription for reminders
  useEffect(() => {
    if (!organization?.id || !patientId) return;

    const channel = supabase
      .channel('patient-routines')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'routine_reminders',
        filter: `patient_id=eq.${patientId}`
      }, () => {
        fetchData();
      })
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'routines',
        filter: `patient_id=eq.${patientId}`
      }, () => {
        fetchData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [organization?.id, patientId, fetchData]);

  // Respond to a reminder
  const respondToReminder = async (
    reminderId: string,
    responseType: 'taken' | 'snoozed' | 'skipped',
    options?: { snoozeMinutes?: number; skipReason?: string }
  ) => {
    const updateData: Record<string, unknown> = {
      response_type: responseType,
      responded_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (responseType === 'taken') {
      updateData.status = 'confirmed';
    } else if (responseType === 'snoozed' && options?.snoozeMinutes) {
      updateData.status = 'snoozed';
      const snoozeUntil = new Date();
      snoozeUntil.setMinutes(snoozeUntil.getMinutes() + options.snoozeMinutes);
      updateData.snooze_until = snoozeUntil.toISOString();
    } else if (responseType === 'skipped') {
      updateData.status = 'skipped';
      updateData.skip_reason = options?.skipReason || null;
    }

    const { error } = await supabase
      .from('routine_reminders')
      .update(updateData)
      .eq('id', reminderId);

    if (error) throw error;

    // Log completion
    const reminder = reminders.find(r => r.id === reminderId);
    if (reminder) {
      await supabase.from('routine_completions').insert({
        organization_id: organization!.id,
        patient_id: patientId,
        routine_id: reminder.routine_id,
        reminder_id: reminderId,
        completion_type: responseType === 'taken' ? 'confirmed' : responseType,
        notes: options?.skipReason,
      });
    }

    await fetchData();
  };

  // Create a medication routine
  const createMedicationRoutine = async (
    name: string,
    scheduleTime: string,
    daysOfWeek: string[],
    medicationInfo?: { dosage?: string; instructions?: string }
  ) => {
    if (!organization?.id || !patientId) throw new Error('No organization or patient');

    // Create routine
    const { data: routine, error: routineError } = await supabase
      .from('routines')
      .insert({
        organization_id: organization.id,
        patient_id: patientId,
        name,
        type: 'medication',
        priority: 'critical',
        medication_info: medicationInfo || {},
      })
      .select()
      .single();

    if (routineError) throw routineError;

    // Create schedule rule
    const { error: scheduleError } = await supabase
      .from('schedule_rules')
      .insert([{
        routine_id: routine.id,
        days_of_week: daysOfWeek as ("friday" | "monday" | "saturday" | "sunday" | "thursday" | "tuesday" | "wednesday")[],
        time_of_day: scheduleTime,
        trigger_type: 'clock',
      }]);

    if (scheduleError) throw scheduleError;

    await fetchData();
    return routine;
  };

  // Add medication to patient
  const addMedication = async (
    name: string,
    dosage?: string,
    instructions?: string
  ) => {
    if (!organization?.id || !patientId) throw new Error('No organization or patient');

    const { data, error } = await supabase
      .from('patient_medications')
      .insert({
        organization_id: organization.id,
        patient_id: patientId,
        name,
        dosage: dosage || null,
        instructions: instructions || null,
      })
      .select()
      .single();

    if (error) throw error;
    await fetchData();
    return data;
  };

  // Generate reminders for today (call on schedule or when app opens)
  const generateTodayReminders = async () => {
    if (!organization?.id || !patientId) return;

    const today = new Date();
    const dayOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][today.getDay()];

    // Get all active schedule rules for patient's routines
    const { data: rules, error: rulesError } = await supabase
      .from('schedule_rules')
      .select(`
        *,
        routine:routines!inner(*)
      `)
      .eq('is_active', true)
      .contains('days_of_week', [dayOfWeek]);

    if (rulesError) {
      console.error('Error fetching schedule rules:', rulesError);
      return;
    }

    // Filter for this patient's routines
    const patientRules = (rules || []).filter(
      (r: Record<string, unknown>) => (r.routine as Record<string, unknown>)?.patient_id === patientId
    );

    for (const rule of patientRules) {
      const routine = rule.routine as Routine;
      
      // Create scheduled time for today
      const [hours, minutes] = rule.time_of_day.split(':').map(Number);
      const scheduledAt = new Date(today);
      scheduledAt.setHours(hours, minutes, 0, 0);

      // Check if reminder already exists for this time
      const { data: existing } = await supabase
        .from('routine_reminders')
        .select('id')
        .eq('routine_id', routine.id)
        .eq('schedule_rule_id', rule.id)
        .gte('scheduled_at', today.toISOString().split('T')[0])
        .lt('scheduled_at', new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0])
        .single();

      if (!existing) {
        await supabase.from('routine_reminders').insert({
          organization_id: organization.id,
          patient_id: patientId,
          routine_id: routine.id,
          schedule_rule_id: rule.id,
          scheduled_at: scheduledAt.toISOString(),
          status: 'pending',
        });
      }
    }

    await fetchData();
  };

  // Get categorized reminders for NOW/NEXT/TODAY view
  const getNowNextToday = useCallback(() => {
    const now = new Date();
    const pendingReminders = reminders.filter(r => 
      r.status === 'pending' || r.status === 'sent' || r.status === 'snoozed'
    );

    // NOW: Current or overdue items (critical priority first)
    const nowItems = pendingReminders.filter(r => {
      const scheduled = new Date(r.scheduled_at);
      const isPast = scheduled <= now;
      const isCritical = r.routine?.priority === 'critical';
      return isPast || (isCritical && scheduled <= new Date(now.getTime() + 15 * 60 * 1000));
    }).sort((a, b) => {
      // Critical first, then by time
      if (a.routine?.priority === 'critical' && b.routine?.priority !== 'critical') return -1;
      if (b.routine?.priority === 'critical' && a.routine?.priority !== 'critical') return 1;
      return new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime();
    });

    // NEXT: Upcoming in next 2 hours
    const nextItems = pendingReminders.filter(r => {
      const scheduled = new Date(r.scheduled_at);
      return scheduled > now && scheduled <= new Date(now.getTime() + 2 * 60 * 60 * 1000);
    }).slice(0, 5);

    // TODAY: Everything else for today
    const todayItems = pendingReminders.filter(r => {
      const scheduled = new Date(r.scheduled_at);
      return scheduled > new Date(now.getTime() + 2 * 60 * 60 * 1000);
    });

    return { now: nowItems, next: nextItems, today: todayItems };
  }, [reminders]);

  return {
    routines,
    reminders,
    medications,
    todayRoutines,
    isLoading,
    error,
    refetch: fetchData,
    respondToReminder,
    createMedicationRoutine,
    addMedication,
    generateTodayReminders,
    getNowNextToday,
  };
}
