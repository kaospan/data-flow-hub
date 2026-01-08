import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Eye, 
  Shield, 
  ClipboardCheck, 
  AlertCircle,
  FileSpreadsheet, 
  Image, 
  Video, 
  Link2, 
  FileText,
  UserCheck,
  BarChart3,
  Clock
} from 'lucide-react';

export function FeaturesSection() {
  const { language } = useLanguage();

  const content = {
    he: {
      sectionTitle: 'למה עסקים בוחרים בנו',
      sectionSubtitle: 'כי התעלמות מהבעיה הרגישה כבר לא אחראית',
      features: [
        {
          icon: Eye,
          title: 'ראו מה פספסתם',
          description: 'הצגת נתונים לא מעובדים, קבצים שנשכחו, ותהליכים שנתקעו - לפני שזה הופך לבעיה.',
          color: 'text-warning',
          bgColor: 'bg-warning/10',
        },
        {
          icon: UserCheck,
          title: 'מומחה בתוך התהליך',
          description: 'כל חילוץ AI ניתן לבדיקה ואישור על ידי מומחה - עם תיעוד מי אישר ומתי.',
          color: 'text-success',
          bgColor: 'bg-success/10',
        },
        {
          icon: Shield,
          title: 'עקבות ביקורת מלאות',
          description: 'כל שלב מתועד: קלט גולמי, פלט AI, תיקונים אנושיים. מוכן לכל ביקורת.',
          color: 'text-info',
          bgColor: 'bg-info/10',
        },
        {
          icon: BarChart3,
          title: 'AI שניתן לניטור',
          description: 'עקבו אחר ביצועי AI לאורך זמן - ציוני ביטחון, שיעורי תיקון, חריגות.',
          color: 'text-primary',
          bgColor: 'bg-primary/10',
        },
      ],
      painPoints: {
        title: 'אנשים לא משלמים על תכונות. הם משלמים על הקלה.',
        points: [
          { icon: Clock, text: 'שעות שנבזבזו על ניקוי Excel ידני' },
          { icon: AlertCircle, text: 'שגיאות שמתגלות רק בביקורת' },
          { icon: ClipboardCheck, text: 'חוסר ודאות לגבי מה בתוך הנתונים' },
        ],
      },
      sourcesTitle: 'עובד עם כל סוג נתונים',
    },
    en: {
      sectionTitle: 'Why Businesses Choose Us',
      sectionSubtitle: 'Because ignoring the problem already feels irresponsible',
      features: [
        {
          icon: Eye,
          title: 'See What You\'re Missing',
          description: 'Surface unprocessed data, forgotten files, stuck workflows - before they become problems.',
          color: 'text-warning',
          bgColor: 'bg-warning/10',
        },
        {
          icon: UserCheck,
          title: 'Expert in the Loop',
          description: 'Every AI extraction can be reviewed and approved by a human - with logs of who approved what, when.',
          color: 'text-success',
          bgColor: 'bg-success/10',
        },
        {
          icon: Shield,
          title: 'Complete Audit Trail',
          description: 'Every step documented: raw input, AI output, human corrections. Ready for any audit.',
          color: 'text-info',
          bgColor: 'bg-info/10',
        },
        {
          icon: BarChart3,
          title: 'AI You Can Monitor',
          description: 'Track AI performance over time - confidence scores, correction rates, anomalies.',
          color: 'text-primary',
          bgColor: 'bg-primary/10',
        },
      ],
      painPoints: {
        title: 'People don\'t pay for features. They pay for relief.',
        points: [
          { icon: Clock, text: 'Hours wasted on manual Excel cleanup' },
          { icon: AlertCircle, text: 'Errors discovered only during audits' },
          { icon: ClipboardCheck, text: 'Uncertainty about what\'s in the data' },
        ],
      },
      sourcesTitle: 'Works with any data type',
    },
  };

  const t = content[language];

  const sourceTypes = [
    { icon: FileSpreadsheet, label: 'Excel / CSV' },
    { icon: Image, label: language === 'he' ? 'תמונות / OCR' : 'Images / OCR' },
    { icon: Video, label: language === 'he' ? 'וידאו / תמלול' : 'Video / Audio' },
    { icon: Link2, label: 'API' },
    { icon: FileText, label: 'PDF / Docs' },
  ];

  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            {t.sectionTitle}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t.sectionSubtitle}
          </p>
        </div>

        {/* Pain Points - The fear before the relief */}
        <div className="glass-card p-8 mb-16 max-w-4xl mx-auto">
          <h3 className="text-xl font-semibold mb-6 text-center">{t.painPoints.title}</h3>
          <div className="flex flex-wrap justify-center gap-6">
            {t.painPoints.points.map((point, index) => (
              <div key={index} className="flex items-center gap-3 px-4 py-2 rounded-lg bg-destructive/5 border border-destructive/10">
                <point.icon className="w-5 h-5 text-destructive" />
                <span className="text-sm">{point.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {t.features.map((feature, index) => (
            <div
              key={index}
              className="glass-card-hover p-6 group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`w-14 h-14 rounded-xl ${feature.bgColor} flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                <feature.icon className={`w-7 h-7 ${feature.color}`} />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Source Types */}
        <div className="glass-card p-8 md:p-12">
          <h3 className="text-xl font-semibold mb-8 text-center">
            {t.sourcesTitle}
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            {sourceTypes.map((source) => (
              <div
                key={source.label}
                className="flex items-center gap-3 px-6 py-3 rounded-xl bg-secondary/50 border border-border/50 hover:border-primary/30 transition-colors"
              >
                <source.icon className="w-5 h-5 text-primary" />
                <span className="font-medium">{source.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}