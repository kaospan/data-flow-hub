import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Database,
  Workflow,
  PlayCircle,
  TrendingUp,
  Plus,
  ArrowUpRight,
  FileSpreadsheet,
  Image,
  Zap,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const stats = [
  { icon: Database, labelKey: 'dashboard.sources', value: 5, color: 'text-success', bgColor: 'bg-success/10' },
  { icon: Workflow, labelKey: 'dashboard.automations', value: 12, color: 'text-info', bgColor: 'bg-info/10' },
  { icon: PlayCircle, labelKey: 'dashboard.runs', value: 847, color: 'text-warning', bgColor: 'bg-warning/10' },
];

const recentActivity = [
  { type: 'upload', name: 'sales_report.xlsx', time: '5 דקות', status: 'success' },
  { type: 'automation', name: 'Daily Export', time: '1 שעה', status: 'success' },
  { type: 'ocr', name: 'invoice_scan.pdf', time: '2 שעות', status: 'processing' },
  { type: 'upload', name: 'customer_list.csv', time: '3 שעות', status: 'success' },
];

const quickActions = [
  { icon: FileSpreadsheet, label: 'העלה קובץ', path: '/dashboard/sources' },
  { icon: Image, label: 'סרוק תמונה', path: '/dashboard/sources' },
  { icon: Zap, label: 'אוטומציה חדשה', path: '/dashboard/automations' },
];

const Dashboard = () => {
  const { t, language } = useLanguage();

  const activityLabels = {
    he: { upload: 'העלאה', automation: 'אוטומציה', ocr: 'סריקה' },
    en: { upload: 'Upload', automation: 'Automation', ocr: 'Scan' },
  };

  const statusLabels = {
    he: { success: 'הושלם', processing: 'בעיבוד', error: 'שגיאה' },
    en: { success: 'Complete', processing: 'Processing', error: 'Error' },
  };

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">
            {t('dashboard.welcome')}, {language === 'he' ? 'ישראל' : 'Israel'} 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            {language === 'he' ? 'הנה סיכום הפעילות שלך' : "Here's your activity summary"}
          </p>
        </div>
        <div className="flex gap-3">
          <Link to="/dashboard/sources">
            <Button variant="outline">
              <Plus className="w-4 h-4 me-2" />
              {t('dashboard.addSource')}
            </Button>
          </Link>
          <Link to="/dashboard/automations">
            <Button variant="hero">
              <Zap className="w-4 h-4 me-2" />
              {t('dashboard.newAutomation')}
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.labelKey} className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <TrendingUp className="w-5 h-5 text-success" />
            </div>
            <p className="text-3xl font-bold">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{t(stat.labelKey)}</p>
          </div>
        ))}
      </div>

      {/* Usage */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">{t('dashboard.usage')}</h2>
          <span className="text-sm text-muted-foreground">
            {language === 'he' ? 'החודש' : 'This month'}
          </span>
        </div>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>{language === 'he' ? 'רשומות' : 'Records'}</span>
              <span>4,521 / 10,000</span>
            </div>
            <Progress value={45} className="h-2" />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>{language === 'he' ? 'הרצות אוטומציה' : 'Automation runs'}</span>
              <span>67 / 100</span>
            </div>
            <Progress value={67} className="h-2" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold mb-4">{t('dashboard.recentActivity')}</h2>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.status === 'success' ? 'bg-success' :
                    activity.status === 'processing' ? 'bg-warning animate-pulse' : 'bg-destructive'
                  }`} />
                  <div>
                    <p className="text-sm font-medium">{activity.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {activityLabels[language][activity.type as keyof typeof activityLabels.he]} • {language === 'he' ? `לפני ${activity.time}` : `${activity.time} ago`}
                    </p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  activity.status === 'success' ? 'bg-success/20 text-success' :
                  activity.status === 'processing' ? 'bg-warning/20 text-warning' : 'bg-destructive/20 text-destructive'
                }`}>
                  {statusLabels[language][activity.status as keyof typeof statusLabels.he]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold mb-4">{t('dashboard.quickActions')}</h2>
          <div className="space-y-3">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                to={action.path}
                className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <action.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="font-medium">{action.label}</span>
                </div>
                <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
