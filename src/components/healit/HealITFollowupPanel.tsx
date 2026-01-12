import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useHealITData, FollowupItem } from '@/hooks/useHealITData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  XCircle,
  Calendar,
  User,
  ChevronRight,
  RefreshCw,
  Filter
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, formatDistanceToNow, isPast } from 'date-fns';
import { he, enUS } from 'date-fns/locale';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface HealITFollowupPanelProps {
  onSelectFollowup?: (followup: FollowupItem) => void;
}

export function HealITFollowupPanel({ onSelectFollowup }: HealITFollowupPanelProps) {
  const { language } = useLanguage();
  const { followups, slipCheck, isLoading, error, refetch, updateFollowupStatus } = useHealITData();
  const [filter, setFilter] = useState<'all' | 'overdue' | 'today' | 'high'>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const dateLocale = language === 'he' ? he : enUS;

  const content = {
    he: {
      title: 'משימות מעקב',
      noItems: 'אין משימות פתוחות',
      overdue: 'באיחור',
      dueToday: 'להיום',
      upcoming: 'קרוב',
      markDone: 'סיים',
      markDismissed: 'בטל',
      refresh: 'רענן',
      filters: {
        all: 'הכל',
        overdue: 'באיחור',
        today: 'להיום',
        high: 'עדיפות גבוהה',
      },
      priority: {
        high: 'גבוה',
        medium: 'בינוני',
        low: 'נמוך',
      },
      category: {
        schedule_appointment: 'קביעת תור',
        review_result: 'סקירת תוצאות',
        repeat_test: 'בדיקה חוזרת',
        medication_check: 'בדיקת תרופות',
        admin_other: 'אחר',
      },
      summary: {
        open: 'פתוחות',
        overdue: 'באיחור',
        unassigned: 'לא מוקצות',
        highPriority: 'עדיפות גבוהה',
      },
    },
    en: {
      title: 'Follow-up Tasks',
      noItems: 'No open tasks',
      overdue: 'Overdue',
      dueToday: 'Due Today',
      upcoming: 'Upcoming',
      markDone: 'Done',
      markDismissed: 'Dismiss',
      refresh: 'Refresh',
      filters: {
        all: 'All',
        overdue: 'Overdue',
        today: 'Due Today',
        high: 'High Priority',
      },
      priority: {
        high: 'High',
        medium: 'Medium',
        low: 'Low',
      },
      category: {
        schedule_appointment: 'Schedule Appointment',
        review_result: 'Review Result',
        repeat_test: 'Repeat Test',
        medication_check: 'Medication Check',
        admin_other: 'Other',
      },
      summary: {
        open: 'Open',
        overdue: 'Overdue',
        unassigned: 'Unassigned',
        highPriority: 'High Priority',
      },
    },
  };

  const t = content[language];

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getStatusIcon = (item: FollowupItem) => {
    const dueDate = new Date(item.due_at);
    const isOverdue = isPast(dueDate);
    const isToday = format(dueDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

    if (isOverdue) return <AlertTriangle className="w-4 h-4 text-destructive" />;
    if (isToday) return <Clock className="w-4 h-4 text-amber-500" />;
    return <Calendar className="w-4 h-4 text-muted-foreground" />;
  };

  const filteredFollowups = followups.filter((item) => {
    const dueDate = new Date(item.due_at);
    const isOverdue = isPast(dueDate);
    const isToday = format(dueDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

    switch (filter) {
      case 'overdue':
        return isOverdue;
      case 'today':
        return isToday;
      case 'high':
        return item.priority === 'high';
      default:
        return true;
    }
  });

  const handleStatusChange = async (id: string, status: 'done' | 'dismissed') => {
    setUpdatingId(id);
    try {
      await updateFollowupStatus(id, status);
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  if (isLoading) {
    return (
      <Card className="h-[600px]">
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-[600px] flex flex-col border-teal-200/50 dark:border-teal-700/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{t.title}</CardTitle>
          <div className="flex items-center gap-2">
            <Select value={filter} onValueChange={(v: any) => setFilter(v)}>
              <SelectTrigger className="w-[140px] h-8">
                <Filter className="w-3 h-3 me-1" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t.filters.all}</SelectItem>
                <SelectItem value="overdue">{t.filters.overdue}</SelectItem>
                <SelectItem value="today">{t.filters.today}</SelectItem>
                <SelectItem value="high">{t.filters.high}</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="ghost" size="icon" onClick={refetch} className="h-8 w-8">
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Summary badges */}
        {slipCheck && (
          <div className="flex flex-wrap gap-2 mt-3">
            <Badge variant="outline" className="text-xs">
              {t.summary.open}: {slipCheck.open_count}
            </Badge>
            {slipCheck.overdue_count > 0 && (
              <Badge variant="destructive" className="text-xs">
                {t.summary.overdue}: {slipCheck.overdue_count}
              </Badge>
            )}
            {slipCheck.high_priority_overdue > 0 && (
              <Badge variant="destructive" className="text-xs animate-pulse">
                {t.summary.highPriority}: {slipCheck.high_priority_overdue}
              </Badge>
            )}
          </div>
        )}
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto space-y-3 pt-0">
        {filteredFollowups.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <CheckCircle className="w-12 h-12 mb-4 text-teal-500" />
            <p>{t.noItems}</p>
          </div>
        ) : (
          filteredFollowups.map((item) => {
            const patient = item.patients as any;
            const dueDate = new Date(item.due_at);
            const isOverdue = isPast(dueDate);

            return (
              <div
                key={item.id}
                className={cn(
                  'p-4 rounded-lg border transition-all hover:shadow-md cursor-pointer',
                  isOverdue 
                    ? 'border-destructive/50 bg-destructive/5' 
                    : 'border-border hover:border-teal-500/50'
                )}
                onClick={() => onSelectFollowup?.(item)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {getStatusIcon(item)}
                      <span className="font-medium text-sm truncate">
                        {item.description}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                      {patient && (
                        <>
                          <User className="w-3 h-3" />
                          <span>{patient.name}</span>
                          <span>•</span>
                        </>
                      )}
                      <span>
                        {formatDistanceToNow(dueDate, { addSuffix: true, locale: dateLocale })}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge variant={getPriorityBadgeVariant(item.priority)} className="text-xs">
                        {t.priority[item.priority as keyof typeof t.priority]}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {t.category[item.category as keyof typeof t.category] || item.category}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 text-xs text-teal-600 hover:text-teal-700 hover:bg-teal-50 dark:hover:bg-teal-950"
                      disabled={updatingId === item.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStatusChange(item.id, 'done');
                      }}
                    >
                      <CheckCircle className="w-3 h-3 me-1" />
                      {t.markDone}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 text-xs text-muted-foreground hover:text-foreground"
                      disabled={updatingId === item.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStatusChange(item.id, 'dismissed');
                      }}
                    >
                      <XCircle className="w-3 h-3 me-1" />
                      {t.markDismissed}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
