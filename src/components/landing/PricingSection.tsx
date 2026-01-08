import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Check, ArrowLeft, ArrowRight } from 'lucide-react';

export function PricingSection() {
  const { language } = useLanguage();
  const Arrow = language === 'he' ? ArrowLeft : ArrowRight;

  const content = {
    he: {
      title: 'תמחור פשוט',
      subtitle: 'התחילו בחינם, שדרגו כשאתם מוכנים',
      plans: [
        {
          name: 'חינמי',
          price: '₪0',
          description: 'לניסיון ולצוותים קטנים',
          features: [
            'עד 1,000 רשומות בחודש',
            '10 קבצים בחודש',
            '3 מקורות נתונים',
            'עיבוד AI בסיסי',
            'תמיכה באימייל',
          ],
          cta: 'התחילו חינם',
          popular: false,
        },
        {
          name: 'מקצועי',
          price: '₪199',
          period: 'לחודש',
          description: 'לעסקים שצריכים יותר',
          features: [
            'עד 25,000 רשומות בחודש',
            'קבצים ללא הגבלה',
            'מקורות ללא הגבלה',
            'עיבוד AI מתקדם',
            'אוטומציות מותאמות',
            'תמיכה בעדיפות',
          ],
          cta: 'התחילו ניסיון',
          popular: true,
        },
        {
          name: 'ארגוני',
          price: 'בהתאמה',
          description: 'לארגונים גדולים',
          features: [
            'רשומות ללא הגבלה',
            'SLA מותאם אישית',
            'הטמעה ייעודית',
            'אינטגרציות מותאמות',
            'מנהל חשבון ייעודי',
            'תמיכה 24/7',
          ],
          cta: 'צרו קשר',
          popular: false,
        },
      ],
    },
    en: {
      title: 'Simple Pricing',
      subtitle: 'Start free, upgrade when ready',
      plans: [
        {
          name: 'Free',
          price: '$0',
          description: 'For trying out and small teams',
          features: [
            'Up to 1,000 records/month',
            '10 files/month',
            '3 data sources',
            'Basic AI processing',
            'Email support',
          ],
          cta: 'Start Free',
          popular: false,
        },
        {
          name: 'Professional',
          price: '$49',
          period: '/month',
          description: 'For businesses that need more',
          features: [
            'Up to 25,000 records/month',
            'Unlimited files',
            'Unlimited sources',
            'Advanced AI processing',
            'Custom automations',
            'Priority support',
          ],
          cta: 'Start Trial',
          popular: true,
        },
        {
          name: 'Enterprise',
          price: 'Custom',
          description: 'For large organizations',
          features: [
            'Unlimited records',
            'Custom SLA',
            'Dedicated onboarding',
            'Custom integrations',
            'Dedicated account manager',
            '24/7 support',
          ],
          cta: 'Contact Us',
          popular: false,
        },
      ],
    },
  };

  const t = content[language];

  return (
    <section className="py-24 relative bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            {t.title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {t.plans.map((plan, index) => (
            <div
              key={index}
              className={`glass-card p-8 relative ${
                plan.popular ? 'ring-2 ring-primary' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-sm font-medium rounded-full">
                  {language === 'he' ? 'הכי פופולרי' : 'Most Popular'}
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.period && (
                    <span className="text-muted-foreground">{plan.period}</span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-2">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-success shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link to={index === 2 ? '/contact' : '/signup'} className="block">
                <Button
                  variant={plan.popular ? 'hero' : 'outline'}
                  className="w-full"
                >
                  {plan.cta}
                  <Arrow className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
