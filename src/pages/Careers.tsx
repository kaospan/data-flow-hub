import { Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Briefcase, Heart, Coffee, Laptop } from 'lucide-react';

const perks = [
  { icon: Laptop, title: { he: 'עבודה היברידית', en: 'Hybrid Work' }, desc: { he: 'גמישות מלאה', en: 'Full flexibility' } },
  { icon: Heart, title: { he: 'ביטוח בריאות', en: 'Health Insurance' }, desc: { he: 'כיסוי מקיף', en: 'Comprehensive coverage' } },
  { icon: Coffee, title: { he: 'משרד מגניב', en: 'Cool Office' }, desc: { he: 'תל אביב, רוטשילד', en: 'Tel Aviv, Rothschild' } },
  { icon: Briefcase, title: { he: 'ציוד מתקדם', en: 'Top Equipment' }, desc: { he: 'MacBook Pro לכולם', en: 'MacBook Pro for everyone' } },
];

const positions = [
  {
    title: { he: 'מהנדס/ת Full-Stack', en: 'Full-Stack Engineer' },
    type: { he: 'משרה מלאה', en: 'Full-time' },
    location: { he: 'תל אביב / היברידי', en: 'Tel Aviv / Hybrid' },
  },
  {
    title: { he: 'מדען/ית נתונים', en: 'Data Scientist' },
    type: { he: 'משרה מלאה', en: 'Full-time' },
    location: { he: 'תל אביב / היברידי', en: 'Tel Aviv / Hybrid' },
  },
  {
    title: { he: 'מנהל/ת מוצר', en: 'Product Manager' },
    type: { he: 'משרה מלאה', en: 'Full-time' },
    location: { he: 'תל אביב', en: 'Tel Aviv' },
  },
  {
    title: { he: 'נציג/ת הצלחת לקוח', en: 'Customer Success Rep' },
    type: { he: 'משרה מלאה', en: 'Full-time' },
    location: { he: 'תל אביב / היברידי', en: 'Tel Aviv / Hybrid' },
  },
];

export default function Careers() {
  const { language } = useLanguage();
  const Arrow = language === 'he' ? ArrowLeft : ArrowRight;

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
                  {language === 'he' ? 'הצטרפו לצוות' : 'Join Our Team'}
                </span>
              </h1>
              <p className="text-xl text-muted-foreground">
                {language === 'he'
                  ? 'בונים את עתיד ניהול הנתונים בישראל'
                  : 'Building the future of data management in Israel'}
              </p>
            </div>
          </div>
        </section>

        {/* Perks */}
        <section className="py-24 bg-secondary/20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              {language === 'he' ? 'למה לעבוד אצלנו?' : 'Why Work With Us?'}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {perks.map((perk) => (
                <div key={perk.title.en} className="glass-card p-6 text-center">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <perk.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-1">{perk.title[language]}</h3>
                  <p className="text-sm text-muted-foreground">{perk.desc[language]}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Open Positions */}
        <section className="py-24">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl font-bold text-center mb-12">
              {language === 'he' ? 'משרות פתוחות' : 'Open Positions'}
            </h2>
            <div className="space-y-4">
              {positions.map((position) => (
                <div key={position.title.en} className="glass-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-primary/30 transition-colors">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">{position.title[language]}</h3>
                    <p className="text-sm text-muted-foreground">
                      {position.type[language]} • {position.location[language]}
                    </p>
                  </div>
                  <Link to="/contact">
                    <Button variant="outline" size="sm">
                      {language === 'he' ? 'הגש מועמדות' : 'Apply'}
                      <Arrow className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <p className="text-muted-foreground mb-4">
                {language === 'he'
                  ? 'לא מצאתם משרה מתאימה? שלחו לנו קורות חיים'
                  : "Didn't find a matching position? Send us your resume"}
              </p>
              <Link to="/contact">
                <Button variant="hero">
                  {language === 'he' ? 'צרו קשר' : 'Contact Us'}
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
