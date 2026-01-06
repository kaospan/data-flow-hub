import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Contact() {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    toast({
      title: language === 'he' ? 'הודעה נשלחה!' : 'Message sent!',
      description: language === 'he' ? 'נחזור אליכם בהקדם' : "We'll get back to you soon",
    });
  };

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
                  {language === 'he' ? 'צרו קשר' : 'Contact Us'}
                </span>
              </h1>
              <p className="text-xl text-muted-foreground">
                {language === 'he'
                  ? 'נשמח לעזור לכם! השאירו פרטים ונחזור אליכם בהקדם'
                  : "We'd love to help! Leave your details and we'll get back to you soon"}
              </p>
            </div>
          </div>
        </section>

        {/* Contact Content */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
              {/* Contact Info */}
              <div className="space-y-8">
                <h2 className="text-2xl font-bold mb-6">
                  {language === 'he' ? 'פרטי התקשרות' : 'Contact Information'}
                </h2>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{language === 'he' ? 'אימייל' : 'Email'}</h3>
                      <a href="mailto:hello@dataflow.co.il" className="text-muted-foreground hover:text-primary transition-colors">
                        hello@dataflow.co.il
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{language === 'he' ? 'טלפון' : 'Phone'}</h3>
                      <a href="tel:+972-3-123-4567" className="text-muted-foreground hover:text-primary transition-colors">
                        03-123-4567
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{language === 'he' ? 'כתובת' : 'Address'}</h3>
                      <p className="text-muted-foreground">
                        {language === 'he' ? 'רוטשילד 45, תל אביב' : '45 Rothschild, Tel Aviv'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="glass-card p-6 mt-8">
                  <h3 className="font-semibold mb-2">
                    {language === 'he' ? 'שעות פעילות' : 'Business Hours'}
                  </h3>
                  <p className="text-muted-foreground">
                    {language === 'he' 
                      ? 'ראשון - חמישי: 09:00 - 18:00'
                      : 'Sunday - Thursday: 9:00 AM - 6:00 PM'}
                  </p>
                </div>
              </div>

              {/* Contact Form */}
              <div className="glass-card p-8">
                {isSubmitted ? (
                  <div className="text-center py-12">
                    <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
                    <h3 className="text-2xl font-bold mb-2">
                      {language === 'he' ? 'תודה!' : 'Thank You!'}
                    </h3>
                    <p className="text-muted-foreground">
                      {language === 'he' ? 'נחזור אליכם בהקדם' : "We'll be in touch soon"}
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">{language === 'he' ? 'שם מלא' : 'Full Name'}</Label>
                        <Input id="name" required placeholder={language === 'he' ? 'ישראל ישראלי' : 'John Doe'} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">{language === 'he' ? 'אימייל' : 'Email'}</Label>
                        <Input id="email" type="email" required placeholder="you@example.com" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company">{language === 'he' ? 'חברה' : 'Company'}</Label>
                      <Input id="company" placeholder={language === 'he' ? 'שם החברה' : 'Company name'} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">{language === 'he' ? 'הודעה' : 'Message'}</Label>
                      <Textarea 
                        id="message" 
                        required 
                        rows={5}
                        placeholder={language === 'he' ? 'ספרו לנו כיצד נוכל לעזור...' : 'Tell us how we can help...'}
                      />
                    </div>

                    <Button type="submit" variant="hero" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <span className="animate-pulse">{language === 'he' ? 'שולח...' : 'Sending...'}</span>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          {language === 'he' ? 'שלח הודעה' : 'Send Message'}
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
