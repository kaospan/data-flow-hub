import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CountUpNumber } from './CountUpNumber';

interface MetricCardProps {
  title: string;
  value: number;
  suffix?: string;
  prefix?: string;
  description: string;
  progressValue: number;
  progressColor?: string;
  icon: React.ReactNode;
  index: number;
}

export function MetricCard({
  title,
  value,
  suffix = '',
  prefix = '',
  description,
  progressValue,
  progressColor = 'bg-primary',
  icon,
  index
}: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
    >
      <Card className="border-2 hover:border-primary/50 transition-all duration-300 h-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              {icon}
            </div>
            <CardTitle className="text-3xl font-bold">
              <CountUpNumber 
                end={value} 
                suffix={suffix}
                prefix={prefix}
                duration={2}
              />
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <h3 className="font-semibold mb-2">{title}</h3>
          <p className="text-sm text-muted-foreground mb-4">{description}</p>
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progress</span>
              <span>{progressValue}%</span>
            </div>
            <div className="relative h-2 w-full rounded-full bg-secondary overflow-hidden">
              <motion.div
                className={`absolute inset-y-0 left-0 rounded-full ${progressColor}`}
                initial={{ width: 0 }}
                whileInView={{ width: `${progressValue}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, delay: index * 0.1 + 0.3, ease: "easeOut" }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
