import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { FileText } from 'lucide-react';

export default function Terms() {
  const { language } = useLanguage();

  const content = {
    he: {
      title: 'תנאי שימוש',
      lastUpdated: 'עודכן לאחרונה: ינואר 2026',
      sections: [
        {
          title: 'קבלת התנאים',
          content: 'בשימוש בשירות DataFlow, אתם מסכימים לתנאי שימוש אלה. אם אינכם מסכימים לתנאים, אנא הימנעו משימוש בשירות.',
        },
        {
          title: 'תיאור השירות',
          content: 'DataFlow מספקת פלטפורמה לניהול, עיבוד ואוטומציה של נתונים. השירות כולל אחסון נתונים, עיבוד מבוסס AI, יצירת אוטומציות, וכלים נוספים.',
        },
        {
          title: 'חשבון משתמש',
          content: 'אתם אחראים לשמור על סודיות פרטי הכניסה לחשבון ולכל הפעילות שמתבצעת תחת החשבון שלכם. עליכם להודיע לנו מיד על כל שימוש לא מורשה.',
        },
        {
          title: 'שימוש מותר',
          content: 'אתם מתחייבים להשתמש בשירות רק למטרות חוקיות ובהתאם לכל החוקים והתקנות הרלוונטיים. אסור להשתמש בשירות להעלאת תוכן לא חוקי או מזיק.',
        },
        {
          title: 'קניין רוחני',
          content: 'כל הזכויות בשירות, כולל תוכנה, עיצוב ותוכן, שייכות ל-DataFlow. הנתונים שאתם מעלים נשארים בבעלותכם.',
        },
        {
          title: 'תשלומים',
          content: 'התשלום עבור שירותים בתשלום יבוצע בהתאם לתוכנית שנבחרה. אנו שומרים על הזכות לשנות מחירים עם הודעה מראש של 30 יום.',
        },
        {
          title: 'הגבלת אחריות',
          content: 'השירות מסופק "כמות שהוא". DataFlow לא תהיה אחראית לנזקים עקיפים, מיוחדים, או תוצאתיים הנובעים משימוש בשירות.',
        },
        {
          title: 'ביטול וסיום',
          content: 'תוכלו לבטל את החשבון שלכם בכל עת. אנו עשויים להשעות או לסיים את הגישה שלכם אם תפרו תנאים אלה.',
        },
        {
          title: 'שינויים בתנאים',
          content: 'אנו עשויים לעדכן תנאים אלה מעת לעת. שינויים משמעותיים יודיעו באמצעות הודעה בשירות או באימייל.',
        },
        {
          title: 'יצירת קשר',
          content: 'לשאלות בנוגע לתנאי השימוש, צרו קשר בכתובת legal@dataflow.co.il',
        },
      ],
    },
    en: {
      title: 'Terms of Service',
      lastUpdated: 'Last updated: January 2026',
      sections: [
        {
          title: 'Acceptance of Terms',
          content: 'By using the DataFlow service, you agree to these terms of service. If you do not agree to these terms, please refrain from using the service.',
        },
        {
          title: 'Service Description',
          content: 'DataFlow provides a platform for data management, processing, and automation. The service includes data storage, AI-based processing, automation creation, and additional tools.',
        },
        {
          title: 'User Account',
          content: 'You are responsible for maintaining the confidentiality of your login credentials and all activity under your account. You must notify us immediately of any unauthorized use.',
        },
        {
          title: 'Permitted Use',
          content: 'You agree to use the service only for lawful purposes and in accordance with all relevant laws and regulations. It is forbidden to use the service to upload illegal or harmful content.',
        },
        {
          title: 'Intellectual Property',
          content: 'All rights in the service, including software, design, and content, belong to DataFlow. The data you upload remains your property.',
        },
        {
          title: 'Payments',
          content: 'Payment for paid services will be made according to the selected plan. We reserve the right to change prices with 30 days advance notice.',
        },
        {
          title: 'Limitation of Liability',
          content: 'The service is provided "as is". DataFlow will not be liable for indirect, special, or consequential damages arising from use of the service.',
        },
        {
          title: 'Cancellation and Termination',
          content: 'You may cancel your account at any time. We may suspend or terminate your access if you violate these terms.',
        },
        {
          title: 'Changes to Terms',
          content: 'We may update these terms from time to time. Significant changes will be communicated via notice in the service or by email.',
        },
        {
          title: 'Contact Us',
          content: 'For questions about these terms of service, contact us at legal@dataflow.co.il',
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
                <FileText className="w-8 h-8 text-primary" />
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
