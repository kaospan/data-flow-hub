import { motion } from 'framer-motion';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  backContent?: string;
  index: number;
}

export function FeatureCard({ 
  icon, 
  title, 
  description, 
  backContent,
  index 
}: FeatureCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.05 }}
      className="h-full perspective-1000"
    >
      <motion.div
        className="relative w-full h-full cursor-pointer preserve-3d"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring" }}
        onClick={() => backContent && setIsFlipped(!isFlipped)}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front Side */}
        <div
          className="absolute inset-0 backface-hidden"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <Card className="border-2 hover:border-primary/50 transition-all duration-300 h-full hover:shadow-lg hover:shadow-primary/20">
            <CardHeader>
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                {icon}
              </div>
              <CardTitle className="text-xl">{title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{description}</p>
              {backContent && (
                <p className="text-xs text-primary mt-4">Click to learn more →</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Back Side */}
        {backContent && (
          <div
            className="absolute inset-0 backface-hidden"
            style={{ 
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)'
            }}
          >
            <Card className="border-2 border-primary/50 h-full bg-primary/5">
              <CardContent className="p-6 flex items-center justify-center h-full">
                <div className="text-center">
                  <p className="text-sm leading-relaxed">{backContent}</p>
                  <p className="text-xs text-primary mt-4">Click to flip back →</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
