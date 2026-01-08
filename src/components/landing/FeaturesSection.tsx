import { useLanguage } from '@/contexts/LanguageContext';
import { 
  FileSpreadsheet, 
  Image, 
  Video, 
  Link2, 
  FileText,
  Upload,
  Cpu,
  Zap,
  Download
} from 'lucide-react';

export function FeaturesSection() {
  const { language } = useLanguage();

  const content = {
    he: {
      sectionTitle: 'הכל במקום אחד',
      sectionSubtitle: 'פלטפורמה מלאה לקליטה, עיבוד וייצוא נתונים',
      features: [
        {
          icon: Upload,
          title: 'קליטת נתונים',
          description: 'העלו קבצים מכל סוג - Excel, CSV, תמונות, PDF ועוד. זיהוי אוטומטי של מבנה.',
          color: 'text-primary',
          bgColor: 'bg-primary/10',
        },
        {
          icon: Cpu,
          title: 'עיבוד AI חכם',
          description: 'חילוץ אוטומטי של מידע מתמונות (OCR), מסמכים ווידאו עם דיוק גבוה.',
          color: 'text-info',
          bgColor: 'bg-info/10',
        },
        {
          icon: Zap,
          title: 'אוטומציה',
          description: 'הגדירו כללים והפעלות אוטומטיות - עיבוד מיידי או מתוזמן.',
          color: 'text-warning',
          bgColor: 'bg-warning/10',
        },
        {
          icon: Download,
          title: 'ייצוא וחיבורים',
          description: 'ייצוא לקבצים, שליחה ל-Webhooks או חיבור ל-API שלכם.',
          color: 'text-success',
          bgColor: 'bg-success/10',
        },
      ],
      sourcesTitle: 'עובד עם כל סוג קובץ',
    },
    en: {
      sectionTitle: 'All in One Place',
      sectionSubtitle: 'Complete platform for data ingestion, processing, and export',
      features: [
        {
          icon: Upload,
          title: 'Data Ingestion',
          description: 'Upload any file type - Excel, CSV, images, PDF and more. Automatic structure detection.',
          color: 'text-primary',
          bgColor: 'bg-primary/10',
        },
        {
          icon: Cpu,
          title: 'Smart AI Processing',
          description: 'Automatic extraction from images (OCR), documents and video with high accuracy.',
          color: 'text-info',
          bgColor: 'bg-info/10',
        },
        {
          icon: Zap,
          title: 'Automation',
          description: 'Set up rules and automatic triggers - instant or scheduled processing.',
          color: 'text-warning',
          bgColor: 'bg-warning/10',
        },
        {
          icon: Download,
          title: 'Export & Integrations',
          description: 'Export to files, send to Webhooks, or connect to your API.',
          color: 'text-success',
          bgColor: 'bg-success/10',
        },
      ],
      sourcesTitle: 'Works with any file type',
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
