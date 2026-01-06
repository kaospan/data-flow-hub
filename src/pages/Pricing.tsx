import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Check, Zap, HelpCircle } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const plans = [
  {
    name: { he: 'סטארטר', en: 'Starter' },
    priceMonthly: 199,
    priceYearly: 1990,
    features: {
      he: ['עד 1,000 רשומות/חודש', '3 מקורות נתונים', '10 הרצות אוטומציה', 'תמיכה במייל', 'משתמש אחד'],
      en: ['Up to 1,000 records/month', '3 data sources', '10 automation runs', 'Email support', '1 user'],
    },
    popular: false,
  },
  {
    name: { he: 'פרו', en: 'Pro' },
    priceMonthly: 499,
    priceYearly: 4990,
    features: {
      he: ['עד 10,000 רשומות/חודש', 'מקורות נתונים ללא הגבלה', '100 הרצות אוטומציה', 'תמיכה מועדפת', 'עד 5 משתמשים', 'API גישה'],
      en: ['Up to 10,000 records/month', 'Unlimited data sources', '100 automation runs', 'Priority support', 'Up to 5 users', 'API access'],
    },
    popular: true,
  },
  {
    name: { he: 'ארגוני', en: 'Enterprise' },
    priceMonthly: null,
    priceYearly: null,
    features: {
      he: ['רשומות ללא הגבלה', 'מקורות ללא הגבלה', 'הרצות ללא הגבלה', 'תמיכה 24/7', 'משתמשים ללא הגבלה', 'SSO וביטחון מתקדם', 'SLA מותאם אישית'],
      en: ['Unlimited records', 'Unlimited sources', 'Unlimited runs', '24/7 support', 'Unlimited users', 'SSO & advanced security', 'Custom SLA'],
    },
    popular: false,
  },
];

const faqs = {
  he: [
    { q: 'האם יש תקופת ניסיון?', a: 'כן! אנחנו מציעים 14 ימי ניסיון חינם לכל התוכניות, ללא צורך בכרטיס אשראי.' },
    { q: 'האם אפשר לשנות תוכנית?', a: 'בהחלט. אתם יכולים לשדרג או לשנמך את התוכנית בכל עת.' },
    { q: 'מה קורה אם עוברים את המגבלות?', a: 'נודיע לכם מראש ונציע שדרוג. לא נפסיק את השירות ללא התראה.' },
    { q: 'האם יש הנחות לארגונים?', a: 'כן, צרו איתנו קשר לקבלת הצעת מחיר מותאמת לארגון שלכם.' },
  ],
  en: [
    { q: 'Is there a free trial?', a: 'Yes! We offer a 14-day free trial for all plans, no credit card required.' },
    { q: 'Can I change plans?', a: 'Absolutely. You can upgrade or downgrade your plan at any time.' },
    { q: 'What happens if I exceed limits?', a: "We'll notify you in advance and suggest an upgrade. We won't stop service without notice." },
    { q: 'Are there discounts for organizations?', a: 'Yes, contact us for a custom quote tailored to your organization.' },
  ],
};

export default function Pricing() {
  const { language, t } = useLanguage();
  const [isYearly, setIsYearly] = useState(false);

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
                  {language === 'he' ? 'תוכניות ומחירים' : 'Plans & Pricing'}
                </span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
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
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {plans.map((plan) => (
                <div
                  key={plan.name.en}
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

                  <h3 className="text-xl font-bold mb-2">{plan.name[language]}</h3>

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
                    <Button variant={plan.popular ? 'hero' : 'outline'} className="w-full">
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

        {/* FAQ */}
        <section className="py-24 bg-secondary/20">
          <div className="container mx-auto px-4 max-w-3xl">
            <div className="flex items-center justify-center gap-3 mb-12">
              <HelpCircle className="w-8 h-8 text-primary" />
              <h2 className="text-3xl font-bold">
                {language === 'he' ? 'שאלות נפוצות' : 'FAQ'}
              </h2>
            </div>
            <Accordion type="single" collapsible className="space-y-4">
              {faqs[language].map((faq, index) => (
                <AccordionItem key={index} value={`faq-${index}`} className="glass-card px-6">
                  <AccordionTrigger className="text-start">{faq.q}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{faq.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
