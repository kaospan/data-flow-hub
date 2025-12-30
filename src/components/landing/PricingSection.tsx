import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Check, Zap } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

const plans = [
  {
    nameKey: 'plans.starter',
    priceMonthly: 199,
    priceYearly: 1990,
    features: {
      he: ['עד 1,000 רשומות/חודש', '3 מקורות נתונים', '10 הרצות אוטומציה', 'תמיכה במייל', 'משתמש אחד'],
      en: ['Up to 1,000 records/month', '3 data sources', '10 automation runs', 'Email support', '1 user'],
    },
    popular: false,
  },
  {
    nameKey: 'plans.pro',
    priceMonthly: 499,
    priceYearly: 4990,
    features: {
      he: ['עד 10,000 רשומות/חודש', 'מקורות נתונים ללא הגבלה', '100 הרצות אוטומציה', 'תמיכה מועדפת', 'עד 5 משתמשים', 'API גישה'],
      en: ['Up to 10,000 records/month', 'Unlimited data sources', '100 automation runs', 'Priority support', 'Up to 5 users', 'API access'],
    },
    popular: true,
  },
  {
    nameKey: 'plans.enterprise',
    priceMonthly: null,
    priceYearly: null,
    features: {
      he: ['רשומות ללא הגבלה', 'מקורות ללא הגבלה', 'הרצות ללא הגבלה', 'תמיכה 24/7', 'משתמשים ללא הגבלה', 'SSO וביטחון מתקדם', 'SLA מותאם אישית'],
      en: ['Unlimited records', 'Unlimited sources', 'Unlimited runs', '24/7 support', 'Unlimited users', 'SSO & advanced security', 'Custom SLA'],
    },
    popular: false,
  },
];

export function PricingSection() {
  const { t, language } = useLanguage();
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            {language === 'he' ? 'תוכניות ומחירים' : 'Plans & Pricing'}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            {language === 'he'
              ? 'בחרו את התוכנית המתאימה לעסק שלכם'
              : 'Choose the plan that fits your business'}
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4">
            <span className={`text-sm ${!isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>
              {t('plans.monthly')}
            </span>
            <Switch checked={isYearly} onCheckedChange={setIsYearly} />
            <span className={`text-sm ${isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>
              {t('plans.yearly')}
              <span className="ms-2 px-2 py-0.5 text-xs rounded-full bg-success/20 text-success">
                {language === 'he' ? 'חיסכון 17%' : 'Save 17%'}
              </span>
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.nameKey}
              className={`relative glass-card p-8 ${
                plan.popular ? 'border-primary/50 ring-2 ring-primary/20' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-primary text-primary-foreground text-xs font-semibold flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  {language === 'he' ? 'הכי פופולרי' : 'Most Popular'}
                </div>
              )}

              <h3 className="text-xl font-bold mb-2">{t(plan.nameKey)}</h3>

              <div className="mb-6">
                {plan.priceMonthly !== null ? (
                  <>
                    <span className="text-4xl font-bold">
                      ₪{isYearly ? Math.round(plan.priceYearly! / 12) : plan.priceMonthly}
                    </span>
                    <span className="text-muted-foreground">{t('plans.perMonth')}</span>
                    {isYearly && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {language === 'he' ? `₪${plan.priceYearly} בשנה` : `₪${plan.priceYearly}/year`}
                      </p>
                    )}
                  </>
                ) : (
                  <span className="text-2xl font-bold">
                    {language === 'he' ? 'צרו קשר' : 'Contact Us'}
                  </span>
                )}
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features[language].map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <Check className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link to="/signup" className="block">
                <Button
                  variant={plan.popular ? 'hero' : 'outline'}
                  className="w-full"
                >
                  {plan.priceMonthly !== null
                    ? t('hero.cta')
                    : language === 'he'
                    ? 'דברו איתנו'
                    : 'Talk to Us'}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
