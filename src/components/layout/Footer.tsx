import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Zap } from 'lucide-react';

export function Footer() {
  const { t, language } = useLanguage();

  return (
    <footer className="border-t border-border/50 bg-card/30 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
                <Zap className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold gradient-text">DataFlow</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              {language === 'he'
                ? 'פלטפורמת האוטומציה המובילה לעסקים בישראל'
                : 'The leading automation platform for businesses in Israel'}
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">
              {language === 'he' ? 'מוצר' : 'Product'}
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/features" className="hover:text-foreground transition-colors">
                  {t('nav.features')}
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-foreground transition-colors">
                  {t('nav.pricing')}
                </Link>
              </li>
              <li>
                <Link to="/docs" className="hover:text-foreground transition-colors">
                  {language === 'he' ? 'תיעוד' : 'Documentation'}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">
              {language === 'he' ? 'חברה' : 'Company'}
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/about" className="hover:text-foreground transition-colors">
                  {language === 'he' ? 'אודות' : 'About'}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-foreground transition-colors">
                  {language === 'he' ? 'צור קשר' : 'Contact'}
                </Link>
              </li>
              <li>
                <Link to="/careers" className="hover:text-foreground transition-colors">
                  {language === 'he' ? 'קריירה' : 'Careers'}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">
              {language === 'he' ? 'משפטי' : 'Legal'}
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/privacy" className="hover:text-foreground transition-colors">
                  {language === 'he' ? 'פרטיות' : 'Privacy'}
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-foreground transition-colors">
                  {language === 'he' ? 'תנאי שימוש' : 'Terms'}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/50 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} DataFlow.{' '}
            {language === 'he' ? 'כל הזכויות שמורות.' : 'All rights reserved.'}
          </p>
        </div>
      </div>
    </footer>
  );
}
