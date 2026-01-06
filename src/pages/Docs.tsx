import { Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { 
  Book, Rocket, Zap, Database, Upload, Bot, Share2, Shield,
  ArrowLeft, ArrowRight, ExternalLink
} from 'lucide-react';

const sections = [
  {
    icon: Rocket,
    title: { he: 'מדריך התחלה', en: 'Getting Started' },
    desc: { he: 'הצעדים הראשונים עם DataFlow', en: 'Your first steps with DataFlow' },
    articles: [
      { he: 'יצירת חשבון', en: 'Create an Account' },
      { he: 'חיבור מקור נתונים ראשון', en: 'Connect Your First Data Source' },
      { he: 'הגדרת אוטומציה בסיסית', en: 'Set Up a Basic Automation' },
    ],
  },
  {
    icon: Database,
    title: { he: 'מקורות נתונים', en: 'Data Sources' },
    desc: { he: 'כיצד לחבר ולנהל מקורות', en: 'How to connect and manage sources' },
    articles: [
      { he: 'העלאת קבצי Excel/CSV', en: 'Upload Excel/CSV Files' },
      { he: 'סריקת מסמכים עם OCR', en: 'Scan Documents with OCR' },
      { he: 'חיבור API חיצוני', en: 'Connect External API' },
    ],
  },
  {
    icon: Bot,
    title: { he: 'אוטומציות', en: 'Automations' },
    desc: { he: 'בניית תהליכים אוטומטיים', en: 'Build automated workflows' },
    articles: [
      { he: 'סוגי טריגרים', en: 'Trigger Types' },
      { he: 'פעולות זמינות', en: 'Available Actions' },
      { he: 'דוגמאות נפוצות', en: 'Common Examples' },
    ],
  },
  {
    icon: Shield,
    title: { he: 'אבטחה והרשאות', en: 'Security & Permissions' },
    desc: { he: 'ניהול משתמשים והגנה על נתונים', en: 'User management and data protection' },
    articles: [
      { he: 'הוספת חברי צוות', en: 'Add Team Members' },
      { he: 'הגדרת הרשאות', en: 'Set Up Permissions' },
      { he: 'יומני פעילות', en: 'Activity Logs' },
    ],
  },
];

export default function Docs() {
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
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6">
                <Book className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                <span className="gradient-text">
                  {language === 'he' ? 'מרכז התיעוד' : 'Documentation'}
                </span>
              </h1>
              <p className="text-xl text-muted-foreground">
                {language === 'he'
                  ? 'כל מה שצריך לדעת כדי להפיק את המקסימום מ-DataFlow'
                  : 'Everything you need to know to get the most out of DataFlow'}
              </p>
            </div>
          </div>
        </section>

        {/* Documentation Sections */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {sections.map((section) => (
                <div key={section.title.en} className="glass-card p-8 hover:border-primary/30 transition-colors">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <section.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold mb-1">{section.title[language]}</h2>
                      <p className="text-sm text-muted-foreground">{section.desc[language]}</p>
                    </div>
                  </div>
                  <ul className="space-y-3">
                    {section.articles.map((article, index) => (
                      <li key={index}>
                        <button className="w-full text-start flex items-center justify-between p-3 rounded-lg hover:bg-secondary/50 transition-colors group">
                          <span className="text-sm">{article[language]}</span>
                          <Arrow className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Help CTA */}
        <section className="py-24 bg-secondary/20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold mb-4">
              {language === 'he' ? 'צריכים עזרה נוספת?' : 'Need More Help?'}
            </h2>
            <p className="text-muted-foreground mb-6">
              {language === 'he'
                ? 'הצוות שלנו כאן לעזור'
                : 'Our team is here to help'}
            </p>
            <Link to="/contact">
              <Button variant="hero">
                {language === 'he' ? 'צרו קשר' : 'Contact Us'}
                <ExternalLink className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
