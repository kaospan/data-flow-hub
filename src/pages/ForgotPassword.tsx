import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Zap, ArrowLeft, ArrowRight, Mail, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const ForgotPassword = () => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const Arrow = language === 'he' ? ArrowLeft : ArrowRight;

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const content = {
    he: {
      title: 'שכחת סיסמה?',
      subtitle: 'הזן את כתובת האימייל שלך ונשלח לך קישור לאיפוס הסיסמה',
      email: 'אימייל',
      sendLink: 'שלח קישור איפוס',
      backToLogin: 'חזרה להתחברות',
      successTitle: 'הקישור נשלח!',
      successMessage: 'בדוק את תיבת הדואר שלך עבור קישור לאיפוס הסיסמה.',
      checkSpam: 'לא קיבלת? בדוק את תיקיית הספאם.',
      error: 'שגיאה',
      errorMessage: 'אירעה שגיאה בשליחת הקישור',
    },
    en: {
      title: 'Forgot Password?',
      subtitle: 'Enter your email and we\'ll send you a reset link',
      email: 'Email',
      sendLink: 'Send Reset Link',
      backToLogin: 'Back to Login',
      successTitle: 'Link Sent!',
      successMessage: 'Check your inbox for a password reset link.',
      checkSpam: 'Didn\'t receive it? Check your spam folder.',
      error: 'Error',
      errorMessage: 'Failed to send reset link',
    },
  };

  const c = content[language];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        toast({
          title: c.error,
          description: error.message,
          variant: 'destructive',
        });
        return;
      }

      setEmailSent(true);
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
          {emailSent ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-green-500/10 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h1 className="text-2xl font-bold">{c.successTitle}</h1>
              <p className="text-muted-foreground">{c.successMessage}</p>
              <p className="text-sm text-muted-foreground">{c.checkSpam}</p>
              <Link to="/login">
                <Button variant="outline" className="mt-4">
                  {c.backToLogin}
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Mail className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-2xl font-bold mb-2">{c.title}</h1>
                <p className="text-muted-foreground">{c.subtitle}</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">{c.email}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    required
                    className="bg-secondary/50"
                  />
                </div>

                <Button type="submit" variant="hero" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    t('common.loading')
                  ) : (
                    <>
                      {c.sendLink}
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

export default ForgotPassword;
