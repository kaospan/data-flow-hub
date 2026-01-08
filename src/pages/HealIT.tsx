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
  AlertTriangle
} from 'lucide-react';

export default function HealIT() {
  const { language } = useLanguage();
  const Arrow = language === 'he' ? ArrowLeft : ArrowRight;

  const content = {
    he: {
      badge: 'AI בפיקוח מומחים',
      title: 'ראו מה קורה לנתונים שלכם כשאף אחד לא צופה',
      subtitle: 'בדקו את מה שה-AI חילץ. וודאו שלא התפספס כלום. שמרו על עקבות ביקורת מלאות.',
      cta: 'התחילו בחינם',
      secondary: 'קבעו הדגמה',
      trustPoints: [
        { icon: Eye, text: 'כל שלב ניתן לבדיקה' },
        { icon: Shield, text: 'תיעוד מלא לביקורת' },
        { icon: CheckCircle, text: 'אימות אנושי' },
      ],
      visualFlow: {
        input: 'נתונים לא מובנים',
        process: 'AI + בדיקה',
        output: 'נתונים מאומתים',
      },
      features: {
        title: 'למה ארגוני בריאות בוחרים בנו',
        subtitle: 'כי התעלמות מהבעיה הרגישה כבר לא אחראית',
        items: [
          {
            icon: Eye,
            title: 'ראו מה פספסתם',
            description: 'הצגת נתונים לא מעובדים, קבצים שנשכחו, ותהליכים שנתקעו - לפני שזה הופך לבעיה.',
            color: 'text-warning',
            bgColor: 'bg-warning/10',
          },
          {
            icon: UserCheck,
            title: 'מומחה בתוך התהליך',
            description: 'כל חילוץ AI ניתן לבדיקה ואישור על ידי מומחה - עם תיעוד מי אישר ומתי.',
            color: 'text-success',
            bgColor: 'bg-success/10',
          },
          {
            icon: Shield,
            title: 'עקבות ביקורת מלאות',
            description: 'כל שלב מתועד: קלט גולמי, פלט AI, תיקונים אנושיים. מוכן לכל ביקורת.',
            color: 'text-info',
            bgColor: 'bg-info/10',
          },
          {
            icon: BarChart3,
            title: 'AI שניתן לניטור',
            description: 'עקבו אחר ביצועי AI לאורך זמן - ציוני ביטחון, שיעורי תיקון, חריגות.',
            color: 'text-primary',
            bgColor: 'bg-primary/10',
          },
        ],
      },
      painPoints: {
        title: 'אנשים לא משלמים על תכונות. הם משלמים על הקלה.',
        points: [
          { icon: Clock, text: 'שעות שנבזבזו על ניקוי נתונים ידני' },
          { icon: AlertCircle, text: 'שגיאות שמתגלות רק בביקורת' },
          { icon: ClipboardCheck, text: 'חוסר ודאות לגבי מה בתוך הנתונים' },
        ],
      },
      cta2: {
        title: 'הפסיקו לאבד נתונים בלי לדעת',
        subtitle: 'הצטרפו לארגוני בריאות שכבר יודעים בדיוק מה קורה עם הנתונים שלהם',
        button: 'התחילו תקופת ניסיון חינם',
        secondary: 'קבעו הדגמה',
        footer: 'ללא כרטיס אשראי • התחלה תוך דקות • ביטול בכל עת',
        features: [
          'תיעוד מלא לכל ביקורת',
          'בדיקה אנושית על כל שלב',
          'ניטור ביצועי AI בזמן אמת',
        ],
      },
    },
    en: {
      badge: 'Human-Supervised AI',
      title: 'See what your data is doing when no one is watching',
      subtitle: 'Review what AI extracted. Verify nothing was missed. Keep complete audit trails.',
      cta: 'Start Free Trial',
      secondary: 'Schedule Demo',
      trustPoints: [
        { icon: Eye, text: 'Every step reviewable' },
        { icon: Shield, text: 'Full audit trail' },
        { icon: CheckCircle, text: 'Human validation' },
      ],
      visualFlow: {
        input: 'Unstructured Data',
        process: 'AI + Review',
        output: 'Validated Data',
      },
      features: {
        title: 'Why Healthcare Organizations Choose Us',
        subtitle: 'Because ignoring the problem already feels irresponsible',
        items: [
          {
            icon: Eye,
            title: 'See What You\'re Missing',
            description: 'Surface unprocessed data, forgotten files, stuck workflows - before they become problems.',
            color: 'text-warning',
            bgColor: 'bg-warning/10',
          },
          {
            icon: UserCheck,
            title: 'Expert in the Loop',
            description: 'Every AI extraction can be reviewed and approved by a human - with logs of who approved what, when.',
            color: 'text-success',
            bgColor: 'bg-success/10',
          },
          {
            icon: Shield,
            title: 'Complete Audit Trail',
            description: 'Every step documented: raw input, AI output, human corrections. Ready for any audit.',
            color: 'text-info',
            bgColor: 'bg-info/10',
          },
          {
            icon: BarChart3,
            title: 'AI You Can Monitor',
            description: 'Track AI performance over time - confidence scores, correction rates, anomalies.',
            color: 'text-primary',
            bgColor: 'bg-primary/10',
          },
        ],
      },
      painPoints: {
        title: 'People don\'t pay for features. They pay for relief.',
        points: [
          { icon: Clock, text: 'Hours wasted on manual data cleanup' },
          { icon: AlertCircle, text: 'Errors discovered only during audits' },
          { icon: ClipboardCheck, text: 'Uncertainty about what\'s in the data' },
        ],
      },
      cta2: {
        title: 'Stop losing data without knowing',
        subtitle: 'Join healthcare organizations that already know exactly what\'s happening with their data',
        button: 'Start Free Trial',
        secondary: 'Schedule Demo',
        footer: 'No credit card required • Start in minutes • Cancel anytime',
        features: [
          'Complete audit documentation',
          'Human review at every step',
          'Real-time AI monitoring',
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
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-secondary/20" />
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-destructive/3 rounded-full blur-3xl" />
        
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border text-foreground text-sm font-medium mb-8 animate-fade-in">
              <Shield className="w-4 h-4 text-primary" />
              <span>{t.badge}</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-slide-up leading-tight" style={{ animationDelay: '0.1s' }}>
              {t.title}
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.2s' }}>
              {t.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <Link to="/signup">
                <Button variant="hero" size="xl">
                  {t.cta}
                  <Arrow className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="heroOutline" size="xl">
                  {t.secondary}
                </Button>
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              {t.trustPoints.map((point, index) => (
                <div key={index} className="flex items-center gap-2 text-muted-foreground">
                  <point.icon className="w-5 h-5 text-success" />
                  <span className="text-sm font-medium">{point.text}</span>
                </div>
              ))}
            </div>

            {/* Visual Flow */}
            <div className="mt-16 relative animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <div className="glass-card p-8 md:p-12 max-w-3xl mx-auto">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-16 h-16 rounded-xl bg-warning/10 flex items-center justify-center">
                      <AlertTriangle className="w-8 h-8 text-warning" />
                    </div>
                    <span className="text-sm text-muted-foreground">{t.visualFlow.input}</span>
                  </div>

                  <div className="hidden md:block flex-1 border-t-2 border-dashed border-border relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-3">
                      <span className="text-xs text-muted-foreground">{t.visualFlow.process}</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    <div className="w-16 h-16 rounded-xl bg-success/10 flex items-center justify-center">
                      <FileCheck className="w-8 h-8 text-success" />
                    </div>
                    <span className="text-sm text-muted-foreground">{t.visualFlow.output}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              {t.features.title}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t.features.subtitle}
            </p>
          </div>

          {/* Pain Points */}
          <div className="glass-card p-8 mb-16 max-w-4xl mx-auto">
            <h3 className="text-xl font-semibold mb-6 text-center">{t.painPoints.title}</h3>
            <div className="flex flex-wrap justify-center gap-6">
              {t.painPoints.points.map((point, index) => (
                <div key={index} className="flex items-center gap-3 px-4 py-2 rounded-lg bg-destructive/5 border border-destructive/10">
                  <point.icon className="w-5 h-5 text-destructive" />
                  <span className="text-sm">{point.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {t.features.items.map((feature, index) => (
              <div
                key={index}
                className="glass-card-hover p-6 group"
              >
                <div className={`w-14 h-14 rounded-xl ${feature.bgColor} flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                  <feature.icon className={`w-7 h-7 ${feature.color}`} />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/50 via-transparent to-primary/5" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="glass-card p-12 md:p-16 text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 mb-8">
              <Shield className="w-8 h-8 text-primary" />
            </div>

            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              {t.cta2.title}
            </h2>

            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              {t.cta2.subtitle}
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-10">
              {t.cta2.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/signup">
                <Button variant="hero" size="xl">
                  {t.cta2.button}
                  <Arrow className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="heroOutline" size="xl">
                  {t.cta2.secondary}
                </Button>
              </Link>
            </div>

            <p className="text-sm text-muted-foreground mt-6">
              {t.cta2.footer}
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
