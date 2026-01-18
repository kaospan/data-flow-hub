import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePatientRoutines } from '@/hooks/usePatientRoutines';
import { RoutineCard } from './RoutineCard';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  Pill,
  Clock,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  CheckCircle2,
} from 'lucide-react';

interface RoutinesPanelProps {
  patientId: string;
}

export function RoutinesPanel({ patientId }: RoutinesPanelProps) {
  const { language } = useLanguage();
  const {
    reminders,
    isLoading,
    respondToReminder,
    generateTodayReminders,
    getNowNextToday,
  } = usePatientRoutines(patientId);

  const [showToday, setShowToday] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const content = {
    he: {
      now: 'עכשיו',
      next: 'הבא',
      today: 'היום',
      noReminders: 'אין משימות להיום',
      allDone: 'הכל הושלם!',
      generateReminders: 'עדכן תזכורות',
      showMore: 'הצג עוד',
      showLess: 'הסתר',
    },
    en: {
      now: 'NOW',
      next: 'NEXT',
      today: 'TODAY',
      noReminders: 'No tasks for today',
      allDone: 'All done!',
      generateReminders: 'Refresh reminders',
      showMore: 'Show more',
      showLess: 'Show less',
    },
  };

  const t = content[language];

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      await generateTodayReminders();
    } finally {
      setIsGenerating(false);
    }
  };

  const { now: nowItems, next: nextItems, today: todayItems } = getNowNextToday();
  const hasReminders = nowItems.length > 0 || nextItems.length > 0 || todayItems.length > 0;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          {language === 'he' ? 'משימות היום' : 'Today\'s Tasks'}
        </h2>
        <Button
          variant="outline"
          size="sm"
          onClick={handleGenerate}
          disabled={isGenerating}
        >
          <RefreshCw className={`w-4 h-4 me-1 ${isGenerating ? 'animate-spin' : ''}`} />
          {t.generateReminders}
        </Button>
      </div>

      {!hasReminders ? (
        <Card className="p-8 text-center">
          <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <p className="text-lg font-medium text-foreground">{t.allDone}</p>
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
                  <RoutineCard
                    key={reminder.id}
                    reminder={reminder}
                    isNow
                    onRespond={respondToReminder}
                  />
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
                  <RoutineCard
                    key={reminder.id}
                    reminder={reminder}
                    onRespond={respondToReminder}
                  />
                ))}
              </div>
            </section>
          )}

          {/* TODAY Section (collapsible) */}
          {todayItems.length > 0 && (
            <Collapsible open={showToday} onOpenChange={setShowToday}>
              <CollapsibleTrigger asChild>
                <button className="w-full flex items-center justify-between text-lg font-semibold text-muted-foreground mb-3 hover:text-foreground transition-colors">
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
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="space-y-3">
                  {todayItems.map(reminder => (
                    <RoutineCard
                      key={reminder.id}
                      reminder={reminder}
                      onRespond={respondToReminder}
                    />
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}
        </>
      )}
    </div>
  );
}
