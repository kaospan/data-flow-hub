import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import {
  User,
  Building2,
  CreditCard,
  Users,
  Bell,
  Globe,
  Check,
} from 'lucide-react';

const Settings = () => {
  const { t, language, setLanguage } = useLanguage();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: language === 'he' ? 'ההגדרות נשמרו' : 'Settings saved',
        description: language === 'he' ? 'השינויים עודכנו בהצלחה' : 'Your changes have been saved',
      });
    }, 500);
  };

  const tabs = [
    { id: 'profile', icon: User, labelKey: 'settings.profile' },
    { id: 'workspace', icon: Building2, labelKey: 'settings.workspace' },
    { id: 'billing', icon: CreditCard, labelKey: 'settings.billing' },
    { id: 'team', icon: Users, labelKey: 'settings.team' },
    { id: 'notifications', icon: Bell, labelKey: 'settings.notifications' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">{t('settings.title')}</h1>
        <p className="text-muted-foreground mt-1">
          {language === 'he' ? 'נהלו את הגדרות החשבון והעדפות' : 'Manage your account settings and preferences'}
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-secondary/50 p-1 flex-wrap h-auto gap-1">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{t(tab.labelKey)}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold mb-6">
              {language === 'he' ? 'פרטים אישיים' : 'Personal Information'}
            </h2>

            <div className="flex items-center gap-6 mb-8">
              <Avatar className="w-20 h-20">
                <AvatarFallback className="bg-primary/20 text-primary text-2xl">
                  IY
                </AvatarFallback>
              </Avatar>
              <div>
                <Button variant="outline" size="sm">
                  {language === 'he' ? 'שנה תמונה' : 'Change photo'}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>{t('auth.fullName')}</Label>
                <Input
                  defaultValue={language === 'he' ? 'ישראל ישראלי' : 'Israel Israeli'}
                  className="bg-secondary/50"
                />
              </div>
              <div className="space-y-2">
                <Label>{t('auth.email')}</Label>
                <Input defaultValue="israel@company.co.il" className="bg-secondary/50" />
              </div>
              <div className="space-y-2">
                <Label>{language === 'he' ? 'טלפון' : 'Phone'}</Label>
                <Input defaultValue="+972-50-1234567" className="bg-secondary/50" />
              </div>
              <div className="space-y-2">
                <Label>{language === 'he' ? 'תפקיד' : 'Role'}</Label>
                <Input
                  defaultValue={language === 'he' ? 'מנהל' : 'Admin'}
                  className="bg-secondary/50"
                  disabled
                />
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <Button variant="hero" onClick={handleSave} disabled={isLoading}>
                {isLoading ? t('common.loading') : t('common.save')}
              </Button>
            </div>
          </div>

          {/* Language Settings */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5" />
              {t('settings.language')}
            </h2>

            <div className="flex gap-4">
              <button
                onClick={() => setLanguage('he')}
                className={`flex items-center gap-3 px-6 py-4 rounded-xl border transition-all ${
                  language === 'he'
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-secondary/50 hover:border-primary/50'
                }`}
              >
                <span className="text-2xl">🇮🇱</span>
                <div className="text-start">
                  <p className="font-medium">עברית</p>
                  <p className="text-sm text-muted-foreground">Hebrew</p>
                </div>
                {language === 'he' && <Check className="w-5 h-5 text-primary ms-auto" />}
              </button>

              <button
                onClick={() => setLanguage('en')}
                className={`flex items-center gap-3 px-6 py-4 rounded-xl border transition-all ${
                  language === 'en'
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-secondary/50 hover:border-primary/50'
                }`}
              >
                <span className="text-2xl">🇺🇸</span>
                <div className="text-start">
                  <p className="font-medium">English</p>
                  <p className="text-sm text-muted-foreground">אנגלית</p>
                </div>
                {language === 'en' && <Check className="w-5 h-5 text-primary ms-auto" />}
              </button>
            </div>
          </div>
        </TabsContent>

        {/* Workspace Tab */}
        <TabsContent value="workspace" className="space-y-6">
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold mb-6">
              {language === 'he' ? 'פרטי סביבת העבודה' : 'Workspace Details'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>{t('auth.companyName')}</Label>
                <Input
                  defaultValue={language === 'he' ? 'חברה לדוגמה בע"מ' : 'Example Company Ltd.'}
                  className="bg-secondary/50"
                />
              </div>
              <div className="space-y-2">
                <Label>{language === 'he' ? 'תעשייה' : 'Industry'}</Label>
                <Input
                  defaultValue={language === 'he' ? 'טכנולוגיה' : 'Technology'}
                  className="bg-secondary/50"
                />
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <Button variant="hero" onClick={handleSave} disabled={isLoading}>
                {isLoading ? t('common.loading') : t('common.save')}
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Billing Tab */}
        <TabsContent value="billing" className="space-y-6">
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">
                {language === 'he' ? 'תוכנית נוכחית' : 'Current Plan'}
              </h2>
              <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium">
                {t('plans.pro')}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 rounded-lg bg-secondary/50">
                <p className="text-sm text-muted-foreground">
                  {language === 'he' ? 'רשומות נותרות' : 'Records remaining'}
                </p>
                <p className="text-2xl font-bold">5,479</p>
              </div>
              <div className="p-4 rounded-lg bg-secondary/50">
                <p className="text-sm text-muted-foreground">
                  {language === 'he' ? 'הרצות נותרות' : 'Runs remaining'}
                </p>
                <p className="text-2xl font-bold">33</p>
              </div>
              <div className="p-4 rounded-lg bg-secondary/50">
                <p className="text-sm text-muted-foreground">
                  {language === 'he' ? 'חידוש הבא' : 'Next renewal'}
                </p>
                <p className="text-2xl font-bold">15/02</p>
              </div>
            </div>

            <Button variant="outline">
              {language === 'he' ? 'שדרג תוכנית' : 'Upgrade Plan'}
            </Button>
          </div>
        </TabsContent>

        {/* Team Tab */}
        <TabsContent value="team" className="space-y-6">
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">
                {language === 'he' ? 'חברי צוות' : 'Team Members'}
              </h2>
              <Button variant="outline" size="sm">
                {language === 'he' ? 'הזמן משתמש' : 'Invite User'}
              </Button>
            </div>

            <div className="space-y-3">
              {[
                { name: language === 'he' ? 'ישראל ישראלי' : 'Israel Israeli', email: 'israel@company.co.il', role: 'Admin' },
                { name: language === 'he' ? 'שרה כהן' : 'Sara Cohen', email: 'sara@company.co.il', role: 'Editor' },
                { name: language === 'he' ? 'דוד לוי' : 'David Levi', email: 'david@company.co.il', role: 'Viewer' },
              ].map((member) => (
                <div
                  key={member.email}
                  className="flex items-center justify-between p-4 rounded-lg bg-secondary/30"
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-primary/20 text-primary">
                        {member.name.split(' ').map((n) => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-muted-foreground">{member.email}</p>
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground">{member.role}</span>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold mb-6">
              {language === 'he' ? 'העדפות התראות' : 'Notification Preferences'}
            </h2>

            <div className="space-y-4">
              {[
                { label: language === 'he' ? 'התראות אימייל' : 'Email notifications', enabled: true },
                { label: language === 'he' ? 'שגיאות אוטומציה' : 'Automation errors', enabled: true },
                { label: language === 'he' ? 'סיכום שבועי' : 'Weekly summary', enabled: false },
                { label: language === 'he' ? 'עדכוני מוצר' : 'Product updates', enabled: true },
              ].map((notification) => (
                <div
                  key={notification.label}
                  className="flex items-center justify-between p-4 rounded-lg bg-secondary/30"
                >
                  <span className="font-medium">{notification.label}</span>
                  <Switch defaultChecked={notification.enabled} />
                </div>
              ))}
            </div>

            <div className="flex justify-end mt-6">
              <Button variant="hero" onClick={handleSave} disabled={isLoading}>
                {isLoading ? t('common.loading') : t('common.save')}
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
