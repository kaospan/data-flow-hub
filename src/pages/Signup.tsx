import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Zap, ArrowLeft, ArrowRight, Eye, EyeOff, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Signup = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const Arrow = language === 'he' ? ArrowLeft : ArrowRight;

  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true);
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
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: {
            name: formData.fullName,
            organization_name: formData.companyName,
          },
        },
      });

      if (error) {
        toast({
          title: language === 'he' ? 'שגיאה' : 'Error',
          description: error.message,
          variant: 'destructive',
        });
        return;
      }

      if (data.user) {
        toast({
          title: language === 'he' ? 'החשבון נוצר בהצלחה!' : 'Account created successfully!',
          description: language === 'he' ? 'ברוכים הבאים ל-DataFlow' : 'Welcome to DataFlow',
        });
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Signup error:', err);
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
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-info/10 rounded-full blur-3xl" />

      <div className="w-full max-w-md relative z-10">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center">
            <Zap className="w-7 h-7 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold gradient-text">DataFlow</span>
        </Link>

        <div className="glass-card p-8">
          <h1 className="text-2xl font-bold text-center mb-2">{t('auth.signupTitle')}</h1>
          <p className="text-muted-foreground text-center mb-4">
            {language === 'he' ? 'התחילו להשתמש ב-DataFlow היום' : 'Start using DataFlow today'}
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-6">
            {benefits.map((benefit) => (
              <div key={benefit} className="flex items-center gap-1 text-sm text-muted-foreground">
                <Check className="w-4 h-4 text-success" />
                {benefit}
              </div>
            ))}
          </div>

          {/* Google Sign Up */}
          <Button
            onClick={handleGoogleSignUp}
            variant="outline"
            className="w-full h-11"
            disabled={isGoogleLoading}
          >
            {isGoogleLoading ? (
              t('common.loading')
            ) : (
              <>
                <svg className="w-5 h-5 me-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                {language === 'he' ? 'הרשמה עם Google' : 'Sign up with Google'}
              </>
            )}
          </Button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                {language === 'he' ? 'או' : 'or'}
              </span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">{t('auth.fullName')}</Label>
              <Input
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder={language === 'he' ? 'ישראל ישראלי' : 'John Doe'}
                required
                className="bg-secondary/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyName">{t('auth.companyName')}</Label>
              <Input
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder={language === 'he' ? 'שם החברה' : 'Company Name'}
                required
                className="bg-secondary/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{t('auth.email')}</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@company.com"
                required
                className="bg-secondary/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{t('auth.password')}</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  minLength={8}
                  className="bg-secondary/50 pe-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                {language === 'he' ? 'לפחות 8 תווים' : 'At least 8 characters'}
              </p>
            </div>

            <Button type="submit" variant="hero" className="w-full" disabled={isLoading}>
              {isLoading ? t('common.loading') : (
                <>
                  {t('nav.signup')}
                  <Arrow className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>

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
