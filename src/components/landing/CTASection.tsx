import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Zap } from 'lucide-react';

export function CTASection() {
  const { t, language } = useLanguage();
  const Arrow = language === 'he' ? ArrowLeft : ArrowRight;

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-info/10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="glass-card p-12 md:p-16 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-primary mb-8">
            <Zap className="w-8 h-8 text-primary-foreground" />
          </div>

          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            {language === 'he'
              ? 'מוכנים להתחיל לבצע אוטומציות?'
              : 'Ready to Start Automating?'}
          </h2>

          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
            {language === 'he'
              ? 'הצטרפו לאלפי עסקים בישראל שכבר משתמשים ב-DataFlow לחיסכון בזמן ובמשאבים'
              : 'Join thousands of Israeli businesses already using DataFlow to save time and resources'}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup">
              <Button variant="hero" size="xl">
                {language === 'he' ? 'התחילו תקופת ניסיון חינם' : 'Start Free Trial'}
                <Arrow className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="heroOutline" size="xl">
                {language === 'he' ? 'קבעו הדגמה' : 'Schedule Demo'}
              </Button>
            </Link>
          </div>

          <p className="text-sm text-muted-foreground mt-6">
            {language === 'he'
              ? 'ללא צורך בכרטיס אשראי • התחילו תוך דקות'
              : 'No credit card required • Get started in minutes'}
          </p>
        </div>
      </div>
    </section>
  );
}
