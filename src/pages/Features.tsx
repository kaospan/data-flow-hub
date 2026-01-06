import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  FileSpreadsheet, Brain, Zap, Share2, Image, Video, Link2, FileText,
  Shield, Clock, BarChart3, Users, Globe, Sparkles
} from 'lucide-react';

const mainFeatures = [
  {
    icon: FileSpreadsheet,
    title: { he: 'קליטת נתונים מכל מקור', en: 'Ingest Data from Any Source' },
    desc: { 
      he: 'העלו קבצי Excel, CSV, תמונות לסריקת OCR, PDFs ועוד. המערכת מזהה אוטומטית את מבנה הנתונים ומכינה אותם לעיבוד.',
      en: 'Upload Excel, CSV files, images for OCR scanning, PDFs, and more. The system automatically detects data structure and prepares it for processing.'
    },
    color: 'text-success',
    bgColor: 'bg-success/10',
  },
  {
    icon: Brain,
    title: { he: 'עיבוד חכם מבוסס AI', en: 'AI-Powered Processing' },
    desc: {
      he: 'מנועי AI מתקדמים מזהים דפוסים, מחלצים מידע ומסווגים נתונים אוטומטית עם דיוק גבוה.',
      en: 'Advanced AI engines identify patterns, extract information, and automatically classify data with high accuracy.'
    },
    color: 'text-info',
    bgColor: 'bg-info/10',
  },
  {
    icon: Zap,
    title: { he: 'אוטומציות מתקדמות', en: 'Advanced Automations' },
    desc: {
      he: 'הגדירו תהליכים אוטומטיים שרצים על הנתונים שלכם - מעיבוד וניתוח ועד התראות ויצירת דוחות.',
      en: 'Define automated processes that run on your data - from processing and analysis to alerts and report generation.'
    },
    color: 'text-warning',
    bgColor: 'bg-warning/10',
  },
  {
    icon: Share2,
    title: { he: 'ייצוא ואינטגרציות', en: 'Export & Integrations' },
    desc: {
      he: 'ייצאו נתונים לכל פורמט, שתפו עם מערכות אחרות או השתמשו ב-API שלנו לאינטגרציה מלאה.',
      en: 'Export data to any format, share with other systems, or use our API for full integration.'
    },
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
];

const additionalFeatures = [
  {
    icon: Shield,
    title: { he: 'אבטחה מתקדמת', en: 'Advanced Security' },
    desc: { he: 'הצפנה מקצה לקצה, RBAC ותאימות GDPR', en: 'End-to-end encryption, RBAC, and GDPR compliance' },
  },
  {
    icon: Clock,
    title: { he: 'זמן אמת', en: 'Real-time' },
    desc: { he: 'עדכונים מיידיים וסנכרון בזמן אמת', en: 'Instant updates and real-time sync' },
  },
  {
    icon: BarChart3,
    title: { he: 'דוחות וניתוח', en: 'Reports & Analytics' },
    desc: { he: 'לוחות מחוונים חכמים ותובנות עסקיות', en: 'Smart dashboards and business insights' },
  },
  {
    icon: Users,
    title: { he: 'עבודת צוות', en: 'Team Collaboration' },
    desc: { he: 'הרשאות מתקדמות ושיתוף פעולה בזמן אמת', en: 'Advanced permissions and real-time collaboration' },
  },
  {
    icon: Globe,
    title: { he: 'תמיכה בעברית', en: 'Hebrew Support' },
    desc: { he: 'ממשק מלא בעברית עם תמיכה ב-RTL', en: 'Full Hebrew interface with RTL support' },
  },
  {
    icon: Sparkles,
    title: { he: 'AI מותאם אישית', en: 'Custom AI' },
    desc: { he: 'אימון מודלים על הנתונים שלכם', en: 'Train models on your data' },
  },
];

const sourceTypes = [
  { icon: FileSpreadsheet, label: 'Excel / CSV' },
  { icon: Image, label: 'OCR / Images' },
  { icon: Video, label: 'Video / Audio' },
  { icon: Link2, label: 'API' },
  { icon: FileText, label: 'PDF / Docs' },
];

export default function Features() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-16">
        {/* Hero */}
        <section className="py-24 relative">
          <div className="absolute inset-0 bg-gradient-hero" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                <span className="gradient-text">
                  {language === 'he' ? 'כל מה שאתם צריכים' : 'Everything You Need'}
                </span>
              </h1>
              <p className="text-xl text-muted-foreground">
                {language === 'he'
                  ? 'פלטפורמה מלאה לניהול, עיבוד ואוטומציה של נתונים'
                  : 'A complete platform for data management, processing, and automation'}
              </p>
            </div>
          </div>
        </section>

        {/* Main Features */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {mainFeatures.map((feature) => (
                <div key={feature.title.en} className="glass-card p-8 group hover:border-primary/30 transition-colors">
                  <div className={`w-16 h-16 rounded-xl ${feature.bgColor} flex items-center justify-center mb-6 transition-transform group-hover:scale-110`}>
                    <feature.icon className={`w-8 h-8 ${feature.color}`} />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{feature.title[language]}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.desc[language]}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Source Types */}
        <section className="py-24 bg-secondary/20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              {language === 'he' ? 'מקורות נתונים נתמכים' : 'Supported Data Sources'}
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              {sourceTypes.map((source) => (
                <div
                  key={source.label}
                  className="flex items-center gap-3 px-6 py-4 rounded-xl glass-card hover:border-primary/30 transition-colors"
                >
                  <source.icon className="w-6 h-6 text-primary" />
                  <span className="font-medium text-lg">{source.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Additional Features Grid */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              {language === 'he' ? 'ועוד הרבה יותר' : 'And Much More'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {additionalFeatures.map((feature) => (
                <div key={feature.title.en} className="glass-card p-6 text-center">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title[language]}</h3>
                  <p className="text-sm text-muted-foreground">{feature.desc[language]}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
