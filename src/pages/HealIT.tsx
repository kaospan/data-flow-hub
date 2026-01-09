import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { HealITHeader } from '@/components/healit/HealITHeader';
import { HealITFooter } from '@/components/healit/HealITFooter';
import { 
  ArrowLeft, 
  ArrowRight, 
  Shield, 
  Eye, 
  UserCheck, 
  BarChart3, 
  Clock, 
  AlertCircle, 
  ClipboardCheck,
  CheckCircle,
  FileCheck,
  AlertTriangle,
  Calendar,
  FileText,
  Stethoscope,
  Bell,
  Users,
  TrendingUp,
  Heart,
  Activity,
  Sparkles
} from 'lucide-react';

export default function HealIT() {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const Arrow = language === 'he' ? ArrowLeft : ArrowRight;

  const content = {
    he: {
      badge: 'AI קליני + ניהול תורים',
      title: 'המערכת שרופאים צריכים: תיעוד חכם וניהול תורים במקום אחד',
      subtitle: 'תיעוד רפואי מהיר עם AI, תזכורות אוטומטיות לחולים, וניהול תורים חכם. הכל במערכת אחת.',
      cta: 'התחילו בחינם',
      secondary: 'קבעו הדגמה',
      trustPoints: [
        { icon: FileText, text: 'תיעוד מהיר פי 3' },
        { icon: Calendar, text: 'ניהול תורים אוטומטי' },
        { icon: Bell, text: 'תזכורות חכמות' },
      ],
      visualFlow: {
        input: 'ביקור חולה',
        process: 'תיעוד + תזמון',
        output: 'מעקב מלא',
      },
      features: {
        title: 'מערכת אחת לכל תהליך הטיפול',
        subtitle: 'מהרגע שהחולה נכנס ועד המעקב הבא',
        items: [
          {
            icon: FileText,
            title: 'תיעוד רפואי חכם',
            description: 'AI כותב את התיעוד הרפואי בזמן אמת מדיבור או טקסט חופשי. אתם רק מאשרים ומשלימים.',
          },
          {
            icon: Calendar,
            title: 'תזמון תורים אוטומטי',
            description: 'המערכת מזהה צורך במעקב ומציעה תאריכים אופטימליים. חולים מזמינים בלינק או בטלפון.',
          },
          {
            icon: Bell,
            title: 'תזכורות חכמות',
            description: 'תזכורות אוטומטיות לחולים (SMS/WhatsApp), תזכורות לרופאים על ממצאים שדורשים מעקב.',
          },
          {
            icon: Users,
            title: 'מעקב אחר חולים',
            description: 'רשימת מעקב חכמה: מיהו בסיכון, מי לא הגיע למעקב, אילו בדיקות חסרות. בעדיפות קלינית.',
          },
          {
            icon: Stethoscope,
            title: 'חיבור לכללית/מכבי',
            description: 'קריאה אוטומטית של תוצאות מעבדה, מכתבי הפניה ואבחנות מהקופות. בזמן אמת.',
          },
          {
            icon: TrendingUp,
            title: 'ניתוח מגמות',
            description: 'זיהוי אוטומטי של ממצאים מחמירים לאורך זמן (למשל: קריאטינין עולה, HbA1c לא משתפר).',
          },
        ],
      },
      painPoints: {
        title: 'רופאים לא צריכים עוד מערכת. הם צריכים זמן.',
        points: [
          { icon: Clock, text: '2 שעות ביום על תיעוד ומילוי טפסים' },
          { icon: AlertCircle, text: 'חולים שנופלים מהמעקב' },
          { icon: ClipboardCheck, text: 'ניהול תורים ידני ותזכורות באקסל' },
        ],
      },
      workflow: {
        title: 'איך זה עובד בפועל',
        steps: [
          {
            number: '1',
            title: 'במהלך הביקור',
            description: 'תקליטו או תכתבו בטקסט חופשי. AI יוצר תיעוד מובנה: תלונות, בדיקה, אבחנה, טיפול.',
          },
          {
            number: '2',
            title: 'סיום הביקור',
            description: 'אתם מאשרים את התיעוד. המערכת מציעה אוטומטית מועד למעקב (אם נדרש) והחולה מקבל לינק לתיאום.',
          },
          {
            number: '3',
            title: 'מעקב אוטומטי',
            description: 'תזכורות לחולה לפני התור. תזכורות לכם על ממצאים שדורשים תשומת לב. בעדיפות קלינית.',
          },
          {
            number: '4',
            title: 'ניתוח רציף',
            description: 'המערכת עוקבת אחר תוצאות מעבדה מהקופות, מזהה מגמות מדאיגות ומתריעה לפני החמרה.',
          },
        ],
      },
      cta2: {
        title: 'תפסיקו לבזבז זמן על מערכות. התחילו לטפל בחולים.',
        subtitle: 'הצטרפו לרופאים שכבר חוסכים 10+ שעות שבועיות ומטפלים טוב יותר',
        button: 'התחילו תקופת ניסיון חינם',
        secondary: 'קבעו הדגמה',
        footer: 'ללא כרטיס אשראי • התחלה תוך דקות • ביטול בכל עת',
        features: [
          'תיעוד אוטומטי עם AI',
          'ניהול תורים מלא',
          'תזכורות אוטומטיות',
          'חיבור לקופות חולים',
          'מעקב אחר חולים בסיכון',
        ],
      },
    },
    en: {
      badge: 'Clinical AI + Scheduling',
      title: 'The System Doctors Actually Need: Smart Documentation & Appointment Management',
      subtitle: 'AI-powered medical notes, automated patient reminders, and intelligent scheduling. All in one system.',
      cta: 'Start Free Trial',
      secondary: 'Schedule Demo',
      trustPoints: [
        { icon: FileText, text: '3× Faster Documentation' },
        { icon: Calendar, text: 'Automated Scheduling' },
        { icon: Bell, text: 'Smart Reminders' },
      ],
      visualFlow: {
        input: 'Patient Visit',
        process: 'Document + Schedule',
        output: 'Complete Follow-up',
      },
      features: {
        title: 'One System for the Entire Care Journey',
        subtitle: 'From the moment a patient walks in until the next follow-up',
        items: [
          {
            icon: FileText,
            title: 'Smart Medical Documentation',
            description: 'AI writes clinical notes in real-time from speech or free text. You just review and approve.',
          },
          {
            icon: Calendar,
            title: 'Automated Appointment Scheduling',
            description: 'System detects follow-up needs and suggests optimal dates. Patients book via link or phone.',
          },
          {
            icon: Bell,
            title: 'Smart Reminders',
            description: 'Automated patient reminders (SMS/WhatsApp), physician alerts for findings requiring follow-up.',
          },
          {
            icon: Users,
            title: 'Patient Tracking',
            description: 'Smart tracking list: who\'s at risk, who missed follow-up, which tests are missing. Prioritized clinically.',
          },
          {
            icon: Stethoscope,
            title: 'HMO Integration',
            description: 'Automatic retrieval of lab results, referral letters, and diagnoses from Kupot Holim. Real-time.',
          },
          {
            icon: TrendingUp,
            title: 'Trend Analysis',
            description: 'Automatic detection of worsening findings over time (e.g., rising creatinine, unimproved HbA1c).',
          },
        ],
      },
      painPoints: {
        title: 'Doctors don\'t need another system. They need time.',
        points: [
          { icon: Clock, text: '2 hours/day on documentation and forms' },
          { icon: AlertCircle, text: 'Patients falling through the cracks' },
          { icon: ClipboardCheck, text: 'Manual scheduling and Excel reminders' },
        ],
      },
      workflow: {
        title: 'How It Works in Practice',
        steps: [
          {
            number: '1',
            title: 'During the Visit',
            description: 'Record or type in free text. AI generates structured documentation: complaints, examination, diagnosis, treatment.',
          },
          {
            number: '2',
            title: 'End of Visit',
            description: 'You approve the documentation. System automatically suggests follow-up date (if needed) and patient receives booking link.',
          },
          {
            number: '3',
            title: 'Automated Follow-up',
            description: 'Reminders to patient before appointment. Reminders to you about findings requiring attention. Clinically prioritized.',
          },
          {
            number: '4',
            title: 'Continuous Analysis',
            description: 'System monitors lab results from HMOs, identifies worrying trends, and alerts before deterioration.',
          },
        ],
      },
      cta2: {
        title: 'Stop Wasting Time on Systems. Start Treating Patients.',
        subtitle: 'Join doctors already saving 10+ hours weekly and providing better care',
        button: 'Start Free Trial',
        secondary: 'Schedule Demo',
        footer: 'No credit card required • Start in minutes • Cancel anytime',
        features: [
          'Automated documentation with AI',
          'Complete scheduling management',
          'Automated reminders',
          'HMO integration',
          'High-risk patient tracking',
        ],
      },
    },
  };

  const t = content[language];

  return (
    <div className={`healit-page min-h-screen flex flex-col ${theme}`}>
      <HealITHeader />
      
      {/* Hero Section - Completely Different Medical Theme */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        {/* Soft medical gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-cyan-50/50 to-white dark:from-slate-900 dark:via-teal-950/30 dark:to-slate-950" />
        
        {/* Floating medical symbols */}
        <div className="absolute top-1/4 left-[10%] w-64 h-64 rounded-full bg-teal-200/30 dark:bg-teal-500/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-[10%] w-80 h-80 rounded-full bg-cyan-200/30 dark:bg-cyan-500/10 blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-48 h-48 rounded-full bg-emerald-200/20 dark:bg-emerald-500/10 blur-2xl" />
        
        {/* Decorative cross pattern */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M25 0h10v25h25v10H35v25H25V35H0V25h25V0z' fill='%230d9488' fill-opacity='0.5'/%3E%3C/svg%3E")`,
            backgroundSize: '120px 120px',
          }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-teal-200 dark:border-teal-700/50 shadow-lg shadow-teal-500/10 mb-10">
              <Heart className="w-5 h-5 text-teal-500" />
              <span className="font-semibold text-teal-700 dark:text-teal-300">{t.badge}</span>
              <Sparkles className="w-4 h-4 text-cyan-500" />
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight text-slate-800 dark:text-white">
              {t.title.split(':')[0]}:
              <span className="block mt-2 healit-gradient-text">
                {t.title.split(':')[1]}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl lg:text-2xl text-slate-600 dark:text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              {t.subtitle}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link to="/signup">
                <Button className="healit-btn-primary text-lg px-8 py-6 h-auto">
                  {t.cta}
                  <Arrow className="w-5 h-5 ms-2" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button 
                  variant="outline" 
                  className="text-lg px-8 py-6 h-auto border-2 border-teal-200 dark:border-teal-700 text-teal-700 dark:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-900/30"
                >
                  {t.secondary}
                </Button>
              </Link>
            </div>

            {/* Trust Points */}
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 mb-16">
              {t.trustPoints.map((point, index) => (
                <div key={index} className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-teal-100 dark:border-teal-800/50 shadow-sm">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-400 text-white">
                    <point.icon className="w-5 h-5" />
                  </div>
                  <span className="font-medium text-slate-700 dark:text-slate-200">{point.text}</span>
                </div>
              ))}
            </div>

            {/* Visual Flow Card */}
            <div className="healit-card p-8 md:p-12 max-w-4xl mx-auto healit-glow">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex flex-col items-center gap-3 group">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-cyan-500/25 group-hover:scale-110 transition-transform">
                    <Users className="w-10 h-10 text-white" />
                  </div>
                  <span className="font-semibold text-slate-600 dark:text-slate-300">{t.visualFlow.input}</span>
                </div>

                <div className="hidden md:flex flex-1 items-center gap-3">
                  <div className="flex-1 h-1 bg-gradient-to-r from-cyan-200 via-teal-300 to-emerald-200 dark:from-cyan-800 dark:via-teal-700 dark:to-emerald-800 rounded-full" />
                  <div className="px-4 py-2 rounded-full bg-teal-100 dark:bg-teal-900/50 border border-teal-200 dark:border-teal-700">
                    <span className="text-sm font-semibold text-teal-700 dark:text-teal-300">{t.visualFlow.process}</span>
                  </div>
                  <div className="flex-1 h-1 bg-gradient-to-r from-emerald-200 via-teal-300 to-cyan-200 dark:from-emerald-800 dark:via-teal-700 dark:to-cyan-800 rounded-full" />
                </div>

                <div className="flex flex-col items-center gap-3 group">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/25 group-hover:scale-110 transition-transform">
                    <CheckCircle className="w-10 h-10 text-white" />
                  </div>
                  <span className="font-semibold text-slate-600 dark:text-slate-300">{t.visualFlow.output}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-slate-950 to-transparent" />
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-slate-800 dark:text-white">
              {t.features.title}
            </h2>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              {t.features.subtitle}
            </p>
          </div>

          {/* Pain Points Banner */}
          <div className="healit-card p-8 mb-16 max-w-5xl mx-auto bg-gradient-to-r from-rose-50 to-orange-50 dark:from-rose-950/30 dark:to-orange-950/30 border-rose-200 dark:border-rose-800/30">
            <h3 className="text-xl font-bold mb-6 text-center text-slate-700 dark:text-slate-200">{t.painPoints.title}</h3>
            <div className="flex flex-wrap justify-center gap-4">
              {t.painPoints.points.map((point, index) => (
                <div key={index} className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-rose-200 dark:border-rose-800/50">
                  <point.icon className="w-5 h-5 text-rose-500" />
                  <span className="font-medium text-slate-700 dark:text-slate-200">{point.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {t.features.items.map((feature, index) => (
              <div key={index} className="healit-card p-6 group">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center mb-5 shadow-lg shadow-teal-500/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-3 text-slate-800 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-24 bg-gradient-to-b from-teal-50/50 to-white dark:from-slate-900 dark:to-slate-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-slate-800 dark:text-white">
              {t.workflow.title}
            </h2>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {t.workflow.steps.map((step, index) => (
                <div key={index} className="healit-card p-8 group relative">
                  <div className="absolute top-6 end-6 w-12 h-12 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-teal-500/20 group-hover:scale-110 transition-transform">
                    <span className="text-xl font-bold text-white">{step.number}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 pe-16 text-slate-800 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500 to-cyan-600" />
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M25 0h10v25h25v10H35v25H25V35H0V25h25V0z' fill='white' fill-opacity='0.3'/%3E%3C/svg%3E")`,
            backgroundSize: '80px 80px',
          }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm mb-8">
              <Heart className="w-10 h-10 text-white" />
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white">
              {t.cta2.title}
            </h2>

            <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto">
              {t.cta2.subtitle}
            </p>

            <div className="flex flex-wrap justify-center gap-3 mb-10">
              {t.cta2.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium">
                  <CheckCircle className="w-4 h-4" />
                  {feature}
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <Link to="/signup">
                <Button className="text-lg px-8 py-6 h-auto bg-white text-teal-600 hover:bg-white/90 shadow-xl shadow-black/20">
                  {t.cta2.button}
                  <Arrow className="w-5 h-5 ms-2" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button 
                  variant="outline" 
                  className="text-lg px-8 py-6 h-auto border-2 border-white/50 text-white hover:bg-white/10"
                >
                  {t.cta2.secondary}
                </Button>
              </Link>
            </div>

            <p className="text-white/60 text-sm">
              {t.cta2.footer}
            </p>
          </div>
        </div>
      </section>

      <HealITFooter />
    </div>
  );
}
