import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, FileSpreadsheet, Sparkles, Zap, Upload, FileSearch } from 'lucide-react';

export function HeroSection() {
  const { language } = useLanguage();
  const Arrow = language === 'he' ? ArrowLeft : ArrowRight;

  const content = {
    he: {
      badge: 'AI חכם לנתונים',
      title: 'הפכו מסמכים לנתונים מובנים',
      subtitle: 'העלו קבצים, תמונות או PDF - וקבלו נתונים מסודרים ומוכנים לשימוש תוך שניות',
      cta: 'התחילו בחינם',
      secondary: 'צפו בהדגמה',
      trustPoints: [
        { icon: Upload, text: 'העלאה פשוטה' },
        { icon: FileSearch, text: 'זיהוי אוטומטי' },
        { icon: Sparkles, text: 'עיבוד AI' },
      ],
    },
    en: {
      badge: 'Smart Data AI',
      title: 'Turn documents into structured data',
      subtitle: 'Upload files, images, or PDFs - get organized, ready-to-use data in seconds',
      cta: 'Start Free',
      secondary: 'Watch Demo',
      trustPoints: [
        { icon: Upload, text: 'Easy upload' },
        { icon: FileSearch, text: 'Auto detection' },
        { icon: Sparkles, text: 'AI processing' },
      ],
    },
  };

  const t = content[language];

  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-secondary/20" />
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent/10 rounded-full blur-3xl" />
      
      {/* Grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border text-foreground text-sm font-medium mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>{t.badge}</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-slide-up leading-tight" style={{ animationDelay: '0.1s' }}>
            {t.title}
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.2s' }}>
            {t.subtitle}
          </p>

          {/* CTA Buttons */}
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

          {/* Trust Points */}
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            {t.trustPoints.map((point, index) => (
              <div key={index} className="flex items-center gap-2 text-muted-foreground">
                <point.icon className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">{point.text}</span>
              </div>
            ))}
          </div>

          {/* Visual representation - Document to Data */}
          <div className="mt-16 relative animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <div className="glass-card p-8 md:p-12 max-w-3xl mx-auto">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                {/* Raw documents */}
                <div className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center">
                    <FileSpreadsheet className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {language === 'he' ? 'מסמכים' : 'Documents'}
                  </span>
                </div>

                {/* Arrow */}
                <div className="hidden md:block flex-1 border-t-2 border-dashed border-border relative">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-3">
                    <Zap className="w-5 h-5 text-primary" />
                  </div>
                </div>

                {/* Structured data */}
                <div className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-primary" />
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {language === 'he' ? 'נתונים מובנים' : 'Structured Data'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
