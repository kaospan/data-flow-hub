import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
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

const triggerTypes = [
  { id: 'upload', icon: Upload, labelHe: 'בהעלאה', labelEn: 'On Upload', color: 'text-success', bgColor: 'bg-success/10' },
  { id: 'update', icon: RefreshCw, labelHe: 'בעדכון', labelEn: 'On Update', color: 'text-info', bgColor: 'bg-info/10' },
  { id: 'schedule', icon: Clock, labelHe: 'מתוזמן', labelEn: 'Scheduled', color: 'text-warning', bgColor: 'bg-warning/10' },
];

const automations = [
  {
    id: 1,
    name: 'Daily Sales Export',
    nameHe: 'ייצוא מכירות יומי',
    trigger: 'schedule',
    source: 'sales_data.xlsx',
    action: 'Export to CSV',
    actionHe: 'ייצוא ל-CSV',
    active: true,
    runs: 234,
    lastRun: '5 דקות',
  },
  {
    id: 2,
    name: 'Invoice Processing',
    nameHe: 'עיבוד חשבוניות',
    trigger: 'upload',
    source: 'invoice_scan.pdf',
    action: 'Extract & Webhook',
    actionHe: 'חילוץ ו-Webhook',
    active: true,
    runs: 89,
    lastRun: '1 שעה',
  },
  {
    id: 3,
    name: 'Customer Sync',
    nameHe: 'סנכרון לקוחות',
    trigger: 'update',
    source: 'CRM API',
    action: 'Update Database',
    actionHe: 'עדכון מסד נתונים',
    active: false,
    runs: 567,
    lastRun: '2 ימים',
  },
  {
    id: 4,
    name: 'Weekly Report',
    nameHe: 'דוח שבועי',
    trigger: 'schedule',
    source: 'Multiple Sources',
    action: 'Generate Report',
    actionHe: 'הפקת דוח',
    active: true,
    runs: 45,
    lastRun: '3 ימים',
  },
];

const Automations = () => {
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [automationStates, setAutomationStates] = useState<Record<number, boolean>>(
    automations.reduce((acc, a) => ({ ...acc, [a.id]: a.active }), {})
  );

  const Arrow = language === 'he' ? ArrowLeft : ArrowRight;

  const getTriggerType = (typeId: string) => triggerTypes.find((t) => t.id === typeId);

  const toggleAutomation = (id: number) => {
    setAutomationStates((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredAutomations = automations.filter((automation) =>
    (language === 'he' ? automation.nameHe : automation.name)
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

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
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
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
            <div className="space-y-4 mt-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  {language === 'he' ? 'בחרו סוג טריגר' : 'Select Trigger Type'}
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {triggerTypes.map((type) => (
                    <button
                      key={type.id}
                      className="flex flex-col items-center gap-2 p-4 rounded-xl bg-secondary/50 border border-border hover:border-primary/50 transition-all"
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
                <Button variant="hero" onClick={() => setIsAddDialogOpen(false)}>
                  {t('common.next')}
                  <Arrow className="w-4 h-4 ms-2" />
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
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
          <Button variant="outline" size="sm" className="gap-2">
            <Play className="w-4 h-4" />
            {t('automations.active')} ({automations.filter((a) => automationStates[a.id]).length})
          </Button>
          <Button variant="ghost" size="sm" className="gap-2">
            <Pause className="w-4 h-4" />
            {t('automations.paused')} ({automations.filter((a) => !automationStates[a.id]).length})
          </Button>
        </div>
      </div>

      {/* Automations List */}
      <div className="space-y-4">
        {filteredAutomations.map((automation) => {
          const triggerInfo = getTriggerType(automation.trigger);
          const isActive = automationStates[automation.id];

          return (
            <div
              key={automation.id}
              className={`glass-card p-5 transition-all ${!isActive ? 'opacity-60' : ''}`}
            >
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                {/* Icon & Info */}
                <div className="flex items-center gap-4 flex-1">
                  <div className={`w-12 h-12 rounded-xl ${triggerInfo?.bgColor} flex items-center justify-center flex-shrink-0`}>
                    {triggerInfo && <triggerInfo.icon className={`w-6 h-6 ${triggerInfo.color}`} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">
                      {language === 'he' ? automation.nameHe : automation.name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1 flex-wrap">
                      <span>{automation.source}</span>
                      <Arrow className="w-3 h-3" />
                      <span>{language === 'he' ? automation.actionHe : automation.action}</span>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-6 text-sm">
                  <div className="text-center">
                    <p className="font-semibold">{automation.runs}</p>
                    <p className="text-muted-foreground">
                      {language === 'he' ? 'הרצות' : 'runs'}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold">
                      {language === 'he' ? `לפני ${automation.lastRun}` : `${automation.lastRun} ago`}
                    </p>
                    <p className="text-muted-foreground">
                      {language === 'he' ? 'הרצה אחרונה' : 'last run'}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                  <Switch
                    checked={isActive}
                    onCheckedChange={() => toggleAutomation(automation.id)}
                  />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Play className="w-4 h-4 me-2" />
                        {language === 'he' ? 'הרץ עכשיו' : 'Run Now'}
                      </DropdownMenuItem>
                      <DropdownMenuItem>{t('common.edit')}</DropdownMenuItem>
                      <DropdownMenuItem>{t('common.view')}</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">{t('common.delete')}</DropdownMenuItem>
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
          <Button variant="hero" onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="w-4 h-4 me-2" />
            {t('automations.new')}
          </Button>
        </div>
      )}
    </div>
  );
};

export default Automations;
