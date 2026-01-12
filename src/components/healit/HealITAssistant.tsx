import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { HealITChatPanel } from './HealITChatPanel';
import { HealITFollowupPanel } from './HealITFollowupPanel';
import { HealITQuickActions } from './HealITQuickActions';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, ListChecks, Activity, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';

export function HealITAssistant() {
  const { language } = useLanguage();
  const { isAuthenticated, organization } = useAuth();
  const [activeTab, setActiveTab] = useState('chat');

  const content = {
    he: {
      title: 'עוזר מעקב רפואי',
      subtitle: 'עזרה במעקב אחר הפניות, בדיקות ומשימות',
      loginRequired: 'נדרשת התחברות',
      loginMessage: 'התחבר כדי להתחיל לעקוב אחר משימות רפואיות',
      login: 'התחבר',
      tabs: {
        chat: 'שיחה',
        tasks: 'משימות',
      },
    },
    en: {
      title: 'Medical Follow-up Assistant',
      subtitle: 'Help tracking referrals, tests, and tasks',
      loginRequired: 'Login Required',
      loginMessage: 'Sign in to start tracking medical follow-ups',
      login: 'Sign In',
      tabs: {
        chat: 'Chat',
        tasks: 'Tasks',
      },
    },
  };

  const t = content[language];

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto text-center py-12 px-4">
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
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2 text-foreground">{t.title}</h2>
        <p className="text-muted-foreground">{t.subtitle}</p>
      </div>

      {/* Mobile: Tabs layout */}
      <div className="lg:hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="chat" className="flex-1">
              <MessageSquare className="w-4 h-4 me-2" />
              {t.tabs.chat}
            </TabsTrigger>
            <TabsTrigger value="tasks" className="flex-1">
              <ListChecks className="w-4 h-4 me-2" />
              {t.tabs.tasks}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="chat">
            <HealITChatPanel 
              organizationId={organization?.id} 
            />
          </TabsContent>
          <TabsContent value="tasks">
            <div className="space-y-4">
              <HealITQuickActions />
              <HealITFollowupPanel />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Desktop: Side by side layout */}
      <div className="hidden lg:grid lg:grid-cols-2 gap-6">
        <div>
          <HealITChatPanel 
            organizationId={organization?.id}
          />
        </div>
        <div className="space-y-4">
          <HealITQuickActions />
          <HealITFollowupPanel />
        </div>
      </div>
    </div>
  );
}
