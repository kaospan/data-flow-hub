import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Zap, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Signup = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const Arrow = language === 'he' ? ArrowLeft : ArrowRight;

  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        toast({
          title: language === 'he' ? 'שגיאה' : 'Error',
          description: error.message,
          variant: 'destructive',
        });
      }
    } catch (err) {
      console.error('Google sign-up error:', err);
      toast({
        title: language === 'he' ? 'שגיאה' : 'Error',
        description: language === 'he' ? 'אירעה שגיאה' : 'An error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const benefits = language === 'he'
    ? ['7 ימי ניסיון חינם', 'ללא כרטיס אשראי', 'הגדרה תוך דקות']
    : ['7 days free trial', 'No credit card', 'Setup in minutes'];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-info/10 rounded-full blur-3xl" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center">
            <Zap className="w-7 h-7 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold gradient-text">DataFlow</span>
        </Link>

        {/* Card */}
        <div className="glass-card p-8">
          <h1 className="text-2xl font-bold text-center mb-2">{t('auth.signupTitle')}</h1>
          <p className="text-muted-foreground text-center mb-6">
            {language === 'he' ? 'התחילו להשתמש ב-DataFlow היום' : 'Start using DataFlow today'}
          </p>

          {/* Benefits */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {benefits.map((benefit) => (
              <div key={benefit} className="flex items-center gap-1 text-sm text-muted-foreground">
                <Check className="w-4 h-4 text-success" />
                {benefit}
              </div>
            ))}
          </div>

          <Button
            onClick={handleGoogleSignUp}
            variant="outline"
            className="w-full h-12 text-base"
            disabled={isLoading}
          >
            {isLoading ? (
              t('common.loading')
            ) : (
              <>
                <svg className="w-5 h-5 me-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                {language === 'he' ? 'הרשמה עם Google' : 'Sign up with Google'}
              </>
            )}
          </Button>

          <p className="mt-4 text-xs text-center text-muted-foreground">
            {language === 'he'
              ? 'בהרשמה אתם מסכימים לתנאי השימוש ולמדיניות הפרטיות'
              : 'By signing up, you agree to our Terms and Privacy Policy'}
          </p>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            {t('auth.hasAccount')}{' '}
            <Link to="/login" className="text-primary hover:underline font-medium">
              {t('nav.login')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
