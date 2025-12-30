import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Zap, ArrowLeft, ArrowRight, Eye, EyeOff, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate signup - in production this would connect to auth
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: language === 'he' ? 'החשבון נוצר בהצלחה!' : 'Account created successfully!',
        description: language === 'he' ? 'ברוכים הבאים ל-DataFlow' : 'Welcome to DataFlow',
      });
      navigate('/dashboard');
    }, 1000);
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

          <form onSubmit={handleSubmit} className="space-y-5">
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
              {isLoading
                ? t('common.loading')
                : (
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
