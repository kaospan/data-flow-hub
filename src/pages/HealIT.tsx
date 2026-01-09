import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
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
  TrendingUp
} from 'lucide-react';

export default function HealIT() {
  const { language } = useLanguage();
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
            color: 'text-primary',
            bgColor: 'bg-primary/10',
          },
          {
            icon: Calendar,
            title: 'תזמון תורים אוטומטי',
            description: 'המערכת מזהה צורך במעקב ומציעה תאריכים אופטימליים. חולים מזמינים בלינק או בטלפון.',
            color: 'text-success',
            bgColor: 'bg-success/10',
          },
          {
            icon: Bell,
            title: 'תזכורות חכמות',
            description: 'תזכורות אוטומטיות לחולים (SMS/WhatsApp), תזכורות לרופאים על ממצאים שדורשים מעקב.',
            color: 'text-warning',
            bgColor: 'bg-warning/10',
          },
          {
            icon: Users,
            title: 'מעקב אחר חולים',
            description: 'רשימת מעקב חכמה: מיהו בסיכון, מי לא הגיע למעקב, אילו בדיקות חסרות. בעדיפות קלינית.',
            color: 'text-info',
            bgColor: 'bg-info/10',
          },
          {
            icon: Stethoscope,
            title: 'חיבור לכללית/מכבי',
            description: 'קריאה אוטומטית של תוצאות מעבדה, מכתבי הפניה ואבחנות מהקופות. בזמן אמת.',
            color: 'text-purple-500',
            bgColor: 'bg-purple-50',
          },
          {
            icon: TrendingUp,
            title: 'ניתוח מגמות',
            description: 'זיהוי אוטומטי של ממצאים מחמירים לאורך זמן (למשל: קריאטינין עולה, HbA1c לא משתפר).',
            color: 'text-destructive',
            bgColor: 'bg-destructive/10',
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
            color: 'text-primary',
            bgColor: 'bg-primary/10',
          },
          {
            icon: Calendar,
            title: 'Automated Appointment Scheduling',
            description: 'System detects follow-up needs and suggests optimal dates. Patients book via link or phone.',
            color: 'text-success',
            bgColor: 'bg-success/10',
          },
          {
            icon: Bell,
            title: 'Smart Reminders',
            description: 'Automated patient reminders (SMS/WhatsApp), physician alerts for findings requiring follow-up.',
            color: 'text-warning',
            bgColor: 'bg-warning/10',
          },
          {
            icon: Users,
            title: 'Patient Tracking',
            description: 'Smart tracking list: who\'s at risk, who missed follow-up, which tests are missing. Prioritized clinically.',
            color: 'text-info',
            bgColor: 'bg-info/10',
          },
          {
            icon: Stethoscope,
            title: 'HMO Integration',
            description: 'Automatic retrieval of lab results, referral letters, and diagnoses from Kupot Holim. Real-time.',
            color: 'text-purple-500',
            bgColor: 'bg-purple-50',
          },
          {
            icon: TrendingUp,
            title: 'Trend Analysis',
            description: 'Automatic detection of worsening findings over time (e.g., rising creatinine, unimproved HbA1c).',
            color: 'text-destructive',
            bgColor: 'bg-destructive/10',
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
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-success/5" />
        <div className="absolute top-1/4 left-1/4 w-[800px] h-[800px] bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-gradient-to-tl from-success/8 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s' }} />
        
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary/10 to-success/10 border border-primary/20 text-foreground text-sm font-semibold mb-10 animate-fade-in backdrop-blur-sm shadow-lg shadow-primary/5">
              <Stethoscope className="w-5 h-5 text-primary" />
              <span className="bg-gradient-to-r from-primary to-success bg-clip-text text-transparent">{t.badge}</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-8 animate-slide-up leading-tight bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent" style={{ animationDelay: '0.1s' }}>
              {t.title}
            </h1>

            <p className="text-xl md:text-2xl lg:text-3xl text-muted-foreground/80 mb-12 max-w-3xl mx-auto animate-slide-up font-light leading-relaxed" style={{ animationDelay: '0.2s' }}>
              {t.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20 animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <Link to="/signup">
                <Button variant="hero" size="xl" className="shadow-2xl shadow-primary/20 hover:shadow-primary/30 transition-all duration-500 hover:scale-105">
                  {t.cta}
                  <Arrow className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="heroOutline" size="xl" className="backdrop-blur-sm hover:bg-secondary/50 transition-all duration-500 hover:scale-105">
                  {t.secondary}
                </Button>
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 mb-20 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              {t.trustPoints.map((point, index) => (
                <div key={index} className="flex items-center gap-3 text-muted-foreground group hover:text-foreground transition-colors duration-300">
                  <div className="p-2 rounded-lg bg-success/10 group-hover:bg-success/20 transition-colors duration-300">
                    <point.icon className="w-5 h-5 text-success" />
                  </div>
                  <span className="text-sm font-semibold">{point.text}</span>
                </div>
              ))}
            </div>

            {/* Visual Flow */}
            <div className="mt-20 relative animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <div className="relative p-1 rounded-3xl bg-gradient-to-r from-primary/30 via-success/30 to-primary/30 max-w-4xl mx-auto">
                <div className="glass-card p-10 md:p-16 rounded-3xl bg-background/95 backdrop-blur-xl">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="flex flex-col items-center gap-4 group cursor-pointer">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-info to-info/50 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
                        <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-info/20 to-info/10 flex items-center justify-center border border-info/30 group-hover:scale-110 transition-transform duration-500">
                          <Users className="w-10 h-10 text-info" />
                        </div>
                      </div>
                      <span className="text-base font-semibold text-muted-foreground group-hover:text-foreground transition-colors">{t.visualFlow.input}</span>
                    </div>

                    <div className="hidden md:flex flex-1 items-center gap-3 px-6">
                      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
                      <div className="px-4 py-2 rounded-full bg-secondary/50 backdrop-blur-sm border border-border/50">
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t.visualFlow.process}</span>
                      </div>
                      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
                    </div>

                    <div className="flex flex-col items-center gap-4 group cursor-pointer">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-success to-success/50 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
                        <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-success/20 to-success/10 flex items-center justify-center border border-success/30 group-hover:scale-110 transition-transform duration-500">
                          <CheckCircle className="w-10 h-10 text-success" />
                        </div>
                      </div>
                      <span className="text-base font-semibold text-muted-foreground group-hover:text-foreground transition-colors">{t.visualFlow.output}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Features Section */}
      <section className="py-32 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              {t.features.title}
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground/70 max-w-3xl mx-auto font-light">
              {t.features.subtitle}
            </p>
          </div>

          {/* Pain Points */}
          <div className="relative p-1 rounded-3xl bg-gradient-to-r from-destructive/30 to-warning/30 mb-20 max-w-5xl mx-auto">
            <div className="glass-card p-10 rounded-3xl bg-background/95 backdrop-blur-xl">
              <h3 className="text-2xl font-bold mb-8 text-center">{t.painPoints.title}</h3>
              <div className="flex flex-wrap justify-center gap-6">
                {t.painPoints.points.map((point, index) => (
                  <div key={index} className="flex items-center gap-4 px-6 py-4 rounded-2xl bg-gradient-to-br from-destructive/5 to-warning/5 border border-destructive/20 hover:border-destructive/40 transition-all duration-500 hover:scale-105 group">
                    <div className="p-2 rounded-lg bg-destructive/10 group-hover:bg-destructive/20 transition-colors">
                      <point.icon className="w-6 h-6 text-destructive" />
                    </div>
                    <span className="text-base font-medium">{point.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {t.features.items.map((feature, index) => (
              <div
                key={index}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-success/5 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative glass-card-hover p-8 rounded-3xl h-full border-2 border-transparent group-hover:border-primary/20 transition-all duration-500">
                  <div className="relative mb-6">
                    <div className={`absolute inset-0 ${feature.bgColor} rounded-2xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-500`}></div>
                    <div className={`relative w-16 h-16 rounded-2xl ${feature.bgColor} flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                      <feature.icon className={`w-8 h-8 ${feature.color}`} />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">{feature.title}</h3>
                  <p className="text-base text-muted-foreground/80 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-32 relative bg-gradient-to-b from-secondary/20 to-background">
        <div className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)`,
            backgroundSize: '80px 80px',
          }}
        />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              {t.workflow.title}
            </h2>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {t.workflow.steps.map((step, index) => (
                <div key={index} className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-success/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative glass-card p-10 rounded-3xl border-2 border-transparent group-hover:border-primary/20 transition-all duration-500 hover:scale-105">
                    <div className="absolute top-8 right-8 w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-success/20 flex items-center justify-center border border-primary/30 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                      <span className="text-3xl font-bold bg-gradient-to-br from-primary to-success bg-clip-text text-transparent">{step.number}</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-4 pr-20 group-hover:text-primary transition-colors">{step.title}</h3>
                    <p className="text-base text-muted-foreground/80 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-success/10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-to-br from-primary/20 to-success/20 rounded-full blur-3xl opacity-50 animate-pulse" style={{ animationDuration: '12s' }} />

        <div className="container mx-auto px-4 relative z-10">
          <div className="relative p-1 rounded-[3rem] bg-gradient-to-r from-primary/40 via-success/40 to-primary/40 max-w-5xl mx-auto">
            <div className="glass-card p-16 md:p-20 rounded-[3rem] text-center bg-background/95 backdrop-blur-xl">
              <div className="relative inline-flex items-center justify-center mb-10">
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-success rounded-3xl blur-2xl opacity-30 animate-pulse" style={{ animationDuration: '6s' }}></div>
                <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-br from-primary/20 to-success/20 flex items-center justify-center border-2 border-primary/30">
                  <Stethoscope className="w-10 h-10 text-primary" />
                </div>
              </div>

              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
                {t.cta2.title}
              </h2>

              <p className="text-xl md:text-2xl text-muted-foreground/70 mb-12 max-w-3xl mx-auto font-light leading-relaxed">
                {t.cta2.subtitle}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12 max-w-4xl mx-auto">
                {t.cta2.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-gradient-to-br from-success/5 to-primary/5 border border-success/20 hover:border-success/40 transition-all duration-500 hover:scale-105 group">
                    <div className="p-1.5 rounded-lg bg-success/10 group-hover:bg-success/20 transition-colors">
                      <CheckCircle className="w-5 h-5 text-success" />
                    </div>
                    <span className="text-sm font-semibold">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-10">
                <Link to="/signup">
                  <Button variant="hero" size="xl" className="shadow-2xl shadow-primary/30 hover:shadow-primary/40 transition-all duration-500 hover:scale-110">
                    {t.cta2.button}
                    <Arrow className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button variant="heroOutline" size="xl" className="backdrop-blur-sm hover:bg-secondary/50 transition-all duration-500 hover:scale-110">
                    {t.cta2.secondary}
                  </Button>
                </Link>
              </div>

              <p className="text-sm text-muted-foreground/60 font-light">
                {t.cta2.footer}
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
