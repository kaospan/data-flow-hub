import { useLanguage } from '@/contexts/LanguageContext';
import { FileSpreadsheet, Brain, Zap, Share2, Image, Video, Link2, FileText } from 'lucide-react';

const features = [
  {
    icon: FileSpreadsheet,
    titleKey: 'features.ingestion.title',
    descKey: 'features.ingestion.desc',
    color: 'text-success',
    bgColor: 'bg-success/10',
  },
  {
    icon: Brain,
    titleKey: 'features.processing.title',
    descKey: 'features.processing.desc',
    color: 'text-info',
    bgColor: 'bg-info/10',
  },
  {
    icon: Zap,
    titleKey: 'features.automation.title',
    descKey: 'features.automation.desc',
    color: 'text-warning',
    bgColor: 'bg-warning/10',
  },
  {
    icon: Share2,
    titleKey: 'features.export.title',
    descKey: 'features.export.desc',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
];

const sourceTypes = [
  { icon: FileSpreadsheet, label: 'Excel / CSV' },
  { icon: Image, label: 'OCR / Images' },
  { icon: Video, label: 'Video / Audio' },
  { icon: Link2, label: 'API' },
  { icon: FileText, label: 'PDF / Docs' },
];

export function FeaturesSection() {
  const { t, language } = useLanguage();

  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            {t('features.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('features.subtitle')}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {features.map((feature, index) => (
            <div
              key={feature.titleKey}
              className="glass-card-hover p-6 group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`w-14 h-14 rounded-xl ${feature.bgColor} flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                <feature.icon className={`w-7 h-7 ${feature.color}`} />
              </div>
              <h3 className="text-lg font-semibold mb-2">{t(feature.titleKey)}</h3>
              <p className="text-sm text-muted-foreground">{t(feature.descKey)}</p>
            </div>
          ))}
        </div>

        {/* Source Types */}
        <div className="glass-card p-8 md:p-12">
          <h3 className="text-xl font-semibold mb-8 text-center">
            {language === 'he' ? 'מקורות נתונים נתמכים' : 'Supported Data Sources'}
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
