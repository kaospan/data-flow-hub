import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TimelineItemProps {
  phase: string;
  title: string;
  description: string;
  details: string[];
  icon: ReactNode;
  index: number;
  isLast?: boolean;
}

export function TimelineItem({ 
  phase, 
  title, 
  description, 
  details, 
  icon, 
  index,
  isLast = false 
}: TimelineItemProps) {
  const isEven = index % 2 === 0;
  
  return (
    <div className="relative">
      {/* Timeline Line */}
      {!isLast && (
        <motion.div
          className="absolute left-1/2 top-24 w-0.5 h-full bg-gradient-to-b from-primary via-primary/50 to-transparent -translate-x-1/2 hidden md:block"
          initial={{ scaleY: 0, transformOrigin: 'top' }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        />
      )}

      <motion.div
        initial={{ opacity: 0, x: isEven ? -50 : 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        className={`flex flex-col md:flex-row items-center gap-6 ${
          isEven ? 'md:flex-row' : 'md:flex-row-reverse'
        }`}
      >
        {/* Content Card */}
        <div className="flex-1 w-full md:w-auto">
          <Card className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  {icon}
                </div>
                <div>
                  <span className="text-sm text-primary font-semibold">{phase}</span>
                  <CardTitle className="text-xl">{title}</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{description}</p>
              <ul className="space-y-2">
                {details.map((detail, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Timeline Node */}
        <motion.div
          className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30 relative z-10"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: index * 0.1 + 0.2 }}
        >
          <span className="text-primary-foreground font-bold text-lg">
            {index + 1}
          </span>
        </motion.div>

        {/* Spacer for alignment */}
        <div className="flex-1 hidden md:block" />
      </motion.div>
    </div>
  );
}
