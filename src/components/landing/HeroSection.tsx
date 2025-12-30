import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Play, FileSpreadsheet, Image, Video, Zap, Database } from 'lucide-react';

export function HeroSection() {
  const { t, language } = useLanguage();
  const Arrow = language === 'he' ? ArrowLeft : ArrowRight;

  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-info/5 rounded-full blur-3xl animate-float" />
      
      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8 animate-fade-in">
            <Zap className="w-4 h-4" />
            <span>{language === 'he' ? 'מופעל על ידי AI' : 'Powered by AI'}</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <span className="gradient-text">{t('hero.title')}</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.2s' }}>
            {t('hero.subtitle')}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <Link to="/signup">
              <Button variant="hero" size="xl">
                {t('hero.cta')}
                <Arrow className="w-5 h-5" />
              </Button>
            </Link>
            <Button variant="heroOutline" size="xl">
              <Play className="w-5 h-5" />
              {t('hero.secondary')}
            </Button>
          </div>

          {/* Floating Icons */}
          <div className="relative h-48 md:h-64 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              {/* Center icon */}
              <div className="w-20 h-20 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-lg shadow-primary/30">
                <Database className="w-10 h-10 text-primary-foreground" />
              </div>
            </div>

            {/* Orbiting icons */}
            <div className="absolute left-1/4 top-1/4 glass-card p-4 rounded-xl animate-float" style={{ animationDelay: '0s' }}>
              <FileSpreadsheet className="w-8 h-8 text-success" />
            </div>
            <div className="absolute right-1/4 top-1/3 glass-card p-4 rounded-xl animate-float" style={{ animationDelay: '1s' }}>
              <Image className="w-8 h-8 text-info" />
            </div>
            <div className="absolute left-1/3 bottom-1/4 glass-card p-4 rounded-xl animate-float" style={{ animationDelay: '2s' }}>
              <Video className="w-8 h-8 text-warning" />
            </div>
            <div className="absolute right-1/3 bottom-1/3 glass-card p-4 rounded-xl animate-float" style={{ animationDelay: '0.5s' }}>
              <Zap className="w-8 h-8 text-primary" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
