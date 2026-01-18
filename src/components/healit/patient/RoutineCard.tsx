import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { RoutineReminder, Routine } from '@/hooks/usePatientRoutines';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import {
  Pill,
  Car,
  Sparkles,
  UtensilsCrossed,
  Shirt,
  Shield,
  Clock,
  Check,
  AlarmClock,
  X,
  AlertCircle,
  RefreshCw,
  Info,
} from 'lucide-react';
import { format, formatDistanceToNow, isBefore } from 'date-fns';
import { he } from 'date-fns/locale';
import type { Json } from '@/integrations/supabase/types';

interface RoutineCardProps {
  reminder: RoutineReminder;
  isNow?: boolean;
  onRespond: (reminderId: string, type: 'taken' | 'snoozed' | 'skipped', options?: { skipReason?: string }) => Promise<void>;
}

export function RoutineCard({ reminder, isNow = false, onRespond }: RoutineCardProps) {
  const { language } = useLanguage();
  const [isResponding, setIsResponding] = useState(false);
  const [showSkipDialog, setShowSkipDialog] = useState(false);
  const [skipReason, setSkipReason] = useState('');
  const [showInstructions, setShowInstructions] = useState(false);

  const routine = reminder.routine as Routine | null;
  const scheduledAt = new Date(reminder.scheduled_at);
  const isOverdue = isBefore(scheduledAt, new Date());
  const locale = language === 'he' ? he : undefined;

  const content = {
    he: {
      taken: 'בוצע',
      snooze: 'דחה 10 דק\'',
      skip: 'דלג',
      overdue: 'באיחור',
      priority: { critical: 'חיוני', important: 'חשוב', flexible: 'גמיש' },
      skipReason: 'סיבה לדילוג',
      confirm: 'אישור',
      cancel: 'בטל',
      instructions: 'הוראות',
      noInstructions: 'אין הוראות מיוחדות',
      onTheWay: 'בדרך',
      escalation: 'רמת התראה',
    },
    en: {
      taken: 'Done',
      snooze: 'Snooze 10m',
      skip: 'Skip',
      overdue: 'Overdue',
      priority: { critical: 'Critical', important: 'Important', flexible: 'Flexible' },
      skipReason: 'Reason for skipping',
      confirm: 'Confirm',
      cancel: 'Cancel',
      instructions: 'Instructions',
      noInstructions: 'No special instructions',
      onTheWay: 'On my way',
      escalation: 'Alert level',
    },
  };

  const t = content[language];

  const getRoutineIcon = () => {
    const type = routine?.type;
    switch (type) {
      case 'medication': return <Pill className="w-5 h-5" />;
      case 'pickup': return <Car className="w-5 h-5" />;
      case 'hygiene': return <Sparkles className="w-5 h-5" />;
      case 'chore': 
        const name = routine?.name?.toLowerCase() || '';
        if (name.includes('laundry') || name.includes('כביסה')) return <Shirt className="w-5 h-5" />;
        return <UtensilsCrossed className="w-5 h-5" />;
      case 'gate': return <Shield className="w-5 h-5" />;
      default: return <Clock className="w-5 h-5" />;
    }
  };

  const getTypeColor = () => {
    const type = routine?.type;
    switch (type) {
      case 'medication': return 'bg-primary/10 text-primary';
      case 'pickup': return 'bg-amber-500/10 text-amber-500';
      case 'hygiene': return 'bg-cyan-500/10 text-cyan-500';
      case 'chore': return 'bg-purple-500/10 text-purple-500';
      case 'gate': return 'bg-green-500/10 text-green-500';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const handleAction = async (type: 'taken' | 'snoozed' | 'skipped') => {
    if (type === 'skipped' && routine?.type === 'medication') {
      setShowSkipDialog(true);
      return;
    }

    setIsResponding(true);
    try {
      await onRespond(reminder.id, type);
    } finally {
      setIsResponding(false);
    }
  };

  const handleSkipConfirm = async () => {
    setIsResponding(true);
    try {
      await onRespond(reminder.id, 'skipped', { skipReason });
      setShowSkipDialog(false);
      setSkipReason('');
    } finally {
      setIsResponding(false);
    }
  };

  // Get medication info safely
  const medicationInfo = routine?.medication_info as Record<string, unknown> | null;
  const dosage = medicationInfo?.dosage as string | undefined;
  const instructions = medicationInfo?.instructions as string | undefined;

  return (
    <>
      <Card className={`border-2 transition-all ${
        isNow 
          ? isOverdue 
            ? 'border-destructive bg-destructive/5 shadow-lg' 
            : 'border-primary bg-primary/5 shadow-lg'
          : 'border-border hover:border-primary/30'
      }`}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 flex-1">
              <div className={`p-2 rounded-full ${getTypeColor()}`}>
                {getRoutineIcon()}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-foreground truncate">
                  {routine?.name || 'Task'}
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
                  {reminder.escalation_level > 0 && (
                    <Badge variant="outline" className="text-xs">
                      {t.escalation}: {reminder.escalation_level}
                    </Badge>
                  )}
                </div>
                {dosage && (
                  <p className="text-sm text-muted-foreground mt-1">{dosage}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {instructions && (
                <Dialog open={showInstructions} onOpenChange={setShowInstructions}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="shrink-0">
                      <Info className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{t.instructions}</DialogTitle>
                    </DialogHeader>
                    <div className="bg-muted p-4 rounded-lg whitespace-pre-wrap">
                      {instructions}
                    </div>
                  </DialogContent>
                </Dialog>
              )}
              <Badge 
                variant={
                  routine?.priority === 'critical' ? 'destructive' : 
                  routine?.priority === 'important' ? 'default' : 'secondary'
                }
                className="shrink-0"
              >
                {t.priority[routine?.priority || 'flexible']}
              </Badge>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 mt-4">
            <Button
              size="sm"
              className="flex-1"
              onClick={() => handleAction('taken')}
              disabled={isResponding}
            >
              {isResponding ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Check className="w-4 h-4 me-1" />
                  {routine?.type === 'pickup' ? t.onTheWay : t.taken}
                </>
              )}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleAction('snoozed')}
              disabled={isResponding}
            >
              <AlarmClock className="w-4 h-4 me-1" />
              {t.snooze}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleAction('skipped')}
              disabled={isResponding}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Skip reason dialog for medications */}
      <Dialog open={showSkipDialog} onOpenChange={setShowSkipDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.skipReason}</DialogTitle>
          </DialogHeader>
          <Textarea
            value={skipReason}
            onChange={(e) => setSkipReason(e.target.value)}
            placeholder={language === 'he' ? 'למה דילגת על המנה?' : 'Why are you skipping this dose?'}
            rows={3}
          />
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setShowSkipDialog(false)}>
              {t.cancel}
            </Button>
            <Button onClick={handleSkipConfirm} disabled={!skipReason.trim()}>
              {t.confirm}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
