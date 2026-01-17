import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePatientRoutines } from '@/hooks/usePatientRoutines';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Pill, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface AddMedicationDialogProps {
  patientId: string;
}

const DAYS = [
  { value: 'sunday', he: 'ראשון', en: 'Sun' },
  { value: 'monday', he: 'שני', en: 'Mon' },
  { value: 'tuesday', he: 'שלישי', en: 'Tue' },
  { value: 'wednesday', he: 'רביעי', en: 'Wed' },
  { value: 'thursday', he: 'חמישי', en: 'Thu' },
  { value: 'friday', he: 'שישי', en: 'Fri' },
  { value: 'saturday', he: 'שבת', en: 'Sat' },
];

export function AddMedicationDialog({ patientId }: AddMedicationDialogProps) {
  const { language } = useLanguage();
  const { createMedicationRoutine, addMedication } = usePatientRoutines(patientId);
  
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [instructions, setInstructions] = useState('');
  const [scheduleTime, setScheduleTime] = useState('08:00');
  const [selectedDays, setSelectedDays] = useState<string[]>(
    DAYS.map(d => d.value) // All days by default
  );

  const content = {
    he: {
      title: 'הוסף תרופה',
      description: 'הוסף תרופה חדשה למעקב יומי',
      name: 'שם התרופה',
      namePlaceholder: 'לדוגמה: ריטלין',
      dosage: 'מינון',
      dosagePlaceholder: 'לדוגמה: 10 מ"ג',
      instructions: 'הוראות (מהרופא/רוקח)',
      instructionsPlaceholder: 'הוראות נטילה מהרופא או מתווית התרופה',
      scheduleTime: 'שעת תזכורת',
      days: 'ימים',
      add: 'הוסף תרופה',
      cancel: 'ביטול',
      success: 'התרופה נוספה בהצלחה',
      error: 'שגיאה בהוספת התרופה',
    },
    en: {
      title: 'Add Medication',
      description: 'Add a new medication for daily tracking',
      name: 'Medication Name',
      namePlaceholder: 'e.g., Ritalin',
      dosage: 'Dosage',
      dosagePlaceholder: 'e.g., 10mg',
      instructions: 'Instructions (from doctor/pharmacist)',
      instructionsPlaceholder: 'Instructions from your doctor or medication label',
      scheduleTime: 'Reminder Time',
      days: 'Days',
      add: 'Add Medication',
      cancel: 'Cancel',
      success: 'Medication added successfully',
      error: 'Error adding medication',
    },
  };

  const t = content[language];

  const handleDayToggle = (day: string) => {
    setSelectedDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  const handleSubmit = async () => {
    if (!name.trim()) return;
    
    setIsSubmitting(true);
    try {
      // Add medication record
      await addMedication(name, dosage, instructions);
      
      // Create routine with schedule
      await createMedicationRoutine(
        name,
        scheduleTime,
        selectedDays,
        { dosage, instructions }
      );

      toast.success(t.success);
      setOpen(false);
      
      // Reset form
      setName('');
      setDosage('');
      setInstructions('');
      setScheduleTime('08:00');
      setSelectedDays(DAYS.map(d => d.value));
    } catch (err) {
      console.error('Error adding medication:', err);
      toast.error(t.error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          <Pill className="w-4 h-4" />
          {t.title}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pill className="w-5 h-5 text-primary" />
            {t.title}
          </DialogTitle>
          <DialogDescription>{t.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="med-name">{t.name}</Label>
            <Input
              id="med-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t.namePlaceholder}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="med-dosage">{t.dosage}</Label>
            <Input
              id="med-dosage"
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
              placeholder={t.dosagePlaceholder}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="med-instructions">{t.instructions}</Label>
            <Textarea
              id="med-instructions"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder={t.instructionsPlaceholder}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="med-time" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {t.scheduleTime}
            </Label>
            <Input
              id="med-time"
              type="time"
              value={scheduleTime}
              onChange={(e) => setScheduleTime(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>{t.days}</Label>
            <div className="flex flex-wrap gap-2">
              {DAYS.map(day => (
                <label
                  key={day.value}
                  className={`
                    flex items-center justify-center px-3 py-2 rounded-md border cursor-pointer transition-colors
                    ${selectedDays.includes(day.value) 
                      ? 'bg-primary text-primary-foreground border-primary' 
                      : 'bg-background border-input hover:bg-muted'
                    }
                  `}
                >
                  <Checkbox
                    checked={selectedDays.includes(day.value)}
                    onCheckedChange={() => handleDayToggle(day.value)}
                    className="sr-only"
                  />
                  <span className="text-sm font-medium">
                    {language === 'he' ? day.he : day.en}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            {t.cancel}
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!name.trim() || isSubmitting}
          >
            {t.add}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
