import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Zap, ArrowLeft, ArrowRight, Eye, EyeOff, Lock, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const ResetPassword = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const Arrow = language === 'he' ? ArrowLeft : ArrowRight;

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isValidSession, setIsValidSession] = useState(false);

  const content = {
    he: {
      title: 'איפוס סיסמה',
      subtitle: 'הזן סיסמה חדשה',
      password: 'סיסמה חדשה',
      confirmPassword: 'אימות סיסמה',
      resetPassword: 'אפס סיסמה',
      backToLogin: 'חזרה להתחברות',
      successTitle: 'הסיסמה אופסה!',
      successMessage: 'הסיסמה שלך עודכנה בהצלחה.',
      goToLogin: 'המשך להתחברות',
      error: 'שגיאה',
      errorMessage: 'אירעה שגיאה באיפוס הסיסמה',
      passwordMismatch: 'הסיסמאות לא תואמות',
      invalidLink: 'הקישור לא תקין או פג תוקף',
      checkingLink: 'בודק קישור...',
    },
    en: {
      title: 'Reset Password',
      subtitle: 'Enter your new password',
      password: 'New Password',
      confirmPassword: 'Confirm Password',
      resetPassword: 'Reset Password',
      backToLogin: 'Back to Login',
      successTitle: 'Password Reset!',
      successMessage: 'Your password has been updated successfully.',
      goToLogin: 'Continue to Login',
      error: 'Error',
      errorMessage: 'Failed to reset password',
      passwordMismatch: 'Passwords do not match',
      invalidLink: 'Invalid or expired reset link',
      checkingLink: 'Checking link...',
    },
  };

  const c = content[language];

  useEffect(() => {
    // Listen for auth state change from the URL hash
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' || (event === 'SIGNED_IN' && session)) {
        setIsValidSession(true);
      }
    });

    // Also check if we already have a session (page reload case)
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsValidSession(true);
      }
    };

    checkSession();

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: c.error,
        description: c.passwordMismatch,
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        toast({
          title: c.error,
          description: error.message,
          variant: 'destructive',
        });
        return;
      }

      setIsSuccess(true);
    } catch (err) {
      console.error('Reset password error:', err);
      toast({
        title: c.error,
        description: c.errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-primary/10 rounded-full blur-3xl" />

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
          {isSuccess ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-green-500/10 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h1 className="text-2xl font-bold">{c.successTitle}</h1>
              <p className="text-muted-foreground">{c.successMessage}</p>
              <Link to="/login">
                <Button variant="hero" className="mt-4">
                  {c.goToLogin}
                  <Arrow className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          ) : !isValidSession ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <Lock className="w-8 h-8 text-primary animate-pulse" />
              </div>
              <p className="text-muted-foreground">{c.checkingLink}</p>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Lock className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-2xl font-bold mb-2">{c.title}</h1>
                <p className="text-muted-foreground">{c.subtitle}</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="password">{c.password}</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      minLength={6}
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
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">{c.confirmPassword}</Label>
                  <Input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    className="bg-secondary/50"
                  />
                </div>

                <Button type="submit" variant="hero" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    t('common.loading')
                  ) : (
                    <>
                      {c.resetPassword}
                      <Arrow className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground">
                  ← {c.backToLogin}
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
