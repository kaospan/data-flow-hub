import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePatientRoutines, RoutineReminder } from '@/hooks/usePatientRoutines';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Pill, 
  Clock, 
  Check, 
  AlarmClock, 
  X, 
  AlertCircle,
  RefreshCw,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { formatDistanceToNow, format, isAfter, isBefore, addMinutes } from 'date-fns';
import { he } from 'date-fns/locale';

interface PatientMedsPanelProps {
  patientId: string;
}

export function PatientMedsPanel({ patientId }: PatientMedsPanelProps) {
  const { language } = useLanguage();
  const { 
    reminders, 
    isLoading, 
    respondToReminder, 
    generateTodayReminders,
    getNowNextToday 
  } = usePatientRoutines(patientId);
  
  const [respondingId, setRespondingId] = useState<string | null>(null);
  const [showToday, setShowToday] = useState(false);

  const content = {
    he: {
      title: 'תרופות היום',
      now: 'עכשיו',
      next: 'הבא',
      today: 'היום',
      noReminders: 'אין תזכורות להיום',
      taken: 'לקחתי',
      snooze: 'דחה 10 דק\'',
      skip: 'דלג',
      overdue: 'באיחור',
      upcoming: 'בקרוב',
      generateReminders: 'צור תזכורות להיום',
      showMore: 'הצג עוד',
      showLess: 'הצג פחות',
      priority: {
        critical: 'חיוני',
        important: 'חשוב',
        flexible: 'גמיש',
      },
    },
    en: {
      title: 'Today\'s Medications',
      now: 'NOW',
      next: 'NEXT',
      today: 'TODAY',
      noReminders: 'No reminders for today',
      taken: 'Taken',
      snooze: 'Snooze 10m',
      skip: 'Skip',
      overdue: 'Overdue',
      upcoming: 'Upcoming',
      generateReminders: 'Generate today\'s reminders',
      showMore: 'Show more',
      showLess: 'Show less',
      priority: {
        critical: 'Critical',
        important: 'Important',
        flexible: 'Flexible',
      },
    },
  };

  const t = content[language];
  const locale = language === 'he' ? he : undefined;

  const handleResponse = async (
    reminderId: string, 
    type: 'taken' | 'snoozed' | 'skipped'
  ) => {
    setRespondingId(reminderId);
    try {
      await respondToReminder(reminderId, type, { snoozeMinutes: 10 });
    } catch (err) {
      console.error('Error responding to reminder:', err);
    } finally {
      setRespondingId(null);
    }
  };

  const { now: nowItems, next: nextItems, today: todayItems } = getNowNextToday();

  const ReminderCard = ({ 
    reminder, 
    isNow = false 
  }: { 
    reminder: RoutineReminder; 
    isNow?: boolean;
  }) => {
    const scheduledAt = new Date(reminder.scheduled_at);
    const isOverdue = isBefore(scheduledAt, new Date());
    const isResponding = respondingId === reminder.id;

    return (
      <Card className={`border-2 transition-all ${
        isNow 
          ? isOverdue 
            ? 'border-destructive bg-destructive/5 shadow-lg' 
            : 'border-primary bg-primary/5 shadow-lg'
          : 'border-border'
      }`}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 flex-1">
              <div className={`p-2 rounded-full ${
                reminder.routine?.type === 'medication' 
                  ? 'bg-primary/10 text-primary' 
                  : 'bg-muted text-muted-foreground'
              }`}>
                <Pill className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-foreground truncate">
                  {reminder.routine?.name || 'Medication'}
                </h4>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{format(scheduledAt, 'HH:mm', { locale })}</span>
                  {isOverdue && (
                    <Badge variant="destructive" className="text-xs">
                      <AlertCircle className="w-3 h-3 me-1" />
                      {t.overdue}
                    </Badge>
                  )}
                </div>
                {reminder.routine?.medication_info && 
                  typeof reminder.routine.medication_info === 'object' && 
                  (reminder.routine.medication_info as Record<string, unknown>).dosage && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {String((reminder.routine.medication_info as Record<string, unknown>).dosage)}
                  </p>
                )}
              </div>
            </div>
            
            <Badge 
              variant={
                reminder.routine?.priority === 'critical' 
                  ? 'destructive' 
                  : reminder.routine?.priority === 'important' 
                    ? 'default' 
                    : 'secondary'
              }
              className="shrink-0"
            >
              {t.priority[reminder.routine?.priority || 'flexible']}
            </Badge>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 mt-4">
            <Button
              size="sm"
              className="flex-1"
              onClick={() => handleResponse(reminder.id, 'taken')}
              disabled={isResponding}
            >
              {isResponding ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Check className="w-4 h-4 me-1" />
                  {t.taken}
                </>
              )}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleResponse(reminder.id, 'snoozed')}
              disabled={isResponding}
            >
              <AlarmClock className="w-4 h-4 me-1" />
              {t.snooze}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleResponse(reminder.id, 'skipped')}
              disabled={isResponding}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  const hasReminders = nowItems.length > 0 || nextItems.length > 0 || todayItems.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Pill className="w-6 h-6 text-primary" />
          {t.title}
        </h2>
        <Button 
          variant="outline" 
          size="sm"
          onClick={generateTodayReminders}
        >
          <RefreshCw className="w-4 h-4 me-1" />
          {t.generateReminders}
        </Button>
      </div>

      {!hasReminders ? (
        <Card className="p-8 text-center">
          <Pill className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">{t.noReminders}</p>
        </Card>
      ) : (
        <>
          {/* NOW Section */}
          {nowItems.length > 0 && (
            <section>
              <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
                {t.now}
              </h3>
              <div className="space-y-3">
                {nowItems.map(reminder => (
                  <ReminderCard key={reminder.id} reminder={reminder} isNow />
                ))}
              </div>
            </section>
          )}

          {/* NEXT Section */}
          {nextItems.length > 0 && (
            <section>
              <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                {t.next}
              </h3>
              <div className="space-y-3">
                {nextItems.map(reminder => (
                  <ReminderCard key={reminder.id} reminder={reminder} />
                ))}
              </div>
            </section>
          )}

          {/* TODAY Section (collapsible) */}
          {todayItems.length > 0 && (
            <section>
              <button
                onClick={() => setShowToday(!showToday)}
                className="w-full flex items-center justify-between text-lg font-semibold text-muted-foreground mb-3 hover:text-foreground transition-colors"
              >
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-muted" />
                  {t.today} ({todayItems.length})
                </span>
                {showToday ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
              {showToday && (
                <div className="space-y-3">
                  {todayItems.map(reminder => (
                    <ReminderCard key={reminder.id} reminder={reminder} />
                  ))}
                </div>
              )}
            </section>
          )}
        </>
      )}
    </div>
  );
}
