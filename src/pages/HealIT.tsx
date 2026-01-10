import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { HealITHeader } from '@/components/healit/HealITHeader';
import { HealITFooter } from '@/components/healit/HealITFooter';
import { 
  ArrowLeft, 
  ArrowRight, 
  Shield, 
  Eye, 
  UserCheck, 
  Clock, 
  AlertCircle, 
  CheckCircle,
  AlertTriangle,
  FileText,
  Stethoscope,
  Bell,
  Users,
  Heart,
  Activity,
  Sparkles,
  Brain,
  Target,
  XCircle,
  RefreshCw,
  Lightbulb,
  MessageCircle,
  ShieldCheck,
  Zap,
  ListChecks,
  Timer,
  UserX,
  Workflow,
  CircleDot
} from 'lucide-react';

export default function HealIT() {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const Arrow = language === 'he' ? ArrowLeft : ArrowRight;

  const content = {
    he: {
      badge: 'עוזר AI קליני',
      heroTitle: 'עוזר שלא מאבחן',
      heroHighlight: 'אבל כן מציל מהרגעים שבין השורות',
      heroSubtitle: 'יש רגעים ברפואה שבהם הכול "נעשה נכון" — ובכל זאת משהו משתבש. הבדיקה נשלחה. ההפניה יצאה. ההמלצה נכתבה יפה. ואז מגיע החלק שבו רוב המערכות מתפטרות מהחיים: אחרי שהרופא סיים להקליד.',
      cta: 'התחילו בחינם',
      secondary: 'קבעו הדגמה',
      
      problemSection: {
        title: 'רפואה אמיתית לא נגמרת בהחלטה. היא מתחילה שם.',
        subtitle: 'ומה שמפיל מערכות זה לא החלטות גרועות. זה יישום לא עקבי, מעקב שנשכח, וזמן שעובר בלי שאף אחד שם לב.',
        items: [
          { icon: Clock, text: 'שישה ימים עברו — ואין תור' },
          { icon: FileText, text: 'שבועיים עברו — ואין פענוח' },
          { icon: AlertTriangle, text: 'חודש עבר — ואין ביקורת' },
        ],
        footer: 'אין פה "באג" שמצלצל. יש פה חוסר תנועה.',
      },
      
      solutionIntro: {
        title: 'כאן נכנס עוזר מבוסס בינה מלאכותית',
        subtitle: 'לא כתחליף לרופא, לא כ"דוקטור רובוט", ולא כמכונה שמחלקת אבחנות — אלא כמשהו הרבה פחות סקסי והרבה יותר חשוב:',
        highlight: 'שומר סף של מעקב',
        description: 'הוא לא אומר מה יש למטופל. הוא שואל: מה אמרת שצריך לקרות עכשיו — והאם זה באמת קרה?',
      },
      
      whatItDoes: {
        title: 'מה העוזר כן עושה',
        subtitle: 'תחשוב על הקליניקה כמפעל קטן שמייצר החלטות. החלטות הן קלות. המורכב הוא "המסירה" — לוודא שההחלטות פוגשות מציאות.',
        items: [
          {
            icon: Workflow,
            title: 'קורא הוראות כרצף, לא כטקסט',
            description: '"הפניה לקרדיולוג" זה לא שורה. זה התחייבות תהליכית.',
            details: 'נשלחה הפניה → צריך תור → צריך ביקור → צריך תוצאה/סיכום → צריך החלטה חוזרת.',
          },
          {
            icon: Eye,
            title: 'מזהה "אי־אירועים"',
            description: 'האירוע הכי מסוכן ברפואה הוא לא טעות דרמטית. הוא שקט.',
            details: 'הדבר הזה אמור היה לקרות. הוא לא קרה.',
          },
          {
            icon: Target,
            title: 'יודע למי להציק, ומתי להפסיק',
            description: 'מנתב משימות לפי תפקידים: לרופא, לאחות, למזכירות, לתיאום תורים, למטופל.',
            details: 'ובדיוק כמו אדם אחראי, הוא גם יודע לרדת מהנושא כשהמשימה הושלמה.',
          },
        ],
      },
      
      whatItDoesNot: {
        title: 'מה העוזר לא עושה',
        subtitle: 'כי זה חשוב יותר ממה שהוא כן עושה',
        items: [
          { icon: XCircle, text: 'הוא לא מאבחן' },
          { icon: XCircle, text: 'הוא לא "קובע"' },
          { icon: XCircle, text: 'הוא לא משחק אותה סמכות רפואית' },
        ],
        example: {
          wrong: '"זה כנראה דלקת ריאות."',
          right: '"הייתה הוראה לצילום, עבר זמן, אין תוצאה מתועדת — האם צריך לבדוק סטטוס?"',
        },
        conclusion: 'הוא לא נוגע בשיקול הדעת. הוא נוגע בעקביות. וזה בדיוק המקום שבו בינה מלאכותית יכולה להיות לא מפחידה, אלא מרגיעה: היא לא מתחרה ברופא — היא מגינה עליו מפני העומס.',
      },
      
      whyItWorks: {
        title: 'למה זה עובד בעולם האמיתי',
        subtitle: 'ולא רק במצגות',
        description: 'בכל קליניקה יש "איש/אשת קסם" שמחזיקים הכול בראש: מי צריך לחזור למי, מי לא קבע תור, מי מחכה לתוצאה, מי צריך עוד הפניה, מי כועס, מי נעלם.',
        problem: 'ואז אותו אדם יוצא לחופשה, חולה, או פשוט נשבר.',
        highlight: 'מערכת שמבוססת על זיכרון אנושי היא מערכת שמבקשת להיכשל.',
        solution: 'העוזר עושה משהו צנוע: הוא מפסיק לדרוש מהאדם להיות מחשב.',
      },
      
      adhdSection: {
        title: 'אותו עיקרון בדיוק: ADHD וארגון חיים',
        intro: 'אם אתה מכיר ADHD מקרוב, אתה כבר יודע את האמת המביכה: הבעיה היא לא אינטליגנציה. הבעיה היא ביצוע עקבי של דברים קטנים בזמן הנכון.',
        problems: [
          'לשלם בזמן',
          'לזכור להתקשר',
          'לקבוע',
          'לשלוח',
          'לעקוב',
          'לסגור קצוות',
          'לא לאבד את הפעולה הבאה בתוך 17 טאבים פתוחים בראש',
        ],
        insight: 'הרבה "מיקרו־משימות" שכולן קריטיות, אבל אף אחת לא מרגישה דחופה ברגע הזה.',
        solutions: [
          {
            icon: RefreshCw,
            title: 'לתרגם כוונות לפעולות',
            description: '"אני חייב לקבוע תור לרופא שיניים" → פעולה + דדליין + תזכורת + מסלול ביצוע.',
          },
          {
            icon: Zap,
            title: 'לצמצם חיכוך',
            description: 'אם כל משימה דורשת 12 שלבים, היא לא תקרה. העוזר מציע את "השלב הבא הכי קטן".',
          },
          {
            icon: ListChecks,
            title: 'לסגור לולאות',
            description: 'ADHD זה הרבה פעמים לולאות פתוחות שמייצרות אשמה. העוזר שואל: מה נשאר פתוח?',
          },
        ],
      },
      
      connection: {
        title: 'רפואה ו-ADHD זה אותו סיפור — רק עם סיכון אחר',
        cards: [
          { context: 'ברפואה', impact: 'חוסר ארגון עולה בבריאות' },
          { context: 'ב-ADHD', impact: 'חוסר ארגון עולה בחיים' },
        ],
        insight: 'בשני המקרים, הבעיה היא לא שאנשים לא יודעים מה נכון. הבעיה היא שהמערכת לא בנויה לבצע את זה בהתמדה.',
        misconceptions: [
          '"הוא לא רציני."',
          '"היא לא אחראית."',
          '"הוא לא משתף פעולה."',
        ],
        truth: 'הם פשוט בני אדם בתוך מערכת שלא מכבדת את המגבלות האנושיות.',
      },
      
      bottomLine: {
        title: 'השורה התחתונה',
        points: [
          'בינה מלאכותית לא צריכה להיות רופא כדי לשפר רפואה.',
          'היא צריכה להיות זיכרון חיצוני עם טקט.',
          'היא לא מחליפה החלטה קלינית.',
          'היא שומרת שהחלטה קלינית לא תתאדה בין ימים, משמרות, הודעות, וחיים.',
        ],
        tagline: 'פחות קסם. יותר מעקב. וזה בדיוק מה שמציל.',
      },
      
      cta2: {
        title: 'מוכנים לעזור למערכת שלכם לזכור?',
        button: 'התחילו תקופת ניסיון חינם',
        secondary: 'קבעו הדגמה',
        footer: 'ללא כרטיס אשראי • התחלה תוך דקות • ביטול בכל עת',
      },
    },
    en: {
      badge: 'Clinical AI Assistant',
      heroTitle: "An Assistant That Doesn't Diagnose",
      heroHighlight: 'But Saves You from the Moments Between the Lines',
      heroSubtitle: 'There are moments in medicine when everything is "done right" — and yet something goes wrong. The test was sent. The referral was made. The recommendation was written beautifully. Then comes the part where most systems check out: after the doctor finishes typing.',
      cta: 'Start Free Trial',
      secondary: 'Schedule Demo',
      
      problemSection: {
        title: "Real medicine doesn't end with a decision. It starts there.",
        subtitle: "What brings systems down isn't bad decisions. It's inconsistent implementation, forgotten follow-ups, and time passing without anyone noticing.",
        items: [
          { icon: Clock, text: 'Six days passed — no appointment scheduled' },
          { icon: FileText, text: 'Two weeks passed — no results interpreted' },
          { icon: AlertTriangle, text: 'A month passed — no review done' },
        ],
        footer: 'No alarm bells. Just stillness.',
      },
      
      solutionIntro: {
        title: 'Enter an AI-powered assistant',
        subtitle: 'Not as a substitute for a doctor, not as a "robot doctor," not as a machine dispensing diagnoses — but as something far less glamorous and far more important:',
        highlight: 'A follow-up gatekeeper',
        description: "It doesn't tell you what the patient has. It asks: what did you say needs to happen now — and did it actually happen?",
      },
      
      whatItDoes: {
        title: 'What the Assistant Actually Does',
        subtitle: 'Think of the clinic as a small factory producing decisions. Decisions are easy. The hard part is "delivery" — ensuring decisions meet reality.',
        items: [
          {
            icon: Workflow,
            title: 'Reads instructions as sequences, not text',
            description: '"Referral to cardiologist" isn\'t a line. It\'s a process commitment.',
            details: 'Referral sent → appointment needed → visit → result/summary → follow-up decision.',
          },
          {
            icon: Eye,
            title: 'Identifies "non-events"',
            description: "The most dangerous event in medicine isn't a dramatic mistake. It's silence.",
            details: "This was supposed to happen. It didn't.",
          },
          {
            icon: Target,
            title: 'Knows who to nudge, and when to stop',
            description: 'Routes tasks by role: to the doctor, nurse, secretary, scheduling, patient.',
            details: "And like a responsible person, it also knows when to drop the subject once the task is complete.",
          },
        ],
      },
      
      whatItDoesNot: {
        title: "What the Assistant Doesn't Do",
        subtitle: "Because this is more important than what it does",
        items: [
          { icon: XCircle, text: "It doesn't diagnose" },
          { icon: XCircle, text: 'It doesn\'t "decide"' },
          { icon: XCircle, text: "It doesn't pretend to be a medical authority" },
        ],
        example: {
          wrong: '"It\'s probably pneumonia."',
          right: '"There was an order for an X-ray, time has passed, no documented result — should we check status?"',
        },
        conclusion: "It doesn't touch clinical judgment. It touches consistency. And that's exactly where AI can be not scary, but reassuring: it doesn't compete with the doctor — it protects them from overload.",
      },
      
      whyItWorks: {
        title: 'Why This Works in the Real World',
        subtitle: 'Not just in presentations',
        description: 'Every clinic has a "magic person" who keeps everything in their head: who needs to follow up with whom, who didn\'t schedule an appointment, who\'s waiting for results, who needs another referral, who\'s angry, who disappeared.',
        problem: 'Then that person goes on vacation, gets sick, or simply burns out.',
        highlight: 'A system based on human memory is a system asking to fail.',
        solution: "The assistant does something modest: it stops demanding that humans be computers.",
      },
      
      adhdSection: {
        title: 'The Same Principle: ADHD and Life Organization',
        intro: "If you know ADHD up close, you already know the embarrassing truth: the problem isn't intelligence. The problem is consistent execution of small things at the right time.",
        problems: [
          'Pay on time',
          'Remember to call',
          'Schedule',
          'Send',
          'Follow up',
          'Close loops',
          "Not lose the next action among 17 open tabs in your head",
        ],
        insight: 'Many "micro-tasks" that are all critical, but none feel urgent right now.',
        solutions: [
          {
            icon: RefreshCw,
            title: 'Translate intentions to actions',
            description: '"I need to schedule a dentist appointment" → action + deadline + reminder + execution path.',
          },
          {
            icon: Zap,
            title: 'Reduce friction',
            description: "If every task requires 12 steps, it won't happen. The assistant suggests the smallest next step.",
          },
          {
            icon: ListChecks,
            title: 'Close loops',
            description: 'ADHD often means open loops generating guilt. The assistant asks: what\'s left open?',
          },
        ],
      },
      
      connection: {
        title: "Medicine and ADHD Are the Same Story — Just Different Stakes",
        cards: [
          { context: 'In medicine', impact: 'disorganization costs health' },
          { context: 'In ADHD', impact: 'disorganization costs life' },
        ],
        insight: "In both cases, the problem isn't that people don't know what's right. The problem is the system isn't built to execute it consistently.",
        misconceptions: [
          '"He\'s not serious."',
          '"She\'s not responsible."',
          '"He\'s not cooperating."',
        ],
        truth: "They're just humans inside a system that doesn't respect human limitations.",
      },
      
      bottomLine: {
        title: 'The Bottom Line',
        points: [
          "AI doesn't need to be a doctor to improve medicine.",
          'It needs to be an external memory with tact.',
          "It doesn't replace clinical decisions.",
          "It ensures clinical decisions don't evaporate between days, shifts, messages, and life.",
        ],
        tagline: "Less magic. More follow-through. And that's exactly what saves.",
      },
      
      cta2: {
        title: 'Ready to help your system remember?',
        button: 'Start Free Trial',
        secondary: 'Schedule Demo',
        footer: 'No credit card required • Start in minutes • Cancel anytime',
      },
    },
  };

  const t = content[language];

  return (
    <div className={`healit-page min-h-screen flex flex-col ${theme}`}>
      <HealITHeader />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-teal-50/30 to-cyan-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-teal-950/20" />
        
        <div className="absolute top-1/4 left-[5%] w-96 h-96 rounded-full bg-teal-200/20 dark:bg-teal-500/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-[5%] w-80 h-80 rounded-full bg-cyan-200/20 dark:bg-cyan-500/5 blur-3xl" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-teal-200 dark:border-teal-700/50 shadow-lg shadow-teal-500/10 mb-10">
              <Brain className="w-5 h-5 text-teal-500" />
              <span className="font-semibold text-teal-700 dark:text-teal-300">{t.badge}</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight text-slate-800 dark:text-white">
              {t.heroTitle}
            </h1>
            <p className="text-2xl md:text-3xl lg:text-4xl font-bold mb-8 healit-gradient-text">
              {t.heroHighlight}
            </p>

            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              {t.heroSubtitle}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/signup">
                <Button className="healit-btn-primary text-lg px-8 py-6 h-auto">
                  {t.cta}
                  <Arrow className="w-5 h-5 ms-2" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button 
                  variant="outline" 
                  className="text-lg px-8 py-6 h-auto border-2 border-teal-200 dark:border-teal-700 text-teal-700 dark:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-900/30"
                >
                  {t.secondary}
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-slate-950 to-transparent" />
      </section>

      {/* Problem Section */}
      <section className="py-24 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-800 dark:text-white">
              {t.problemSection.title}
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 mb-12">
              {t.problemSection.subtitle}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {t.problemSection.items.map((item, index) => (
                <div key={index} className="healit-card p-6 bg-gradient-to-br from-rose-50 to-orange-50 dark:from-rose-950/30 dark:to-orange-950/30 border-rose-200 dark:border-rose-800/30">
                  <div className="w-14 h-14 rounded-xl bg-rose-100 dark:bg-rose-900/50 flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-7 h-7 text-rose-500" />
                  </div>
                  <p className="font-medium text-slate-700 dark:text-slate-200">{item.text}</p>
                </div>
              ))}
            </div>

            <p className="text-lg italic text-slate-500 dark:text-slate-400">
              {t.problemSection.footer}
            </p>
          </div>
        </div>
      </section>

      {/* Solution Intro */}
      <section className="py-24 bg-gradient-to-b from-teal-50/50 to-white dark:from-slate-900 dark:to-slate-950">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-800 dark:text-white">
              {t.solutionIntro.title}
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 mb-8">
              {t.solutionIntro.subtitle}
            </p>
            
            <div className="healit-card p-8 mb-8 healit-glow">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-teal-500/25">
                <ShieldCheck className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4 healit-gradient-text">
                {t.solutionIntro.highlight}
              </h3>
              <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                {t.solutionIntro.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What It Does */}
      <section className="py-24 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-800 dark:text-white">
                {t.whatItDoes.title}
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
                {t.whatItDoes.subtitle}
              </p>
            </div>

            <div className="space-y-6">
              {t.whatItDoes.items.map((item, index) => (
                <div key={index} className="healit-card p-8 group">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center shrink-0 shadow-lg shadow-teal-500/20 group-hover:scale-110 transition-transform">
                      <item.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1 text-start">
                      <h3 className="text-xl font-bold mb-2 text-slate-800 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 mb-3">
                        {item.description}
                      </p>
                      <div className="px-4 py-3 rounded-lg bg-teal-50 dark:bg-teal-900/30 border border-teal-200 dark:border-teal-700/50">
                        <p className="text-sm font-medium text-teal-700 dark:text-teal-300">
                          {item.details}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What It Does NOT */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-800 dark:text-white">
                {t.whatItDoesNot.title}
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                {t.whatItDoesNot.subtitle}
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {t.whatItDoesNot.items.map((item, index) => (
                <div key={index} className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
                  <item.icon className="w-5 h-5 text-rose-500" />
                  <span className="font-medium text-slate-700 dark:text-slate-200">{item.text}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <div className="healit-card p-6 bg-gradient-to-br from-rose-50 to-rose-100/50 dark:from-rose-950/30 dark:to-rose-900/20 border-rose-200 dark:border-rose-800/30">
                <div className="flex items-center gap-3 mb-3">
                  <XCircle className="w-6 h-6 text-rose-500" />
                  <span className="font-bold text-rose-600 dark:text-rose-400">{language === 'he' ? 'הוא לא אומר:' : "It doesn't say:"}</span>
                </div>
                <p className="text-lg italic text-slate-600 dark:text-slate-300">{t.whatItDoesNot.example.wrong}</p>
              </div>
              <div className="healit-card p-6 bg-gradient-to-br from-teal-50 to-teal-100/50 dark:from-teal-950/30 dark:to-teal-900/20 border-teal-200 dark:border-teal-800/30">
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle className="w-6 h-6 text-teal-500" />
                  <span className="font-bold text-teal-600 dark:text-teal-400">{language === 'he' ? 'הוא אומר:' : 'It says:'}</span>
                </div>
                <p className="text-lg italic text-slate-600 dark:text-slate-300">{t.whatItDoesNot.example.right}</p>
              </div>
            </div>

            <div className="healit-card p-8 text-center healit-glow">
              <p className="text-lg text-slate-700 dark:text-slate-200 leading-relaxed">
                {t.whatItDoesNot.conclusion}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why It Works */}
      <section className="py-24 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-2 text-slate-800 dark:text-white">
                {t.whyItWorks.title}
              </h2>
              <p className="text-lg text-slate-500 dark:text-slate-400">
                {t.whyItWorks.subtitle}
              </p>
            </div>

            <div className="space-y-6">
              <div className="healit-card p-8">
                <p className="text-lg text-slate-600 dark:text-slate-300 mb-4">
                  {t.whyItWorks.description}
                </p>
                <p className="text-lg text-rose-600 dark:text-rose-400 font-medium">
                  {t.whyItWorks.problem}
                </p>
              </div>

              <div className="healit-card p-8 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-amber-200 dark:border-amber-800/30">
                <div className="flex items-center gap-4 mb-4">
                  <AlertTriangle className="w-8 h-8 text-amber-500" />
                  <p className="text-xl font-bold text-slate-800 dark:text-white">
                    {t.whyItWorks.highlight}
                  </p>
                </div>
              </div>

              <div className="healit-card p-8 healit-glow">
                <div className="flex items-center gap-4">
                  <Lightbulb className="w-8 h-8 text-teal-500 shrink-0" />
                  <p className="text-xl text-slate-700 dark:text-slate-200">
                    {t.whyItWorks.solution}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ADHD Section */}
      <section className="py-24 bg-gradient-to-b from-purple-50/50 to-white dark:from-purple-950/20 dark:to-slate-950">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-800 dark:text-white">
                {t.adhdSection.title}
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
                {t.adhdSection.intro}
              </p>
            </div>

            <div className="healit-card p-8 mb-12">
              <h3 className="text-lg font-bold mb-6 text-center text-slate-700 dark:text-slate-200">
                {language === 'he' ? 'ה-ADHD מתרסק על:' : 'ADHD crashes on:'}
              </h3>
              <div className="flex flex-wrap justify-center gap-3">
                {t.adhdSection.problems.map((problem, index) => (
                  <span key={index} className="px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm font-medium">
                    {problem}
                  </span>
                ))}
              </div>
              <p className="text-center mt-6 text-slate-500 dark:text-slate-400 italic">
                {t.adhdSection.insight}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {t.adhdSection.solutions.map((solution, index) => (
                <div key={index} className="healit-card p-6 group">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center mb-5 shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform">
                    <solution.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-bold mb-3 text-slate-800 dark:text-white">
                    {solution.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    {solution.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Connection Section */}
      <section className="py-24 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-slate-800 dark:text-white">
              {t.connection.title}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {t.connection.cards.map((card, index) => (
                <div key={index} className="healit-card p-8 text-center">
                  <p className="text-lg font-medium text-slate-500 dark:text-slate-400 mb-2">{card.context}</p>
                  <p className="text-2xl font-bold text-slate-800 dark:text-white">{card.impact}</p>
                </div>
              ))}
            </div>

            <div className="healit-card p-8 mb-8">
              <p className="text-lg text-slate-600 dark:text-slate-300 mb-6 text-center">
                {t.connection.insight}
              </p>
              <div className="flex flex-wrap justify-center gap-3 mb-6">
                {t.connection.misconceptions.map((misconception, index) => (
                  <span key={index} className="px-4 py-2 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 text-sm font-medium line-through decoration-2">
                    {misconception}
                  </span>
                ))}
              </div>
              <p className="text-lg font-medium text-center text-teal-600 dark:text-teal-400">
                {t.connection.truth}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Line */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-slate-800 dark:text-white">
              {t.bottomLine.title}
            </h2>

            <div className="space-y-4 mb-12">
              {t.bottomLine.points.map((point, index) => (
                <div key={index} className="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm max-w-2xl mx-auto">
                  <CircleDot className="w-5 h-5 text-teal-500 shrink-0" />
                  <p className="text-lg text-slate-700 dark:text-slate-200 text-start">{point}</p>
                </div>
              ))}
            </div>

            <div className="healit-card p-10 healit-glow">
              <p className="text-2xl md:text-3xl font-bold healit-gradient-text">
                {t.bottomLine.tagline}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500 to-cyan-600" />
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M25 0h10v25h25v10H35v25H25V35H0V25h25V0z' fill='white' fill-opacity='0.3'/%3E%3C/svg%3E")`,
            backgroundSize: '80px 80px',
          }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm mb-8">
              <Heart className="w-10 h-10 text-white" />
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-10 text-white">
              {t.cta2.title}
            </h2>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <Link to="/signup">
                <Button className="text-lg px-8 py-6 h-auto bg-white text-teal-600 hover:bg-white/90 shadow-xl shadow-black/20">
                  {t.cta2.button}
                  <Arrow className="w-5 h-5 ms-2" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button 
                  variant="outline" 
                  className="text-lg px-8 py-6 h-auto border-2 border-white/50 text-white hover:bg-white/10"
                >
                  {t.cta2.secondary}
                </Button>
              </Link>
            </div>

            <p className="text-white/60 text-sm">
              {t.cta2.footer}
            </p>
          </div>
        </div>
      </section>

      <HealITFooter />
    </div>
  );
}
