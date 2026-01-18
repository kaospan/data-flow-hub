import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePatientRoutines } from '@/hooks/usePatientRoutines';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import {
  Shield,
  Check,
  Lock,
  Unlock,
  Pill,
  Sparkles,
  UtensilsCrossed,
} from 'lucide-react';

interface GateChecklistProps {
  patientId: string;
  onGateCleared?: () => void;
}

interface GateStep {
  id: string;
  label: string;
  is_optional: boolean;
  step_order: number;
  completed: boolean;
}

export function GateChecklist({ patientId, onGateCleared }: GateChecklistProps) {
  const { language } = useLanguage();
  const { organization } = useAuth();
  const [gateRoutineId, setGateRoutineId] = useState<string | null>(null);
  const [steps, setSteps] = useState<GateStep[]>([]);
  const [isCleared, setIsCleared] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const content = {
    he: {
      title: 'שגרת בוקר',
      subtitle: 'השלם את המשימות לפני שמתחילים את היום',
      cleared: 'הכל בסדר. אפשר להמשיך.',
      locked: 'השלם את המשימות החובה',
      optional: 'אופציונלי',
      required: 'חובה',
    },
    en: {
      title: 'Morning Gate',
      subtitle: 'Complete these before starting your day',
      cleared: 'All clear. You\'re good to go.',
      locked: 'Complete required tasks',
      optional: 'Optional',
      required: 'Required',
    },
  };

  const t = content[language];

  const getStepIcon = (label: string) => {
    const lowerLabel = label.toLowerCase();
    if (lowerLabel.includes('med') || lowerLabel.includes('תרופ')) return <Pill className="w-4 h-4" />;
    if (lowerLabel.includes('brush') || lowerLabel.includes('teeth') || lowerLabel.includes('שיני')) return <Sparkles className="w-4 h-4" />;
    if (lowerLabel.includes('dish') || lowerLabel.includes('kitchen') || lowerLabel.includes('כלים') || lowerLabel.includes('מטבח')) return <UtensilsCrossed className="w-4 h-4" />;
    return <Check className="w-4 h-4" />;
  };

  useEffect(() => {
    const fetchGateRoutine = async () => {
      if (!organization?.id || !patientId) {
        setIsLoading(false);
        return;
      }

      try {
        // Find gate routine
        const { data: gateRoutine } = await supabase
          .from('routines')
          .select('id')
          .eq('organization_id', organization.id)
          .eq('patient_id', patientId)
          .eq('type', 'gate')
          .eq('is_active', true)
          .single();

        if (!gateRoutine) {
          setIsLoading(false);
          return;
        }

        setGateRoutineId(gateRoutine.id);

        // Fetch steps
        const { data: stepsData } = await supabase
          .from('routine_steps')
          .select('id, label, is_optional, step_order')
          .eq('routine_id', gateRoutine.id)
          .order('step_order');

        if (!stepsData) {
          setIsLoading(false);
          return;
        }

        // Check completions for today
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const stepsWithCompletion = await Promise.all(
          stepsData.map(async (step) => {
            const { data: completion } = await supabase
              .from('routine_completions')
              .select('id')
              .eq('step_id', step.id)
              .eq('patient_id', patientId)
              .eq('completion_type', 'confirmed')
              .gte('completed_at', today.toISOString())
              .single();

            return {
              ...step,
              is_optional: step.is_optional ?? false,
              completed: !!completion,
            };
          })
        );

        setSteps(stepsWithCompletion);

        // Check if gate is cleared
        const allRequiredComplete = stepsWithCompletion
          .filter(s => !s.is_optional)
          .every(s => s.completed);
        
        setIsCleared(allRequiredComplete);
        if (allRequiredComplete) {
          onGateCleared?.();
        }
      } catch (err) {
        console.error('Error fetching gate routine:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGateRoutine();
  }, [organization?.id, patientId, onGateCleared]);

  const handleStepToggle = async (stepId: string, completed: boolean) => {
    if (!organization?.id || !gateRoutineId) return;

    if (completed) {
      // Mark as completed
      await supabase.from('routine_completions').insert({
        organization_id: organization.id,
        patient_id: patientId,
        routine_id: gateRoutineId,
        step_id: stepId,
        completion_type: 'confirmed',
      });
    } else {
      // Remove completion for today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      await supabase
        .from('routine_completions')
        .delete()
        .eq('step_id', stepId)
        .eq('patient_id', patientId)
        .gte('completed_at', today.toISOString());
    }

    // Update local state
    const updatedSteps = steps.map(s => 
      s.id === stepId ? { ...s, completed } : s
    );
    setSteps(updatedSteps);

    // Check if gate is now cleared
    const allRequiredComplete = updatedSteps
      .filter(s => !s.is_optional)
      .every(s => s.completed);
    
    setIsCleared(allRequiredComplete);
    if (allRequiredComplete) {
      onGateCleared?.();
    }
  };

  if (isLoading || !gateRoutineId) {
    return null;
  }

  return (
    <Card className={`border-2 transition-all ${
      isCleared 
        ? 'border-green-500/50 bg-green-500/5' 
        : 'border-amber-500/50 bg-amber-500/5'
    }`}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className={`w-5 h-5 ${isCleared ? 'text-green-500' : 'text-amber-500'}`} />
            <span className="text-foreground">{t.title}</span>
          </div>
          {isCleared ? (
            <Unlock className="w-5 h-5 text-green-500" />
          ) : (
            <Lock className="w-5 h-5 text-amber-500" />
          )}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {isCleared ? t.cleared : t.subtitle}
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {steps.map((step) => (
          <div
            key={step.id}
            className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
              step.completed 
                ? 'bg-green-500/10 border-green-500/30' 
                : 'bg-background border-border'
            }`}
          >
            <Checkbox
              id={step.id}
              checked={step.completed}
              onCheckedChange={(checked) => handleStepToggle(step.id, checked as boolean)}
              className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
            />
            <div className={`p-1.5 rounded ${step.completed ? 'bg-green-500/20' : 'bg-muted'}`}>
              {getStepIcon(step.label)}
            </div>
            <label
              htmlFor={step.id}
              className={`flex-1 cursor-pointer ${
                step.completed ? 'line-through text-muted-foreground' : 'text-foreground'
              }`}
            >
              {step.label}
            </label>
            <Badge variant={step.is_optional ? 'secondary' : 'default'} className="text-xs">
              {step.is_optional ? t.optional : t.required}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
