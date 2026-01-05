import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAutomations, Automation } from '@/hooks/useAutomations';
import { useSources } from '@/hooks/useSources';
import { usePermissions } from '@/hooks/usePermissions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatDistanceToNow } from 'date-fns';
import { he, enUS } from 'date-fns/locale';
import {
  Plus,
  Search,
  Zap,
  Upload,
  RefreshCw,
  Clock,
  MoreVertical,
  Play,
  Pause,
  ArrowRight,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  XCircle,
  Trash2,
  Edit,
  Eye,
  Bell,
  FileOutput,
  Wand2,
  Webhook,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { CanEdit } from '@/components/auth/RoleGuard';

const triggerTypes = [
  { id: 'new_data', icon: Upload, labelHe: 'נתונים חדשים', labelEn: 'New Data', color: 'text-success', bgColor: 'bg-success/10' },
  { id: 'schedule', icon: Clock, labelHe: 'מתוזמן', labelEn: 'Scheduled', color: 'text-warning', bgColor: 'bg-warning/10' },
  { id: 'manual', icon: Play, labelHe: 'ידני', labelEn: 'Manual', color: 'text-info', bgColor: 'bg-info/10' },
  { id: 'webhook', icon: Webhook, labelHe: 'Webhook', labelEn: 'Webhook', color: 'text-primary', bgColor: 'bg-primary/10' },
];

const actionTypes = [
  { id: 'notify', icon: Bell, labelHe: 'התראה', labelEn: 'Notify' },
  { id: 'export', icon: FileOutput, labelHe: 'ייצוא', labelEn: 'Export' },
  { id: 'transform', icon: Wand2, labelHe: 'טרנספורמציה', labelEn: 'Transform' },
  { id: 'api_call', icon: Webhook, labelHe: 'קריאת API', labelEn: 'API Call' },
];

const Automations = () => {
  const { t, language } = useLanguage();
  const { 
    automations, 
    runs, 
    isLoading, 
    createAutomation, 
    toggleAutomation, 
    runAutomation,
    deleteAutomation,
    getRunsForAutomation,
  } = useAutomations();
  const { sources } = useSources();
  const { canEdit } = usePermissions();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [runningAutomations, setRunningAutomations] = useState<Set<string>>(new Set());
  const [showOnlyActive, setShowOnlyActive] = useState(false);
  
  // New automation form state
  const [step, setStep] = useState(1);
  const [newAutomation, setNewAutomation] = useState({
    name: '',
    triggerType: '' as Automation['triggerType'] | '',
    actionType: '' as Automation['actionType'] | '',
    sourceId: '',
  });

  const Arrow = language === 'he' ? ArrowLeft : ArrowRight;

  const getTriggerType = (typeId: string) => triggerTypes.find((t) => t.id === typeId);
  const getActionType = (typeId: string) => actionTypes.find((a) => a.id === typeId);

  const formatTime = (dateString: string | null) => {
    if (!dateString) return language === 'he' ? 'מעולם לא רץ' : 'Never run';
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: language === 'he' ? he : enUS,
      });
    } catch {
      return '';
    }
  };

  const handleRunAutomation = async (automationId: string) => {
    setRunningAutomations(prev => new Set(prev).add(automationId));
    await runAutomation(automationId);
    setTimeout(() => {
      setRunningAutomations(prev => {
        const next = new Set(prev);
        next.delete(automationId);
        return next;
      });
    }, 3000);
  };

  const handleCreateAutomation = async () => {
    if (!newAutomation.name || !newAutomation.triggerType || !newAutomation.actionType) return;

    await createAutomation(
      newAutomation.name,
      newAutomation.triggerType as Automation['triggerType'],
      newAutomation.actionType as Automation['actionType'],
      newAutomation.sourceId || undefined
    );

    setIsAddDialogOpen(false);
    setStep(1);
    setNewAutomation({ name: '', triggerType: '', actionType: '', sourceId: '' });
  };

  const filteredAutomations = automations.filter((automation) => {
    const matchesSearch = automation.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesActive = showOnlyActive ? automation.isActive : true;
    return matchesSearch && matchesActive;
  });

  const activeCount = automations.filter(a => a.isActive).length;
  const pausedCount = automations.filter(a => !a.isActive).length;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="space-y-4">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">{t('automations.title')}</h1>
          <p className="text-muted-foreground mt-1">
            {language === 'he' ? 'הגדירו כללים והפעלות אוטומטיות' : 'Set up rules and automatic triggers'}
          </p>
        </div>
        <CanEdit resource="automations">
          <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
            setIsAddDialogOpen(open);
            if (!open) {
              setStep(1);
              setNewAutomation({ name: '', triggerType: '', actionType: '', sourceId: '' });
            }
          }}>
            <DialogTrigger asChild>
              <Button variant="hero">
                <Plus className="w-4 h-4 me-2" />
                {t('automations.new')}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>
                  {language === 'he' ? 'יצירת אוטומציה חדשה' : 'Create New Automation'}
                </DialogTitle>
              </DialogHeader>
              
              {step === 1 && (
                <div className="space-y-4 mt-4">
                  <div>
                    <Label className="mb-2 block">
                      {language === 'he' ? 'בחרו סוג טריגר' : 'Select Trigger Type'}
                    </Label>
                    <div className="grid grid-cols-2 gap-3">
                      {triggerTypes.map((type) => (
                        <button
                          key={type.id}
                          className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                            newAutomation.triggerType === type.id 
                              ? 'border-primary bg-primary/10' 
                              : 'border-border bg-secondary/50 hover:border-primary/50'
                          }`}
                          onClick={() => setNewAutomation(prev => ({ ...prev, triggerType: type.id as Automation['triggerType'] }))}
                        >
                          <div className={`w-10 h-10 rounded-lg ${type.bgColor} flex items-center justify-center`}>
                            <type.icon className={`w-5 h-5 ${type.color}`} />
                          </div>
                          <span className="text-sm font-medium">
                            {language === 'he' ? type.labelHe : type.labelEn}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button 
                      variant="hero" 
                      onClick={() => setStep(2)}
                      disabled={!newAutomation.triggerType}
                    >
                      {t('common.next')}
                      <Arrow className="w-4 h-4 ms-2" />
                    </Button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4 mt-4">
                  <div>
                    <Label className="mb-2 block">
                      {language === 'he' ? 'בחרו פעולה' : 'Select Action'}
                    </Label>
                    <div className="grid grid-cols-2 gap-3">
                      {actionTypes.map((type) => (
                        <button
                          key={type.id}
                          className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                            newAutomation.actionType === type.id 
                              ? 'border-primary bg-primary/10' 
                              : 'border-border bg-secondary/50 hover:border-primary/50'
                          }`}
                          onClick={() => setNewAutomation(prev => ({ ...prev, actionType: type.id as Automation['actionType'] }))}
                        >
                          <type.icon className="w-5 h-5" />
                          <span className="text-sm font-medium">
                            {language === 'he' ? type.labelHe : type.labelEn}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <Button variant="ghost" onClick={() => setStep(1)}>
                      {t('common.back')}
                    </Button>
                    <Button 
                      variant="hero" 
                      onClick={() => setStep(3)}
                      disabled={!newAutomation.actionType}
                    >
                      {t('common.next')}
                      <Arrow className="w-4 h-4 ms-2" />
                    </Button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4 mt-4">
                  <div>
                    <Label className="mb-2 block">
                      {language === 'he' ? 'שם האוטומציה' : 'Automation Name'}
                    </Label>
                    <Input
                      value={newAutomation.name}
                      onChange={(e) => setNewAutomation(prev => ({ ...prev, name: e.target.value }))}
                      placeholder={language === 'he' ? 'הזינו שם...' : 'Enter name...'}
                    />
                  </div>
                  {sources.length > 0 && (
                    <div>
                      <Label className="mb-2 block">
                        {language === 'he' ? 'מקור (אופציונלי)' : 'Source (optional)'}
                      </Label>
                      <Select
                        value={newAutomation.sourceId}
                        onValueChange={(value) => setNewAutomation(prev => ({ ...prev, sourceId: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={language === 'he' ? 'בחרו מקור...' : 'Select source...'} />
                        </SelectTrigger>
                        <SelectContent>
                          {sources.map((source) => (
                            <SelectItem key={source.id} value={source.id}>
                              {source.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <Button variant="ghost" onClick={() => setStep(2)}>
                      {t('common.back')}
                    </Button>
                    <Button 
                      variant="hero" 
                      onClick={handleCreateAutomation}
                      disabled={!newAutomation.name.trim()}
                    >
                      {t('common.save')}
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </CanEdit>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={language === 'he' ? 'חיפוש אוטומציות...' : 'Search automations...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="ps-10 bg-secondary/50"
          />
        </div>
        <div className="flex gap-2">
          <Button 
            variant={showOnlyActive ? 'default' : 'outline'} 
            size="sm" 
            className="gap-2"
            onClick={() => setShowOnlyActive(true)}
          >
            <Play className="w-4 h-4" />
            {t('automations.active')} ({activeCount})
          </Button>
          <Button 
            variant={!showOnlyActive ? 'default' : 'ghost'} 
            size="sm" 
            className="gap-2"
            onClick={() => setShowOnlyActive(false)}
          >
            <Pause className="w-4 h-4" />
            {language === 'he' ? 'הכל' : 'All'} ({automations.length})
          </Button>
        </div>
      </div>

      {/* Automations List */}
      <div className="space-y-4">
        {filteredAutomations.map((automation) => {
          const triggerInfo = getTriggerType(automation.triggerType);
          const actionInfo = getActionType(automation.actionType);
          const automationRuns = getRunsForAutomation(automation.id);
          const lastRun = automationRuns[0];
          const isRunning = runningAutomations.has(automation.id) || automationRuns.some(r => r.status === 'running');

          return (
            <div
              key={automation.id}
              className={`glass-card p-5 transition-all ${!automation.isActive ? 'opacity-60' : ''}`}
            >
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                {/* Icon & Info */}
                <div className="flex items-center gap-4 flex-1">
                  <div className={`w-12 h-12 rounded-xl ${triggerInfo?.bgColor} flex items-center justify-center flex-shrink-0`}>
                    {isRunning ? (
                      <Loader2 className={`w-6 h-6 ${triggerInfo?.color} animate-spin`} />
                    ) : (
                      triggerInfo && <triggerInfo.icon className={`w-6 h-6 ${triggerInfo?.color}`} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{automation.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1 flex-wrap">
                      <Badge variant="outline" className="text-xs">
                        {language === 'he' ? triggerInfo?.labelHe : triggerInfo?.labelEn}
                      </Badge>
                      <Arrow className="w-3 h-3" />
                      <Badge variant="outline" className="text-xs">
                        {language === 'he' ? actionInfo?.labelHe : actionInfo?.labelEn}
                      </Badge>
                      {automation.sourceName && (
                        <>
                          <span className="mx-1">•</span>
                          <span>{automation.sourceName}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-6 text-sm">
                  <div className="text-center">
                    <p className="font-semibold">{automationRuns.length}</p>
                    <p className="text-muted-foreground">
                      {language === 'he' ? 'הרצות' : 'runs'}
                    </p>
                  </div>
                  <div className="text-center min-w-[80px]">
                    <div className="flex items-center justify-center gap-1">
                      {lastRun?.status === 'completed' && <CheckCircle2 className="w-3 h-3 text-success" />}
                      {lastRun?.status === 'failed' && <XCircle className="w-3 h-3 text-destructive" />}
                      {lastRun?.status === 'running' && <Loader2 className="w-3 h-3 text-warning animate-spin" />}
                      <p className="font-semibold text-xs">
                        {formatTime(lastRun?.startedAt || null)}
                      </p>
                    </div>
                    <p className="text-muted-foreground">
                      {language === 'he' ? 'הרצה אחרונה' : 'last run'}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                  <CanEdit resource="automations">
                    <Switch
                      checked={automation.isActive}
                      onCheckedChange={(checked) => toggleAutomation(automation.id, checked)}
                    />
                  </CanEdit>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <CanEdit resource="automations">
                        <DropdownMenuItem 
                          onClick={() => handleRunAutomation(automation.id)}
                          disabled={isRunning}
                        >
                          {isRunning ? (
                            <Loader2 className="w-4 h-4 me-2 animate-spin" />
                          ) : (
                            <Play className="w-4 h-4 me-2" />
                          )}
                          {language === 'he' ? 'הרץ עכשיו' : 'Run Now'}
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 me-2" />
                          {t('common.edit')}
                        </DropdownMenuItem>
                      </CanEdit>
                      <DropdownMenuItem>
                        <Eye className="w-4 h-4 me-2" />
                        {t('common.view')}
                      </DropdownMenuItem>
                      <CanEdit resource="automations">
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => deleteAutomation(automation.id)}
                        >
                          <Trash2 className="w-4 h-4 me-2" />
                          {t('common.delete')}
                        </DropdownMenuItem>
                      </CanEdit>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty state */}
      {filteredAutomations.length === 0 && (
        <div className="glass-card p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-2">
            {language === 'he' ? 'לא נמצאו אוטומציות' : 'No automations found'}
          </h3>
          <p className="text-muted-foreground mb-6">
            {language === 'he'
              ? 'צרו אוטומציה חדשה כדי להתחיל'
              : 'Create a new automation to get started'}
          </p>
          <CanEdit resource="automations">
            <Button variant="hero" onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="w-4 h-4 me-2" />
              {t('automations.new')}
            </Button>
          </CanEdit>
        </div>
      )}

      {/* Recent Runs */}
      {runs.length > 0 && (
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold mb-4">
            {language === 'he' ? 'הרצות אחרונות' : 'Recent Runs'}
          </h2>
          <div className="space-y-2">
            {runs.slice(0, 10).map((run) => (
              <div
                key={run.id}
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/30"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    run.status === 'completed' ? 'bg-success' :
                    run.status === 'running' ? 'bg-warning animate-pulse' :
                    run.status === 'failed' ? 'bg-destructive' : 'bg-muted'
                  }`} />
                  <div>
                    <p className="text-sm font-medium">{run.automationName || 'Automation'}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatTime(run.startedAt)}
                      {run.rowsProcessed > 0 && ` • ${run.rowsProcessed} ${language === 'he' ? 'רשומות' : 'rows'}`}
                    </p>
                  </div>
                </div>
                <Badge variant={
                  run.status === 'completed' ? 'default' :
                  run.status === 'running' ? 'secondary' :
                  'destructive'
                }>
                  {run.status === 'completed' && (language === 'he' ? 'הושלם' : 'Completed')}
                  {run.status === 'running' && (language === 'he' ? 'רץ' : 'Running')}
                  {run.status === 'failed' && (language === 'he' ? 'נכשל' : 'Failed')}
                  {run.status === 'cancelled' && (language === 'he' ? 'בוטל' : 'Cancelled')}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Automations;
