import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { Target, Heart, Rocket, Users } from 'lucide-react';

const values = [
  {
    icon: Target,
    title: { he: 'חזון', en: 'Vision' },
    desc: {
      he: 'להפוך כל עסק בישראל למונע נתונים עם כלים פשוטים וחכמים',
      en: 'To make every business in Israel data-driven with simple, smart tools',
    },
  },
  {
    icon: Heart,
    title: { he: 'ערכים', en: 'Values' },
    desc: {
      he: 'פשטות, שקיפות, ושירות לקוחות יוצא מן הכלל',
      en: 'Simplicity, transparency, and exceptional customer service',
    },
  },
  {
    icon: Rocket,
    title: { he: 'משימה', en: 'Mission' },
    desc: {
      he: 'לחסוך שעות עבודה ידנית ולאפשר לעסקים להתמקד במה שחשוב',
      en: 'To save hours of manual work and let businesses focus on what matters',
    },
  },
  {
    icon: Users,
    title: { he: 'צוות', en: 'Team' },
    desc: {
      he: 'צוות מנוסה של מהנדסים, מדעני נתונים ומומחי UX',
      en: 'An experienced team of engineers, data scientists, and UX experts',
    },
  },
];

const stats = [
  { value: '1,000+', label: { he: 'לקוחות פעילים', en: 'Active customers' } },
  { value: '5M+', label: { he: 'רשומות מעובדות', en: 'Records processed' } },
  { value: '99.9%', label: { he: 'זמינות', en: 'Uptime' } },
  { value: '24/7', label: { he: 'תמיכה', en: 'Support' } },
];

export default function About() {
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
                  {language === 'he' ? 'אודותינו' : 'About Us'}
                </span>
              </h1>
              <p className="text-xl text-muted-foreground">
                {language === 'he'
                  ? 'אנחנו DataFlow - חברת טכנולוגיה ישראלית שמשנה את הדרך שבה עסקים מנהלים נתונים'
                  : "We're DataFlow - an Israeli tech company changing how businesses manage data"}
              </p>
            </div>
          </div>
        </section>

        {/* Story */}
        <section className="py-24">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="glass-card p-8 md:p-12">
              <h2 className="text-3xl font-bold mb-6">
                {language === 'he' ? 'הסיפור שלנו' : 'Our Story'}
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  {language === 'he'
                    ? 'DataFlow נוסדה מתוך תסכול. ראינו עסקים ישראליים מבזבזים שעות על עבודה ידנית עם נתונים - העתקה מקובץ לקובץ, המרות ידניות, ודוחות שלוקחים ימים להכין.'
                    : 'DataFlow was born out of frustration. We saw Israeli businesses wasting hours on manual data work - copying between files, manual conversions, and reports that took days to prepare.'}
                </p>
                <p>
                  {language === 'he'
                    ? 'החלטנו לבנות משהו אחר. פלטפורמה שמבינה עברית, תומכת ב-RTL, ומתאימה לצורת העבודה הישראלית. היום, אלפי עסקים בישראל משתמשים ב-DataFlow כדי לחסוך זמן ולקבל החלטות טובות יותר.'
                    : 'We decided to build something different. A platform that understands Hebrew, supports RTL, and fits the Israeli way of working. Today, thousands of businesses in Israel use DataFlow to save time and make better decisions.'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-24 bg-secondary/20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              {language === 'he' ? 'מה מנחה אותנו' : 'What Guides Us'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {values.map((value) => (
                <div key={value.title.en} className="glass-card p-6 text-center">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{value.title[language]}</h3>
                  <p className="text-sm text-muted-foreground">{value.desc[language]}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {stats.map((stat) => (
                <div key={stat.value} className="text-center">
                  <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">{stat.value}</div>
                  <div className="text-muted-foreground">{stat.label[language]}</div>
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
