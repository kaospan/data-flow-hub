import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { usePermissions, getRoleLabel } from '@/hooks/usePermissions';
import { useDashboardData } from '@/hooks/useDashboardData';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { EditorOrAbove } from '@/components/auth/RoleGuard';
import { formatDistanceToNow } from 'date-fns';
import { he, enUS } from 'date-fns/locale';
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
  Users,
  AlertTriangle,
  Upload,
  Clock,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { t, language } = useLanguage();
  const { profile, isLoading: authLoading } = useAuth();
  const { canEdit } = usePermissions();
  const { stats, usage, teamMembers, recentActivity, isLoading } = useDashboardData();

  const activityLabels = {
    he: { upload: 'העלאה', automation: 'אוטומציה', source: 'מקור' },
    en: { upload: 'Upload', automation: 'Automation', source: 'Source' },
  };

  const statusLabels = {
    he: { success: 'הושלם', processing: 'בעיבוד', error: 'שגיאה' },
    en: { success: 'Complete', processing: 'Processing', error: 'Error' },
  };

  // Get user's display name
  const displayName = profile?.name 
    ? profile.name.split(' ')[0] 
    : profile?.email?.split('@')[0] 
    || (language === 'he' ? 'משתמש' : 'User');

  // Quick actions based on permissions
  const quickActions = [
    { 
      icon: FileSpreadsheet, 
      label: language === 'he' ? 'העלה קובץ' : 'Upload File', 
      path: '/dashboard/sources',
      show: true,
    },
    { 
      icon: Image, 
      label: language === 'he' ? 'סרוק תמונה' : 'Scan Image', 
      path: '/dashboard/sources',
      show: true,
    },
    { 
      icon: Zap, 
      label: language === 'he' ? 'אוטומציה חדשה' : 'New Automation', 
      path: '/dashboard/automations',
      show: canEdit('automations'),
    },
  ].filter(action => action.show);

  const getInitials = (email: string, name?: string | null) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return email.slice(0, 2).toUpperCase();
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin': return 'default';
      case 'editor': return 'secondary';
      default: return 'outline';
    }
  };

  const formatTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: language === 'he' ? he : enUS,
      });
    } catch {
      return '';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'upload': return Upload;
      case 'automation': return Zap;
      default: return Database;
    }
  };

  if (isLoading || authLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-12 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* View-only warning */}
      {usage?.isViewOnly && (
        <div className="glass-card p-4 border-warning bg-warning/10">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-warning" />
            <div className="flex-1">
              <p className="font-medium text-warning">
                {language === 'he' ? 'חשבון במצב צפייה בלבד' : 'Account in View-Only Mode'}
              </p>
              <p className="text-sm text-muted-foreground">
                {language === 'he' 
                  ? 'הגעתם לגבול השימוש. שדרגו כדי להמשיך.' 
                  : 'You have reached your usage limit. Upgrade to continue.'}
              </p>
            </div>
            <Button variant="hero" size="sm">
              {language === 'he' ? 'שדרג עכשיו' : 'Upgrade Now'}
            </Button>
          </div>
        </div>
      )}

      {/* Welcome */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">
            {t('dashboard.welcome')}, {displayName} 👋
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
          <EditorOrAbove>
            <Link to="/dashboard/automations">
              <Button variant="hero">
                <Zap className="w-4 h-4 me-2" />
                {t('dashboard.newAutomation')}
              </Button>
            </Link>
          </EditorOrAbove>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
              <Database className="w-6 h-6 text-success" />
            </div>
            {stats.sourcesCount > 0 && <TrendingUp className="w-5 h-5 text-success" />}
          </div>
          <p className="text-3xl font-bold">{stats.sourcesCount}</p>
          <p className="text-sm text-muted-foreground">{t('dashboard.sources')}</p>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-info/10 flex items-center justify-center">
              <Workflow className="w-6 h-6 text-info" />
            </div>
            {stats.automationsCount > 0 && <TrendingUp className="w-5 h-5 text-success" />}
          </div>
          <p className="text-3xl font-bold">{stats.automationsCount}</p>
          <p className="text-sm text-muted-foreground">{t('dashboard.automations')}</p>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
              <PlayCircle className="w-6 h-6 text-warning" />
            </div>
            {stats.totalRuns > 0 && <TrendingUp className="w-5 h-5 text-success" />}
          </div>
          <p className="text-3xl font-bold">{stats.totalRuns}</p>
          <p className="text-sm text-muted-foreground">{t('dashboard.runs')}</p>
        </div>
      </div>

      {/* Usage */}
      {usage && (
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">{t('dashboard.usage')}</h2>
            <Badge variant="outline" className="capitalize">
              {usage.planType}
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>{language === 'he' ? 'רשומות' : 'Records'}</span>
                <span>{usage.rowsProcessed.toLocaleString()} / {usage.maxRows.toLocaleString()}</span>
              </div>
              <Progress value={(usage.rowsProcessed / usage.maxRows) * 100} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>{language === 'he' ? 'הרצות אוטומציה' : 'Automation runs'}</span>
                <span>{usage.automationRuns} / {usage.maxAutomationRuns}</span>
              </div>
              <Progress value={(usage.automationRuns / usage.maxAutomationRuns) * 100} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>{language === 'he' ? 'קבצים' : 'Files'}</span>
                <span>{usage.filesUploaded} / {usage.maxFiles}</span>
              </div>
              <Progress value={(usage.filesUploaded / usage.maxFiles) * 100} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>{language === 'he' ? 'מקורות' : 'Sources'}</span>
                <span>{usage.sourcesCount} / {usage.maxSources}</span>
              </div>
              <Progress value={(usage.sourcesCount / usage.maxSources) * 100} className="h-2" />
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="glass-card p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">{t('dashboard.recentActivity')}</h2>
          {recentActivity.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>{language === 'he' ? 'אין פעילות אחרונה' : 'No recent activity'}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentActivity.map((activity) => {
                const Icon = getActivityIcon(activity.type);
                return (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.status === 'success' ? 'bg-success' :
                        activity.status === 'processing' ? 'bg-warning animate-pulse' : 'bg-destructive'
                      }`} />
                      <Icon className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{activity.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {activityLabels[language][activity.type as keyof typeof activityLabels.he]} • {formatTime(activity.createdAt)}
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
                );
              })}
            </div>
          )}
        </div>

        {/* Team Members */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Users className="w-5 h-5" />
              {language === 'he' ? 'צוות' : 'Team'}
            </h2>
            <Link to="/dashboard/team">
              <Button variant="ghost" size="sm">
                {language === 'he' ? 'צפה בכל' : 'View all'}
              </Button>
            </Link>
          </div>
          {teamMembers.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              <p>{language === 'he' ? 'אין חברי צוות' : 'No team members'}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {teamMembers.slice(0, 5).map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="text-xs">
                        {getInitials(member.email, member.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">
                        {member.name || member.email.split('@')[0]}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {member.email}
                      </p>
                    </div>
                  </div>
                  <Badge variant={getRoleBadgeVariant(member.role)} className="text-xs">
                    {getRoleLabel(member.role, language)}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold mb-4">{t('dashboard.quickActions')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
  );
};

export default Dashboard;
