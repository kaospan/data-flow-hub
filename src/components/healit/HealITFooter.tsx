import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Heart, Mail, Phone, MapPin } from 'lucide-react';

export function HealITFooter() {
  const { language } = useLanguage();

  const content = {
    he: {
      description: 'מערכת AI לתיעוד רפואי וניהול תורים חכם לרופאים ומרפאות בישראל.',
      product: 'מוצר',
      features: 'תכונות',
      pricing: 'מחירים',
      contact: 'צור קשר',
      company: 'חברה',
      about: 'אודות',
      careers: 'קריירה',
      legal: 'משפטי',
      privacy: 'מדיניות פרטיות',
      terms: 'תנאי שימוש',
      accessibility: 'הצהרת נגישות',
      contactInfo: 'יצירת קשר',
      rights: 'כל הזכויות שמורות',
    },
    en: {
      description: 'AI-powered medical documentation and smart appointment management for doctors and clinics in Israel.',
      product: 'Product',
      features: 'Features',
      pricing: 'Pricing',
      contact: 'Contact',
      company: 'Company',
      about: 'About',
      careers: 'Careers',
      legal: 'Legal',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      accessibility: 'Accessibility Statement',
      contactInfo: 'Contact Info',
      rights: 'All rights reserved',
    },
  };

  const t = content[language];

  return (
    <footer className="bg-slate-50 dark:bg-slate-900 border-t border-teal-100 dark:border-teal-900/50">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/healit" className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                HealIT
              </span>
            </Link>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              {t.description}
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-4">{t.product}</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/features" className="text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 text-sm transition-colors">
                  {t.features}
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 text-sm transition-colors">
                  {t.pricing}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 text-sm transition-colors">
                  {t.contact}
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-4">{t.company}</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 text-sm transition-colors">
                  {t.about}
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 text-sm transition-colors">
                  {t.careers}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-4">{t.legal}</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/privacy" className="text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 text-sm transition-colors">
                  {t.privacy}
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 text-sm transition-colors">
                  {t.terms}
                </Link>
              </li>
              <li>
                <a href="#" className="text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 text-sm transition-colors">
                  {t.accessibility}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-teal-100 dark:border-teal-900/50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 dark:text-slate-500 text-sm">
              © {new Date().getFullYear()} HealIT. {t.rights}.
            </p>
            <div className="flex items-center gap-6 text-slate-500 dark:text-slate-500 text-sm">
              <a href="mailto:contact@healit.io" className="flex items-center gap-2 hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                <Mail className="w-4 h-4" />
                contact@healit.io
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
