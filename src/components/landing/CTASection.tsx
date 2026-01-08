import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Shield, CheckCircle } from 'lucide-react';

export function CTASection() {
  const { language } = useLanguage();
  const Arrow = language === 'he' ? ArrowLeft : ArrowRight;

  const content = {
    he: {
      title: 'הפסיקו לאבד נתונים בלי לדעת',
      subtitle: 'הצטרפו לעסקים שכבר יודעים בדיוק מה קורה עם הנתונים שלהם',
      cta: 'התחילו תקופת ניסיון חינם',
      secondary: 'קבעו הדגמה',
      footer: 'ללא כרטיס אשראי • התחלה תוך דקות • ביטול בכל עת',
      features: [
        'תיעוד מלא לכל ביקורת',
        'בדיקה אנושית על כל שלב',
        'ניטור ביצועי AI בזמן אמת',
      ],
    },
    en: {
      title: 'Stop losing data without knowing',
      subtitle: 'Join businesses that already know exactly what\'s happening with their data',
      cta: 'Start Free Trial',
      secondary: 'Schedule Demo',
      footer: 'No credit card required • Start in minutes • Cancel anytime',
      features: [
        'Complete audit documentation',
        'Human review at every step',
        'Real-time AI monitoring',
      ],
    },
  };

  const t = content[language];

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background - Professional, calm */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/50 via-transparent to-primary/5" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="glass-card p-12 md:p-16 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 mb-8">
            <Shield className="w-8 h-8 text-primary" />
          </div>

          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            {t.title}
          </h2>

          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            {t.subtitle}
          </p>

          {/* Trust features */}
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            {t.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-success" />
                <span>{feature}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
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

          <p className="text-sm text-muted-foreground mt-6">
            {t.footer}
          </p>
        </div>
      </div>
    </section>
  );
}