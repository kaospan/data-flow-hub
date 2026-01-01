import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { getRoleLabel } from '@/hooks/usePermissions';
import { Button } from '@/components/ui/button';
import { ShieldX, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export function AccessDenied() {
  const { t, language } = useLanguage();
  const { role } = useAuth();

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-8">
        <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
          <ShieldX className="w-10 h-10 text-destructive" />
        </div>
        
        <h1 className="text-2xl font-bold mb-2">
          {language === 'he' ? 'אין לך הרשאה לדף זה' : 'Access Denied'}
        </h1>
        
        <p className="text-muted-foreground mb-6">
          {language === 'he' 
            ? `הרשאת "${getRoleLabel(role, language)}" אינה מספיקה לצפייה בעמוד זה.`
            : `Your "${getRoleLabel(role, language)}" role doesn't have permission to view this page.`
          }
        </p>

        <Link to="/dashboard">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            {language === 'he' ? 'חזרה ללוח הבקרה' : 'Back to Dashboard'}
          </Button>
        </Link>
      </div>
    </div>
  );
}
