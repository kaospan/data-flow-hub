import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { HealITHeader } from '@/components/healit/HealITHeader';
import { HealITFooter } from '@/components/healit/HealITFooter';
import { HealITAssistant } from '@/components/healit/HealITAssistant';
import { PatientDayView } from '@/components/healit/patient/PatientDayView';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Activity, Stethoscope, User, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HealITApp() {
  const { language } = useLanguage();
  const { isAuthenticated, profile } = useAuth();
  const [viewMode, setViewMode] = useState<'patient' | 'clinical'>('patient');

  const content = {
    he: {
      patientView: 'תצוגת מטופל',
      clinicalView: 'תצוגה קלינית',
      loginRequired: 'נדרשת התחברות',
      loginMessage: 'התחבר כדי לגשת למערכת המעקב',
      login: 'התחבר',
    },
    en: {
      patientView: 'Patient View',
      clinicalView: 'Clinical View',
      loginRequired: 'Login Required',
      loginMessage: 'Sign in to access the tracking system',
      login: 'Sign In',
    },
  };

  const t = content[language];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <HealITHeader />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center px-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center mx-auto mb-6">
              <Activity className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2 text-foreground">{t.loginRequired}</h2>
            <p className="text-muted-foreground mb-6">{t.loginMessage}</p>
            <Link to="/login">
              <Button className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700">
                <LogIn className="w-4 h-4 me-2" />
                {t.login}
              </Button>
            </Link>
          </div>
        </div>
        <HealITFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <HealITHeader />
      
      <main className="container mx-auto px-4 py-4">
        {/* View mode toggle */}
        <div className="flex justify-center mb-4">
          <div className="inline-flex rounded-lg border bg-card p-1">
            <Button
              variant={viewMode === 'patient' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('patient')}
              className="gap-2"
            >
              <User className="w-4 h-4" />
              {t.patientView}
            </Button>
            <Button
              variant={viewMode === 'clinical' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('clinical')}
              className="gap-2"
            >
              <Stethoscope className="w-4 h-4" />
              {t.clinicalView}
            </Button>
          </div>
        </div>

        {/* Content based on view mode */}
        {viewMode === 'patient' ? (
          <PatientDayView />
        ) : (
          <HealITAssistant />
        )}
      </main>

      <HealITFooter />
    </div>
  );
}
