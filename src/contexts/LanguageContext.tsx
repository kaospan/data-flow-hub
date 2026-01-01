import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'he' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dir: 'rtl' | 'ltr';
}

const translations: Record<Language, Record<string, string>> = {
  he: {
    // Navigation
    'nav.home': 'בית',
    'nav.features': 'תכונות',
    'nav.pricing': 'תמחור',
    'nav.dashboard': 'לוח בקרה',
    'nav.login': 'התחברות',
    'nav.signup': 'הרשמה',
    'nav.logout': 'התנתקות',
    
    // Hero
    'hero.title': 'אוטומציה חכמה לעסקים',
    'hero.subtitle': 'הפכו נתונים לא מובנים לתובנות עסקיות בלחיצת כפתור',
    'hero.cta': 'התחילו בחינם',
    'hero.secondary': 'צפו בהדגמה',
    
    // Features
    'features.title': 'הכל במקום אחד',
    'features.subtitle': 'פלטפורמה מלאה לניהול וניתוח נתונים',
    'features.ingestion.title': 'קליטת נתונים',
    'features.ingestion.desc': 'ייבוא מקבצי Excel, CSV, תמונות, PDF ועוד',
    'features.processing.title': 'עיבוד חכם',
    'features.processing.desc': 'זיהוי אוטומטי של מבנה וחילוץ מידע ב-AI',
    'features.automation.title': 'אוטומציה',
    'features.automation.desc': 'הגדירו כללים והפעלות אוטומטיות',
    'features.export.title': 'ייצוא וחיבורים',
    'features.export.desc': 'ייצוא לקבצים, Webhooks ו-API',
    
    // Dashboard
    'dashboard.title': 'לוח בקרה',
    'dashboard.welcome': 'שלום',
    'dashboard.sources': 'מקורות נתונים',
    'dashboard.automations': 'אוטומציות',
    'dashboard.runs': 'הרצות',
    'dashboard.usage': 'שימוש',
    'dashboard.addSource': 'הוסף מקור נתונים',
    'dashboard.newAutomation': 'אוטומציה חדשה',
    'dashboard.recentActivity': 'פעילות אחרונה',
    'dashboard.quickActions': 'פעולות מהירות',
    
    // Sources
    'sources.title': 'מקורות נתונים',
    'sources.add': 'הוסף מקור',
    'sources.upload': 'העלאת קובץ',
    'sources.api': 'חיבור API',
    'sources.manual': 'הזנה ידנית',
    'sources.spreadsheet': 'גיליון אלקטרוני',
    'sources.image': 'תמונה / OCR',
    'sources.video': 'וידאו / תמלול',
    
    // Automations
    'automations.title': 'אוטומציות',
    'automations.new': 'אוטומציה חדשה',
    'automations.active': 'פעילות',
    'automations.paused': 'מושהות',
    'automations.trigger.upload': 'בהעלאה',
    'automations.trigger.update': 'בעדכון',
    'automations.trigger.schedule': 'מתוזמן',
    
    // Settings
    'settings.title': 'הגדרות',
    'settings.profile': 'פרופיל',
    'settings.workspace': 'סביבת עבודה',
    'settings.billing': 'חיוב ותשלום',
    'settings.team': 'ניהול צוות',
    'settings.language': 'שפה',
    'settings.notifications': 'התראות',
    
    // Access
    'access.denied': 'אין הרשאה',
    'access.deniedMessage': 'אין לך הרשאה לצפייה בדף זה',
    
    // Plans
    'plans.starter': 'התחלתי',
    'plans.pro': 'מקצועי',
    'plans.enterprise': 'ארגוני',
    'plans.monthly': 'חודשי',
    'plans.yearly': 'שנתי',
    'plans.perMonth': 'לחודש',
    
    // Auth
    'auth.email': 'אימייל',
    'auth.password': 'סיסמה',
    'auth.confirmPassword': 'אימות סיסמה',
    'auth.forgotPassword': 'שכחתם סיסמה?',
    'auth.noAccount': 'אין לכם חשבון?',
    'auth.hasAccount': 'יש לכם חשבון?',
    'auth.loginTitle': 'התחברות לחשבון',
    'auth.signupTitle': 'יצירת חשבון חדש',
    'auth.companyName': 'שם החברה',
    'auth.fullName': 'שם מלא',
    
    // Common
    'common.save': 'שמירה',
    'common.cancel': 'ביטול',
    'common.delete': 'מחיקה',
    'common.edit': 'עריכה',
    'common.view': 'צפייה',
    'common.loading': 'טוען...',
    'common.success': 'הצלחה',
    'common.error': 'שגיאה',
    'common.close': 'סגירה',
    'common.next': 'הבא',
    'common.back': 'חזרה',
    'common.submit': 'שליחה',
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.features': 'Features',
    'nav.pricing': 'Pricing',
    'nav.dashboard': 'Dashboard',
    'nav.login': 'Login',
    'nav.signup': 'Sign Up',
    'nav.logout': 'Logout',
    
    // Hero
    'hero.title': 'Smart Business Automation',
    'hero.subtitle': 'Transform unstructured data into business insights with one click',
    'hero.cta': 'Start Free',
    'hero.secondary': 'Watch Demo',
    
    // Features
    'features.title': 'All in One Place',
    'features.subtitle': 'Complete platform for data management and analysis',
    'features.ingestion.title': 'Data Ingestion',
    'features.ingestion.desc': 'Import from Excel, CSV, images, PDF and more',
    'features.processing.title': 'Smart Processing',
    'features.processing.desc': 'Automatic structure detection and AI extraction',
    'features.automation.title': 'Automation',
    'features.automation.desc': 'Set up rules and automatic triggers',
    'features.export.title': 'Export & Integrations',
    'features.export.desc': 'Export to files, Webhooks and APIs',
    
    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.welcome': 'Welcome',
    'dashboard.sources': 'Data Sources',
    'dashboard.automations': 'Automations',
    'dashboard.runs': 'Runs',
    'dashboard.usage': 'Usage',
    'dashboard.addSource': 'Add Data Source',
    'dashboard.newAutomation': 'New Automation',
    'dashboard.recentActivity': 'Recent Activity',
    'dashboard.quickActions': 'Quick Actions',
    
    // Sources
    'sources.title': 'Data Sources',
    'sources.add': 'Add Source',
    'sources.upload': 'File Upload',
    'sources.api': 'API Connection',
    'sources.manual': 'Manual Input',
    'sources.spreadsheet': 'Spreadsheet',
    'sources.image': 'Image / OCR',
    'sources.video': 'Video / Transcript',
    
    // Automations
    'automations.title': 'Automations',
    'automations.new': 'New Automation',
    'automations.active': 'Active',
    'automations.paused': 'Paused',
    'automations.trigger.upload': 'On Upload',
    'automations.trigger.update': 'On Update',
    'automations.trigger.schedule': 'Scheduled',
    
    // Settings
    'settings.title': 'Settings',
    'settings.profile': 'Profile',
    'settings.workspace': 'Workspace',
    'settings.billing': 'Billing',
    'settings.team': 'Team Management',
    'settings.language': 'Language',
    'settings.notifications': 'Notifications',
    
    // Access
    'access.denied': 'Access Denied',
    'access.deniedMessage': 'You do not have permission to view this page',
    
    // Plans
    'plans.starter': 'Starter',
    'plans.pro': 'Professional',
    'plans.enterprise': 'Enterprise',
    'plans.monthly': 'Monthly',
    'plans.yearly': 'Yearly',
    'plans.perMonth': '/month',
    
    // Auth
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Confirm Password',
    'auth.forgotPassword': 'Forgot password?',
    'auth.noAccount': "Don't have an account?",
    'auth.hasAccount': 'Already have an account?',
    'auth.loginTitle': 'Login to your account',
    'auth.signupTitle': 'Create a new account',
    'auth.companyName': 'Company Name',
    'auth.fullName': 'Full Name',
    
    // Common
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.view': 'View',
    'common.loading': 'Loading...',
    'common.success': 'Success',
    'common.error': 'Error',
    'common.close': 'Close',
    'common.next': 'Next',
    'common.back': 'Back',
    'common.submit': 'Submit',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('he');

  useEffect(() => {
    const saved = localStorage.getItem('language') as Language;
    if (saved && (saved === 'he' || saved === 'en')) {
      setLanguageState(saved);
    }
  }, []);

  useEffect(() => {
    document.documentElement.dir = language === 'he' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    localStorage.setItem('language', language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  const dir = language === 'he' ? 'rtl' : 'ltr';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
