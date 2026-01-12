import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useHealITData } from '@/hooks/useHealITData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, User, FileText, Stethoscope, TestTube, MessageSquare, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface HealITQuickActionsProps {
  onEventCreated?: () => void;
}

export function HealITQuickActions({ onEventCreated }: HealITQuickActionsProps) {
  const { language } = useLanguage();
  const { patients, createPatient, createEvent } = useHealITData();
  const { toast } = useToast();
  
  const [isPatientDialogOpen, setIsPatientDialogOpen] = useState(false);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [newPatientName, setNewPatientName] = useState('');
  const [newPatientEmail, setNewPatientEmail] = useState('');
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [selectedEventType, setSelectedEventType] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const content = {
    he: {
      addPatient: 'הוסף מטופל',
      addEvent: 'הוסף אירוע',
      patientName: 'שם המטופל',
      patientEmail: 'אימייל',
      selectPatient: 'בחר מטופל',
      selectEventType: 'סוג האירוע',
      create: 'צור',
      cancel: 'ביטול',
      newPatient: 'מטופל חדש',
      newEvent: 'אירוע חדש',
      eventTypes: {
        referral: 'הפניה',
        lab_result: 'תוצאות מעבדה',
        discharge: 'שחרור מאשפוז',
        visit_note: 'סיכום ביקור',
        message: 'הודעה',
        appointment: 'תור',
      },
      success: {
        patient: 'מטופל נוסף בהצלחה',
        event: 'אירוע נוסף בהצלחה',
      },
      error: 'שגיאה',
    },
    en: {
      addPatient: 'Add Patient',
      addEvent: 'Add Event',
      patientName: 'Patient Name',
      patientEmail: 'Email',
      selectPatient: 'Select Patient',
      selectEventType: 'Event Type',
      create: 'Create',
      cancel: 'Cancel',
      newPatient: 'New Patient',
      newEvent: 'New Event',
      eventTypes: {
        referral: 'Referral',
        lab_result: 'Lab Result',
        discharge: 'Discharge',
        visit_note: 'Visit Note',
        message: 'Message',
        appointment: 'Appointment',
      },
      success: {
        patient: 'Patient added successfully',
        event: 'Event added successfully',
      },
      error: 'Error',
    },
  };

  const t = content[language];

  const eventTypeIcons: Record<string, React.ReactNode> = {
    referral: <Stethoscope className="w-4 h-4" />,
    lab_result: <TestTube className="w-4 h-4" />,
    discharge: <FileText className="w-4 h-4" />,
    visit_note: <FileText className="w-4 h-4" />,
    message: <MessageSquare className="w-4 h-4" />,
    appointment: <Calendar className="w-4 h-4" />,
  };

  const handleCreatePatient = async () => {
    if (!newPatientName.trim()) return;

    setIsSubmitting(true);
    try {
      await createPatient(newPatientName, newPatientEmail || undefined);
      toast({
        title: t.success.patient,
      });
      setNewPatientName('');
      setNewPatientEmail('');
      setIsPatientDialogOpen(false);
    } catch (err) {
      toast({
        variant: 'destructive',
        title: t.error,
        description: err instanceof Error ? err.message : 'Unknown error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateEvent = async () => {
    if (!selectedPatientId || !selectedEventType) return;

    setIsSubmitting(true);
    try {
      await createEvent(
        selectedPatientId,
        selectedEventType as any
      );
      toast({
        title: t.success.event,
      });
      setSelectedPatientId('');
      setSelectedEventType('');
      setIsEventDialogOpen(false);
      onEventCreated?.();
    } catch (err) {
      toast({
        variant: 'destructive',
        title: t.error,
        description: err instanceof Error ? err.message : 'Unknown error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-teal-200/50 dark:border-teal-700/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Plus className="w-4 h-4 text-teal-500" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Add Patient Dialog */}
        <Dialog open={isPatientDialogOpen} onOpenChange={setIsPatientDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full justify-start" size="sm">
              <User className="w-4 h-4 me-2 text-teal-500" />
              {t.addPatient}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t.newPatient}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="patientName">{t.patientName}</Label>
                <Input
                  id="patientName"
                  value={newPatientName}
                  onChange={(e) => setNewPatientName(e.target.value)}
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="patientEmail">{t.patientEmail}</Label>
                <Input
                  id="patientEmail"
                  type="email"
                  value={newPatientEmail}
                  onChange={(e) => setNewPatientEmail(e.target.value)}
                  placeholder="john@example.com"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsPatientDialogOpen(false)}>
                  {t.cancel}
                </Button>
                <Button 
                  onClick={handleCreatePatient} 
                  disabled={!newPatientName.trim() || isSubmitting}
                  className="bg-teal-600 hover:bg-teal-700"
                >
                  {t.create}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add Event Dialog */}
        <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full justify-start" size="sm">
              <FileText className="w-4 h-4 me-2 text-teal-500" />
              {t.addEvent}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t.newEvent}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>{t.selectPatient}</Label>
                <Select value={selectedPatientId} onValueChange={setSelectedPatientId}>
                  <SelectTrigger>
                    <SelectValue placeholder={t.selectPatient} />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{t.selectEventType}</Label>
                <Select value={selectedEventType} onValueChange={setSelectedEventType}>
                  <SelectTrigger>
                    <SelectValue placeholder={t.selectEventType} />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(t.eventTypes).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        <div className="flex items-center gap-2">
                          {eventTypeIcons[key]}
                          {label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEventDialogOpen(false)}>
                  {t.cancel}
                </Button>
                <Button 
                  onClick={handleCreateEvent} 
                  disabled={!selectedPatientId || !selectedEventType || isSubmitting}
                  className="bg-teal-600 hover:bg-teal-700"
                >
                  {t.create}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Patient count badge */}
        {patients.length > 0 && (
          <div className="pt-2">
            <Badge variant="secondary" className="text-xs">
              {patients.length} {language === 'he' ? 'מטופלים' : 'patients'}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
