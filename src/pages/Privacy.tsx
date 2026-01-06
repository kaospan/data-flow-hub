import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { Shield } from 'lucide-react';

export default function Privacy() {
  const { language } = useLanguage();

  const content = {
    he: {
      title: 'מדיניות פרטיות',
      lastUpdated: 'עודכן לאחרונה: ינואר 2026',
      sections: [
        {
          title: 'מידע שאנחנו אוספים',
          content: 'אנחנו אוספים מידע שאתם מספקים לנו ישירות, כגון פרטי יצירת חשבון, מידע תשלום, ונתונים שאתם מעלים לפלטפורמה. אנחנו גם אוספים מידע טכני אוטומטית, כולל כתובות IP, סוג הדפדפן, ומידע על השימוש בשירות.',
        },
        {
          title: 'כיצד אנחנו משתמשים במידע',
          content: 'המידע משמש אותנו לספק ולשפר את השירות, לעבד תשלומים, לתקשר איתכם בנוגע לחשבון שלכם, ולספק תמיכת לקוחות. אנחנו לא מוכרים את המידע האישי שלכם לצדדים שלישיים.',
        },
        {
          title: 'אבטחת מידע',
          content: 'אנחנו מיישמים אמצעי אבטחה מתקדמים להגנה על המידע שלכם, כולל הצפנה בזמן העברה ובזמן אחסון, בקרות גישה מחמירות, וניטור רציף של המערכות שלנו.',
        },
        {
          title: 'שמירת נתונים',
          content: 'אנחנו שומרים את המידע שלכם כל עוד החשבון שלכם פעיל או כנדרש לספק לכם שירותים. תוכלו לבקש מחיקת הנתונים שלכם בכל עת.',
        },
        {
          title: 'הזכויות שלכם',
          content: 'יש לכם זכות לגשת, לתקן, או למחוק את המידע האישי שלכם. תוכלו גם לבקש העברת הנתונים או להתנגד לעיבוד מסוים. צרו איתנו קשר למימוש הזכויות האלה.',
        },
        {
          title: 'עוגיות (Cookies)',
          content: 'אנחנו משתמשים בעוגיות לשיפור חוויית המשתמש ולניתוח שימוש. תוכלו לנהל את העדפות העוגיות בהגדרות הדפדפן שלכם.',
        },
        {
          title: 'יצירת קשר',
          content: 'לשאלות בנוגע למדיניות הפרטיות, צרו קשר בכתובת privacy@dataflow.co.il',
        },
      ],
    },
    en: {
      title: 'Privacy Policy',
      lastUpdated: 'Last updated: January 2026',
      sections: [
        {
          title: 'Information We Collect',
          content: 'We collect information you provide directly, such as account creation details, payment information, and data you upload to the platform. We also automatically collect technical information, including IP addresses, browser type, and service usage information.',
        },
        {
          title: 'How We Use Information',
          content: 'We use information to provide and improve the service, process payments, communicate with you about your account, and provide customer support. We do not sell your personal information to third parties.',
        },
        {
          title: 'Data Security',
          content: 'We implement advanced security measures to protect your information, including encryption in transit and at rest, strict access controls, and continuous monitoring of our systems.',
        },
        {
          title: 'Data Retention',
          content: 'We retain your information as long as your account is active or as needed to provide services. You can request deletion of your data at any time.',
        },
        {
          title: 'Your Rights',
          content: 'You have the right to access, correct, or delete your personal information. You can also request data portability or object to certain processing. Contact us to exercise these rights.',
        },
        {
          title: 'Cookies',
          content: 'We use cookies to improve user experience and analyze usage. You can manage cookie preferences in your browser settings.',
        },
        {
          title: 'Contact Us',
          content: 'For questions about this privacy policy, contact us at privacy@dataflow.co.il',
        },
      ],
    },
  };

  const c = content[language];

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
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                <span className="gradient-text">{c.title}</span>
              </h1>
              <p className="text-muted-foreground">{c.lastUpdated}</p>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-24">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="glass-card p-8 md:p-12 space-y-8">
              {c.sections.map((section, index) => (
                <div key={index}>
                  <h2 className="text-xl font-bold mb-3">{section.title}</h2>
                  <p className="text-muted-foreground leading-relaxed">{section.content}</p>
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
