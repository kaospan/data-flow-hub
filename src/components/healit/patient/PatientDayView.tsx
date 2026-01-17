import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { useHealITData } from '@/hooks/useHealITData';
import { usePatientRoutines } from '@/hooks/usePatientRoutines';
import { PatientMedsPanel } from './PatientMedsPanel';
import { AddMedicationDialog } from './AddMedicationDialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Pill, 
  ListChecks, 
  Calendar,
  FileText,
  Camera,
  Upload,
  Sun,
  Moon,
  Activity,
  AlertCircle,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';

interface PatientDayViewProps {
  patientId?: string;
}

export function PatientDayView({ patientId: propPatientId }: PatientDayViewProps) {
  const { language } = useLanguage();
  const { organization, profile } = useAuth();
  const { patients, followups, slipCheck, isLoading: healITLoading } = useHealITData();
  
  // Try to find patient by email or use prop
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(propPatientId || null);
  
  // Find the current user's patient record
  useEffect(() => {
    if (!propPatientId && profile?.email && patients.length > 0) {
      const myPatient = patients.find(p => p.email === profile.email);
      if (myPatient) {
        setSelectedPatientId(myPatient.id);
      }
    }
  }, [propPatientId, profile?.email, patients]);

  const patientId = propPatientId || selectedPatientId;
  const { 
    reminders, 
    medications, 
    isLoading: routinesLoading,
    getNowNextToday 
  } = usePatientRoutines(patientId || undefined);

  const content = {
    he: {
      greeting: 'בוקר טוב',
      greetingEvening: 'ערב טוב',
      today: 'היום',
      dateFormat: 'EEEE, d בMMMM',
      tabs: {
        meds: 'תרופות',
        tasks: 'משימות',
        docs: 'מסמכים',
      },
      summary: {
        pending: 'ממתינים',
        completed: 'הושלמו',
        overdue: 'באיחור',
      },
      noPatient: 'לא נמצא פרופיל מטופל',
      createPatient: 'צור פרופיל מטופל',
      quickActions: {
        camera: 'צלם מסמך',
        upload: 'העלה קובץ',
      },
    },
    en: {
      greeting: 'Good morning',
      greetingEvening: 'Good evening',
      today: 'Today',
      dateFormat: 'EEEE, MMMM d',
      tabs: {
        meds: 'Meds',
        tasks: 'Tasks',
        docs: 'Documents',
      },
      summary: {
        pending: 'Pending',
        completed: 'Completed',
        overdue: 'Overdue',
      },
      noPatient: 'No patient profile found',
      createPatient: 'Create patient profile',
      quickActions: {
        camera: 'Scan Document',
        upload: 'Upload File',
      },
    },
  };

  const t = content[language];
  const locale = language === 'he' ? he : undefined;

  const now = new Date();
  const hour = now.getHours();
  const isEvening = hour >= 17;
  const greeting = isEvening ? t.greetingEvening : t.greeting;

  const { now: nowItems, next: nextItems, today: todayItems } = getNowNextToday();
  
  // Calculate summary stats
  const pendingCount = nowItems.length + nextItems.length + todayItems.length;
  const overdueCount = nowItems.filter(r => new Date(r.scheduled_at) < now).length;
  const completedToday = reminders.filter(r => r.status === 'confirmed').length;

  const isLoading = healITLoading || routinesLoading;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-6">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!patientId) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <Activity className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-foreground mb-2">{t.noPatient}</h2>
        <p className="text-muted-foreground mb-6">
          {profile?.email}
        </p>
        <Button>{t.createPatient}</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header with greeting */}
      <header className="space-y-1">
        <div className="flex items-center gap-2 text-muted-foreground">
          {isEvening ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          <span className="text-sm">{format(now, t.dateFormat, { locale })}</span>
        </div>
        <h1 className="text-3xl font-bold text-foreground">
          {greeting}, {profile?.name?.split(' ')[0] || profile?.email?.split('@')[0]}
        </h1>
      </header>

      {/* Quick summary cards */}
      <div className="grid grid-cols-3 gap-3">
        <Card className={`${overdueCount > 0 ? 'border-destructive bg-destructive/5' : ''}`}>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-1 text-2xl font-bold">
              {overdueCount > 0 && <AlertCircle className="w-5 h-5 text-destructive" />}
              <span className={overdueCount > 0 ? 'text-destructive' : 'text-foreground'}>
                {overdueCount}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">{t.summary.overdue}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-1 text-2xl font-bold text-foreground">
              <Clock className="w-5 h-5 text-primary" />
              {pendingCount}
            </div>
            <p className="text-xs text-muted-foreground">{t.summary.pending}</p>
          </CardContent>
        </Card>
        <Card className="border-green-500/20 bg-green-500/5">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-1 text-2xl font-bold text-green-600">
              <CheckCircle2 className="w-5 h-5" />
              {completedToday}
            </div>
            <p className="text-xs text-muted-foreground">{t.summary.completed}</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick actions */}
      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="flex-1">
          <Camera className="w-4 h-4 me-2" />
          {t.quickActions.camera}
        </Button>
        <Button variant="outline" size="sm" className="flex-1">
          <Upload className="w-4 h-4 me-2" />
          {t.quickActions.upload}
        </Button>
        <AddMedicationDialog patientId={patientId} />
      </div>

      {/* Main tabbed content */}
      <Tabs defaultValue="meds" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="meds" className="flex-1">
            <Pill className="w-4 h-4 me-2" />
            {t.tabs.meds}
            {pendingCount > 0 && (
              <Badge variant="secondary" className="ms-2">{pendingCount}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="tasks" className="flex-1">
            <ListChecks className="w-4 h-4 me-2" />
            {t.tabs.tasks}
            {(slipCheck?.open_count || 0) > 0 && (
              <Badge variant="secondary" className="ms-2">{slipCheck?.open_count}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="docs" className="flex-1">
            <FileText className="w-4 h-4 me-2" />
            {t.tabs.docs}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="meds" className="mt-4">
          <PatientMedsPanel patientId={patientId} />
        </TabsContent>

        <TabsContent value="tasks" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ListChecks className="w-5 h-5" />
                {t.tabs.tasks}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {followups.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  {language === 'he' ? 'אין משימות פתוחות' : 'No open tasks'}
                </p>
              ) : (
                <div className="space-y-3">
                  {followups.slice(0, 5).map(followup => (
                    <div 
                      key={followup.id}
                      className="flex items-center gap-3 p-3 rounded-lg border bg-card"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{followup.description}</p>
                        <p className="text-sm text-muted-foreground">
                          {followup.patients?.name}
                        </p>
                      </div>
                      <Badge variant={
                        followup.priority === 'high' ? 'destructive' : 
                        followup.priority === 'medium' ? 'default' : 'secondary'
                      }>
                        {followup.priority}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="docs" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                {t.tabs.docs}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {language === 'he' ? 'העלה מסמכים רפואיים, הפניות ותוצאות בדיקות' : 'Upload medical documents, referrals and test results'}
                </p>
                <div className="flex gap-2 justify-center mt-4">
                  <Button variant="outline">
                    <Camera className="w-4 h-4 me-2" />
                    {t.quickActions.camera}
                  </Button>
                  <Button variant="outline">
                    <Upload className="w-4 h-4 me-2" />
                    {t.quickActions.upload}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
