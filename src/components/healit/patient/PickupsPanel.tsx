import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Car,
  GraduationCap,
  Baby,
  Clock,
  Plus,
  Check,
  AlertCircle,
  MapPin,
  Calendar,
} from 'lucide-react';
import { format, addMinutes, isBefore } from 'date-fns';
import { he } from 'date-fns/locale';
import { toast } from 'sonner';

interface PickupsPanelProps {
  patientId: string;
}

interface PickupRoutine {
  id: string;
  name: string;
  description: string | null;
  schedules: {
    id: string;
    time_of_day: string;
    days_of_week: string[];
    buffer_minutes: number;
  }[];
  todayReminder?: {
    id: string;
    scheduled_at: string;
    status: string;
  };
}

export function PickupsPanel({ patientId }: PickupsPanelProps) {
  const { language } = useLanguage();
  const { organization } = useAuth();
  const [pickups, setPickups] = useState<PickupRoutine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newPickup, setNewPickup] = useState({
    name: '',
    time: '15:00',
    days: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday'] as string[],
    bufferMinutes: 15,
  });

  const content = {
    he: {
      title: 'איסוף ילדים',
      noPickups: 'אין איסופים מתוזמנים',
      addPickup: 'הוסף איסוף',
      name: 'שם (למשל: איסוף מבית הספר)',
      time: 'שעת סיום',
      days: 'ימים',
      buffer: 'זמן יציאה לפני (דקות)',
      save: 'שמור',
      cancel: 'בטל',
      onMyWay: 'בדרך',
      leaveIn: 'יציאה בעוד',
      minutes: 'דקות',
      late: 'מאוחר!',
      dayNames: {
        sunday: 'א\'',
        monday: 'ב\'',
        tuesday: 'ג\'',
        wednesday: 'ד\'',
        thursday: 'ה\'',
        friday: 'ו\'',
        saturday: 'ש\'',
      },
    },
    en: {
      title: 'Kid Pickups',
      noPickups: 'No pickups scheduled',
      addPickup: 'Add Pickup',
      name: 'Name (e.g., School pickup)',
      time: 'End time',
      days: 'Days',
      buffer: 'Leave before (minutes)',
      save: 'Save',
      cancel: 'Cancel',
      onMyWay: 'On my way',
      leaveIn: 'Leave in',
      minutes: 'min',
      late: 'Late!',
      dayNames: {
        sunday: 'Sun',
        monday: 'Mon',
        tuesday: 'Tue',
        wednesday: 'Wed',
        thursday: 'Thu',
        friday: 'Fri',
        saturday: 'Sat',
      },
    },
  };

  const t = content[language];
  const locale = language === 'he' ? he : undefined;

  const fetchPickups = async () => {
    if (!organization?.id || !patientId) {
      setIsLoading(false);
      return;
    }

    try {
      // Fetch pickup routines
      const { data: routines, error } = await supabase
        .from('routines')
        .select(`
          id, name, description,
          schedule_rules (id, time_of_day, days_of_week, buffer_minutes)
        `)
        .eq('organization_id', organization.id)
        .eq('patient_id', patientId)
        .eq('type', 'pickup')
        .eq('is_active', true);

      if (error) throw error;

      // Get today's reminders
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const { data: reminders } = await supabase
        .from('routine_reminders')
        .select('id, routine_id, scheduled_at, status')
        .eq('patient_id', patientId)
        .in('routine_id', (routines || []).map(r => r.id))
        .gte('scheduled_at', today.toISOString())
        .lt('scheduled_at', tomorrow.toISOString());

      const pickupsWithReminders = (routines || []).map(routine => ({
        id: routine.id,
        name: routine.name,
        description: routine.description,
        schedules: (routine.schedule_rules || []).map((s: Record<string, unknown>) => ({
          id: s.id as string,
          time_of_day: s.time_of_day as string,
          days_of_week: s.days_of_week as string[],
          buffer_minutes: (s.buffer_minutes as number) || 15,
        })),
        todayReminder: reminders?.find(r => r.routine_id === routine.id),
      }));

      setPickups(pickupsWithReminders);
    } catch (err) {
      console.error('Error fetching pickups:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPickups();
  }, [organization?.id, patientId]);

  const handleAddPickup = async () => {
    if (!organization?.id || !patientId || !newPickup.name.trim()) return;

    try {
      // Create routine
      const { data: routine, error: routineError } = await supabase
        .from('routines')
        .insert({
          organization_id: organization.id,
          patient_id: patientId,
          name: newPickup.name,
          type: 'pickup',
          priority: 'critical',
        })
        .select()
        .single();

      if (routineError) throw routineError;

      // Create schedule rule
      const { error: scheduleError } = await supabase
        .from('schedule_rules')
        .insert({
          routine_id: routine.id,
          time_of_day: newPickup.time,
          days_of_week: newPickup.days as ("friday" | "monday" | "saturday" | "sunday" | "thursday" | "tuesday" | "wednesday")[],
          buffer_minutes: newPickup.bufferMinutes,
          trigger_type: 'clock',
        });

      if (scheduleError) throw scheduleError;

      toast.success(language === 'he' ? 'האיסוף נוסף בהצלחה' : 'Pickup added successfully');
      setShowAddDialog(false);
      setNewPickup({ name: '', time: '15:00', days: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday'], bufferMinutes: 15 });
      fetchPickups();
    } catch (err) {
      console.error('Error adding pickup:', err);
      toast.error(language === 'he' ? 'שגיאה בהוספה' : 'Failed to add');
    }
  };

  const handleOnMyWay = async (reminderId: string) => {
    try {
      await supabase
        .from('routine_reminders')
        .update({
          status: 'confirmed',
          response_type: 'on_my_way',
          responded_at: new Date().toISOString(),
        })
        .eq('id', reminderId);

      toast.success(language === 'he' ? 'בדרך!' : 'On your way!');
      fetchPickups();
    } catch (err) {
      console.error('Error updating reminder:', err);
    }
  };

  const toggleDay = (day: string) => {
    setNewPickup(prev => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day],
    }));
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  const allDays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const now = new Date();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Car className="w-5 h-5 text-amber-500" />
          {t.title}
        </h2>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4 me-1" />
              {t.addPickup}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t.addPickup}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>{t.name}</Label>
                <Input
                  value={newPickup.name}
                  onChange={(e) => setNewPickup(prev => ({ ...prev, name: e.target.value }))}
                  placeholder={language === 'he' ? 'איסוף בן מבית הספר' : 'Pick up son from school'}
                />
              </div>
              <div>
                <Label>{t.time}</Label>
                <Input
                  type="time"
                  value={newPickup.time}
                  onChange={(e) => setNewPickup(prev => ({ ...prev, time: e.target.value }))}
                />
              </div>
              <div>
                <Label>{t.days}</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {allDays.map(day => (
                    <Button
                      key={day}
                      type="button"
                      variant={newPickup.days.includes(day) ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => toggleDay(day)}
                    >
                      {t.dayNames[day as keyof typeof t.dayNames]}
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <Label>{t.buffer}</Label>
                <Input
                  type="number"
                  value={newPickup.bufferMinutes}
                  onChange={(e) => setNewPickup(prev => ({ ...prev, bufferMinutes: parseInt(e.target.value) || 15 }))}
                  min={5}
                  max={60}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                  {t.cancel}
                </Button>
                <Button onClick={handleAddPickup}>
                  {t.save}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {pickups.length === 0 ? (
        <Card className="p-8 text-center">
          <Car className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">{t.noPickups}</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {pickups.map(pickup => {
            const schedule = pickup.schedules[0];
            const reminder = pickup.todayReminder;
            const isConfirmed = reminder?.status === 'confirmed';
            
            let leaveTime: Date | null = null;
            let isLate = false;
            let minutesUntilLeave = 0;

            if (schedule && reminder) {
              const scheduledTime = new Date(reminder.scheduled_at);
              leaveTime = addMinutes(scheduledTime, -schedule.buffer_minutes);
              isLate = isBefore(leaveTime, now) && !isConfirmed;
              minutesUntilLeave = Math.max(0, Math.round((leaveTime.getTime() - now.getTime()) / 60000));
            }

            return (
              <Card key={pickup.id} className={`border-2 ${
                isLate ? 'border-destructive bg-destructive/5' :
                isConfirmed ? 'border-green-500/50 bg-green-500/5' :
                'border-border'
              }`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full ${
                        pickup.name.toLowerCase().includes('gan') || pickup.name.includes('גן')
                          ? 'bg-pink-500/10 text-pink-500'
                          : 'bg-blue-500/10 text-blue-500'
                      }`}>
                        {pickup.name.toLowerCase().includes('gan') || pickup.name.includes('גן')
                          ? <Baby className="w-5 h-5" />
                          : <GraduationCap className="w-5 h-5" />
                        }
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">{pickup.name}</h4>
                        {schedule && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{schedule.time_of_day}</span>
                            {isLate && (
                              <Badge variant="destructive" className="text-xs">
                                <AlertCircle className="w-3 h-3 me-1" />
                                {t.late}
                              </Badge>
                            )}
                            {!isLate && !isConfirmed && minutesUntilLeave > 0 && (
                              <Badge variant="outline" className="text-xs">
                                {t.leaveIn} {minutesUntilLeave} {t.minutes}
                              </Badge>
                            )}
                          </div>
                        )}
                        {schedule && (
                          <div className="flex gap-1 mt-2">
                            {schedule.days_of_week.map(day => (
                              <Badge key={day} variant="secondary" className="text-xs">
                                {t.dayNames[day as keyof typeof t.dayNames]}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {reminder && !isConfirmed && (
                      <Button
                        size="sm"
                        onClick={() => handleOnMyWay(reminder.id)}
                        className="shrink-0"
                      >
                        <MapPin className="w-4 h-4 me-1" />
                        {t.onMyWay}
                      </Button>
                    )}
                    {isConfirmed && (
                      <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30">
                        <Check className="w-3 h-3 me-1" />
                        {t.onMyWay}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
