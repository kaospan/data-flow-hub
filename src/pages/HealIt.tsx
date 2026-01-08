import { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Activity,
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Brain,
  CheckCircle,
  Clock,
  Database,
  FileCheck,
  HeartPulse,
  Lightbulb,
  LineChart,
  Microscope,
  Shield,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Target,
  TrendingUp,
  Users,
  Zap
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AnimatedSection } from '@/components/healit/AnimatedSection';
import { CountUpNumber } from '@/components/healit/CountUpNumber';
import { TimelineItem } from '@/components/healit/TimelineItem';
import { MetricCard } from '@/components/healit/MetricCard';
import { FeatureCard } from '@/components/healit/FeatureCard';

export default function HealIt() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Scroll Progress Indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-primary z-50 origin-left"
        style={{ scaleX }}
      />

      <Header />

      {/* Floating Action Button */}
      {isScrolled && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-8 right-8 z-40"
        >
          <Link to="/signup">
            <Button size="lg" className="shadow-lg shadow-primary/50 animate-pulse-slow">
              Get Started <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </motion.div>
      )}

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/10" />
        
        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-primary/20 rounded-full"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
              }}
              animate={{
                y: [null, Math.random() * window.innerHeight],
                x: [null, Math.random() * window.innerWidth],
              }}
              transition={{
                duration: Math.random() * 20 + 10,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "linear",
              }}
            />
          ))}
        </div>

        {/* Medical Icons Floating */}
        <motion.div
          className="absolute top-1/4 left-1/4 opacity-10"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
        >
          <Stethoscope className="w-24 h-24 text-primary" />
        </motion.div>
        <motion.div
          className="absolute bottom-1/3 right-1/4 opacity-10"
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        >
          <HeartPulse className="w-32 h-32 text-primary" />
        </motion.div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Badge className="mb-6 text-sm px-6 py-2 bg-primary/10 text-primary border-primary/20">
                <Sparkles className="w-4 h-4 mr-2" />
                Clinical Intelligence Platform
              </Badge>
            </motion.div>

            <motion.h1
              className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              HealIt: The Clinical Intelligence Layer{' '}
              <span className="text-primary">Healthcare Has Been Waiting For</span>
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Memory as a Service for Overloaded Doctors
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <Link to="/signup">
                <Button size="xl" className="shadow-lg animate-glow">
                  Request Demo <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/docs">
                <Button size="xl" variant="outline">
                  Read the Vision
                </Button>
              </Link>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {[
                { icon: Shield, text: 'Safety First Design' },
                { icon: Brain, text: 'AI-Powered Insights' },
                { icon: CheckCircle, text: 'Human-Verified' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-3 bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg px-4 py-3"
                  whileHover={{ scale: 1.05, borderColor: 'hsl(var(--primary))' }}
                >
                  <item.icon className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium">{item.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Problem Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-destructive/5 to-transparent" />
        
        <div className="container mx-auto px-4 relative z-10">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              When Memory Fails, <span className="text-destructive">Patients Fall Through</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              The healthcare system is drowning in data, and critical information is being lost
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { 
                stat: '23', 
                suffix: '%',
                title: 'No Follow-up',
                description: 'of abnormal test results receive no documented follow-up',
                color: 'text-destructive',
                icon: AlertCircle
              },
              { 
                stat: '#1', 
                title: 'Malpractice Cause',
                description: 'Missed diagnoses remain the leading cause of malpractice claims',
                color: 'text-warning',
                icon: AlertTriangle
              },
              { 
                stat: '30-40', 
                suffix: '%',
                title: 'Time Wasted',
                description: 'of clinic time spent on inbox management instead of patient care',
                color: 'text-destructive',
                icon: Clock
              },
            ].map((item, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <Card className="border-2 border-destructive/20 bg-destructive/5 hover:border-destructive/50 transition-all h-full">
                  <CardHeader>
                    <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
                      <item.icon className="w-8 h-8 text-destructive" />
                    </div>
                    <CardTitle className={`text-5xl font-bold ${item.color}`}>
                      <CountUpNumber 
                        end={typeof item.stat === 'string' && item.stat.includes('-') 
                          ? parseInt(item.stat.split('-')[1]) 
                          : parseInt(item.stat) || 1
                        }
                        prefix={item.stat === '#1' ? '#' : ''}
                        suffix={item.suffix || ''}
                      />
                    </CardTitle>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Why Now Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Why <span className="text-primary">Now</span>?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Three forces converge to make HealIt possible today
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: Brain,
                title: 'AI Has Reached Clinical Maturity',
                description: 'Modern LLMs can understand medical context, extract structured data, and flag critical issues with unprecedented accuracy.',
                points: ['GPT-4 level reasoning', 'Medical knowledge integration', 'Context-aware processing']
              },
              {
                icon: Database,
                title: 'Data Infrastructure Exists',
                description: 'EHR systems, FHIR standards, and cloud platforms provide the foundation for intelligent integration.',
                points: ['Standardized APIs', 'Secure cloud infrastructure', 'Interoperability protocols']
              },
              {
                icon: TrendingUp,
                title: 'System Overload Has Hit Breaking Point',
                description: 'Physician burnout, diagnostic errors, and missed follow-ups have reached crisis levels demanding immediate solutions.',
                points: ['60% burnout rate', 'Growing complexity', 'Patient safety crisis']
              },
            ].map((pillar, i) => (
              <AnimatedSection key={i} delay={i * 0.15} direction="up">
                <Card className="h-full border-2 hover:border-primary/50 transition-all hover:shadow-xl hover:shadow-primary/20">
                  <CardHeader>
                    <motion.div
                      className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-4"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <pillar.icon className="w-8 h-8 text-primary" />
                    </motion.div>
                    <CardTitle className="text-2xl">{pillar.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{pillar.description}</p>
                    <ul className="space-y-2">
                      {pillar.points.map((point, j) => (
                        <li key={j} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        
        <div className="container mx-auto px-4 relative z-10">
          <AnimatedSection className="text-center mb-16">
            <motion.h2
              className="text-4xl md:text-6xl font-bold mb-6 leading-tight max-w-4xl mx-auto"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              We turn <span className="text-primary">clinical chaos</span> into{' '}
              <span className="text-primary">actionable intelligence</span>
            </motion.h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Three dimensions of value for modern healthcare
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                icon: Stethoscope,
                title: 'Clinical Value',
                description: 'Never miss a critical test result. Catch patterns humans can\'t see. Prevent adverse events before they happen.',
                backContent: 'Real-time monitoring of all test results, automated risk stratification, intelligent follow-up reminders, and predictive analytics for early intervention.'
              },
              {
                icon: Zap,
                title: 'Operational Value',
                description: 'Reduce inbox time by 60%. Automate routine tasks. Let doctors focus on medicine, not paperwork.',
                backContent: 'Smart inbox prioritization, automated documentation, intelligent routing, and seamless EHR integration that saves hours every day.'
              },
              {
                icon: LineChart,
                title: 'Economic Value',
                description: 'Reduce malpractice risk. Improve outcomes. Increase physician capacity without burnout.',
                backContent: 'Lower liability insurance costs, improved quality metrics, reduced readmissions, and happier physicians who stay in practice longer.'
              },
            ].map((value, i) => (
              <FeatureCard
                key={i}
                icon={<value.icon className="w-7 h-7 text-primary" />}
                title={value.title}
                description={value.description}
                backContent={value.backContent}
                index={i}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Safety Section */}
      <section className="py-24 relative">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"
          style={{
            backgroundImage: 'radial-gradient(circle at 50% 50%, hsl(var(--primary) / 0.05) 0%, transparent 50%)',
          }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <AnimatedSection className="text-center mb-16">
            <Badge className="mb-4 text-sm px-6 py-2 bg-primary/10 text-primary border-primary/20">
              <ShieldCheck className="w-4 h-4 mr-2" />
              Built for Trust, Not Hype
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Safety-First Design
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              This isn't a chatbot. It's a clinical decision support system built with safety at its core.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {[
              {
                icon: Microscope,
                title: 'Explainability First',
                description: 'Every recommendation comes with evidence, reasoning, and confidence scores. No black boxes.'
              },
              {
                icon: Users,
                title: 'Human-in-the-Loop',
                description: 'Critical decisions always involve a physician. AI augments, never replaces human judgment.'
              },
              {
                icon: FileCheck,
                title: 'Comprehensive Audit Trails',
                description: 'Every action logged. Every decision traceable. Full transparency for compliance and quality assurance.'
              },
              {
                icon: Target,
                title: 'Risk Reduction',
                description: 'Purpose-built to catch errors, prevent oversights, and ensure continuity of care.'
              },
            ].map((principle, i) => (
              <AnimatedSection key={i} delay={i * 0.1} direction="up">
                <motion.div
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card className="h-full border-2 hover:border-primary/50 transition-all">
                    <CardHeader>
                      <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                        <principle.icon className="w-7 h-7 text-primary" />
                      </div>
                      <CardTitle className="text-lg">{principle.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{principle.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Measurable Impact
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Success metrics that matter to patients, physicians, and healthcare systems
            </p>
          </AnimatedSection>

          {/* Clinical Outcomes */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold mb-8 text-center">Clinical Outcomes</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <MetricCard
                icon={<CheckCircle className="w-6 h-6 text-primary" />}
                title="Follow-up Completion"
                value={95}
                suffix="%"
                description="Critical test results with documented follow-up"
                progressValue={95}
                progressColor="bg-primary"
                index={0}
              />
              <MetricCard
                icon={<AlertTriangle className="w-6 h-6 text-warning" />}
                title="Diagnostic Accuracy"
                value={87}
                suffix="%"
                description="AI-flagged cases confirmed as clinically significant"
                progressValue={87}
                progressColor="bg-warning"
                index={1}
              />
              <MetricCard
                icon={<Activity className="w-6 h-6 text-success" />}
                title="Adverse Events Prevented"
                value={34}
                suffix="%"
                description="Reduction in preventable adverse events"
                progressValue={34}
                progressColor="bg-success"
                index={2}
              />
            </div>
          </div>

          {/* Physician Experience */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold mb-8 text-center">Physician Experience</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <MetricCard
                icon={<Clock className="w-6 h-6 text-primary" />}
                title="Time Saved"
                value={60}
                suffix="%"
                description="Reduction in inbox management time"
                progressValue={60}
                progressColor="bg-primary"
                index={3}
              />
              <MetricCard
                icon={<HeartPulse className="w-6 h-6 text-success" />}
                title="Burnout Reduction"
                value={42}
                suffix="%"
                description="Improved physician satisfaction scores"
                progressValue={42}
                progressColor="bg-success"
                index={4}
              />
              <MetricCard
                icon={<Target className="w-6 h-6 text-info" />}
                title="Cognitive Load"
                value={55}
                suffix="%"
                description="Reduction in decision fatigue indicators"
                progressValue={55}
                progressColor="bg-info"
                index={5}
              />
            </div>
          </div>

          {/* System Impact */}
          <div>
            <h3 className="text-2xl font-bold mb-8 text-center">System Impact</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <MetricCard
                icon={<BarChart3 className="w-6 h-6 text-primary" />}
                title="Capacity Increase"
                value={25}
                suffix="%"
                description="More patients served without additional staff"
                progressValue={25}
                progressColor="bg-primary"
                index={6}
              />
              <MetricCard
                icon={<TrendingUp className="w-6 h-6 text-success" />}
                title="Quality Metrics"
                value={31}
                suffix="%"
                description="Improvement in quality measure performance"
                progressValue={31}
                progressColor="bg-success"
                index={7}
              />
              <MetricCard
                icon={<Shield className="w-6 h-6 text-info" />}
                title="Liability Risk"
                value={40}
                suffix="%"
                description="Reduction in potential malpractice exposure"
                progressValue={40}
                progressColor="bg-info"
                index={8}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/20 to-transparent" />
        
        <div className="container mx-auto px-4 relative z-10">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Pilot to <span className="text-primary">National Scale</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              A proven path from proof of concept to nationwide deployment
            </p>
          </AnimatedSection>

          <div className="max-w-5xl mx-auto space-y-12">
            <TimelineItem
              phase="Phase 1: Q1-Q2 2026"
              title="Proof of Concept"
              description="Deploy within a single specialty clinic in one Kupah"
              details={[
                'Focus on high-volume specialty (e.g., Internal Medicine, Oncology)',
                '10-20 physicians in controlled environment',
                'Validate core AI accuracy and workflow integration',
                'Establish baseline metrics for follow-up completion and physician time'
              ]}
              icon={<Lightbulb className="w-6 h-6 text-primary" />}
              index={0}
            />
            
            <TimelineItem
              phase="Phase 2: Q3-Q4 2026"
              title="Single Kupah Expansion"
              description="Scale to multiple specialties within one health fund"
              details={[
                'Add 3-5 additional specialties',
                'Expand to 100-200 physicians',
                'Integrate with Kupah\'s existing EHR system',
                'Demonstrate ROI and clinical outcomes'
              ]}
              icon={<Target className="w-6 h-6 text-primary" />}
              index={1}
            />
            
            <TimelineItem
              phase="Phase 3: 2027"
              title="Multi-Kupah Deployment"
              description="Expand to 2-3 additional health funds"
              details={[
                'Customize for different EHR systems',
                'Deploy to 500+ physicians',
                'Build interoperability layer',
                'Establish network effects and shared learning'
              ]}
              icon={<Database className="w-6 h-6 text-primary" />}
              index={2}
            />
            
            <TimelineItem
              phase="Phase 4: 2028+"
              title="National Intelligence Layer"
              description="Become the clinical intelligence backbone of Israeli healthcare"
              details={[
                'All four Kupot using HealIt',
                'National-level analytics and insights',
                'Population health management capabilities',
                'Export model to other national healthcare systems'
              ]}
              icon={<Sparkles className="w-6 h-6 text-primary" />}
              index={3}
              isLast
            />
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/10 to-background" />
        
        {/* Spotlight Effect */}
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full"
          style={{
            background: 'radial-gradient(circle, hsl(var(--primary) / 0.15) 0%, transparent 70%)',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <AnimatedSection>
              <Badge className="mb-6 text-sm px-6 py-2 bg-primary/10 text-primary border-primary/20">
                <Zap className="w-4 h-4 mr-2" />
                Why HealIt Wins
              </Badge>
              
              <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                This isn't another healthcare IT project
              </h2>
              
              <p className="text-xl text-muted-foreground mb-8">
                It's the infrastructure layer healthcare needs to work again
              </p>

              <Card className="border-2 border-primary/20 bg-card/50 backdrop-blur-sm mb-12">
                <CardContent className="pt-8 pb-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                    {[
                      { icon: Brain, text: 'AI that doctors actually trust' },
                      { icon: Shield, text: 'Safety-first architecture' },
                      { icon: Zap, text: 'Solves real pain points immediately' },
                      { icon: Database, text: 'Built for existing infrastructure' },
                      { icon: TrendingUp, text: 'Clear path to national scale' },
                      { icon: Target, text: 'Network effects create moat' },
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        className="flex items-center gap-3"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <item.icon className="w-5 h-5 text-primary" />
                        </div>
                        <span className="font-medium">{item.text}</span>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Link to="/signup">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      size="xl" 
                      className="text-lg px-12 py-8 h-auto shadow-2xl shadow-primary/50 animate-pulse-slow"
                    >
                      Request a Demo <ArrowRight className="w-6 h-6 ml-2" />
                    </Button>
                  </motion.div>
                </Link>

                <p className="text-sm text-muted-foreground">
                  Join the healthcare organizations building the future of clinical intelligence
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <Separator className="my-12" />

      <Footer />
    </div>
  );
}
