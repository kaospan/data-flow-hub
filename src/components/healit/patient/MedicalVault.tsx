import { useState, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePatientDashboard, MedicalItem } from '@/hooks/usePatientDashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import {
  FileText,
  Image as ImageIcon,
  StickyNote,
  Upload,
  Camera,
  Search,
  Calendar,
  Tag,
  Plus,
  Eye,
  Download,
  X,
  RefreshCw
} from 'lucide-react';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import { toast } from 'sonner';

interface MedicalVaultProps {
  patientId: string;
}

export function MedicalVault({ patientId }: MedicalVaultProps) {
  const { language } = useLanguage();
  const { medicalItems, isLoading, uploadMedicalItem, addMedicalNote, searchMedicalItems } = usePatientDashboard(patientId);
  
  const [searchText, setSearchText] = useState('');
  const [filterKind, setFilterKind] = useState<string>('all');
  const [isUploading, setIsUploading] = useState(false);
  const [showAddNote, setShowAddNote] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteTags, setNoteTags] = useState('');
  const [previewItem, setPreviewItem] = useState<MedicalItem | null>(null);
  const [searchResults, setSearchResults] = useState<MedicalItem[] | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const content = {
    he: {
      title: 'כספת רפואית',
      tabs: { all: 'הכל', documents: 'מסמכים', images: 'תמונות', notes: 'הערות' },
      upload: 'העלה קובץ',
      camera: 'צלם',
      addNote: 'הוסף הערה',
      search: 'חיפוש...',
      noItems: 'אין פריטים',
      uploading: 'מעלה...',
      noteTitle: 'כותרת',
      noteContent: 'תוכן',
      tags: 'תגיות (מופרד בפסיק)',
      save: 'שמור',
      cancel: 'בטל',
      preview: 'תצוגה מקדימה',
      download: 'הורד',
    },
    en: {
      title: 'Medical Vault',
      tabs: { all: 'All', documents: 'Documents', images: 'Images', notes: 'Notes' },
      upload: 'Upload File',
      camera: 'Camera',
      addNote: 'Add Note',
      search: 'Search...',
      noItems: 'No items',
      uploading: 'Uploading...',
      noteTitle: 'Title',
      noteContent: 'Content',
      tags: 'Tags (comma separated)',
      save: 'Save',
      cancel: 'Cancel',
      preview: 'Preview',
      download: 'Download',
    },
  };

  const t = content[language];
  const locale = language === 'he' ? he : undefined;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, kind: 'document' | 'image') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      await uploadMedicalItem(file, file.name, kind);
      toast.success(language === 'he' ? 'הקובץ הועלה בהצלחה' : 'File uploaded successfully');
    } catch (err) {
      console.error('Upload error:', err);
      toast.error(language === 'he' ? 'שגיאה בהעלאה' : 'Upload failed');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
      if (cameraInputRef.current) cameraInputRef.current.value = '';
    }
  };

  const handleAddNote = async () => {
    if (!noteTitle.trim()) return;

    try {
      const tags = noteTags.split(',').map(t => t.trim()).filter(Boolean);
      await addMedicalNote(noteTitle, noteContent, tags);
      toast.success(language === 'he' ? 'ההערה נשמרה' : 'Note saved');
      setShowAddNote(false);
      setNoteTitle('');
      setNoteContent('');
      setNoteTags('');
    } catch (err) {
      console.error('Add note error:', err);
      toast.error(language === 'he' ? 'שגיאה בשמירה' : 'Failed to save');
    }
  };

  const handleSearch = async () => {
    if (!searchText.trim()) {
      setSearchResults(null);
      return;
    }
    const results = await searchMedicalItems(searchText, filterKind === 'all' ? undefined : filterKind);
    setSearchResults(results);
  };

  const displayItems = searchResults || medicalItems;
  const filteredItems = filterKind === 'all' 
    ? displayItems 
    : displayItems.filter(item => item.kind === filterKind);

  const getKindIcon = (kind: string) => {
    switch (kind) {
      case 'document': return <FileText className="w-4 h-4" />;
      case 'image': return <ImageIcon className="w-4 h-4" />;
      case 'note': return <StickyNote className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with actions */}
      <div className="flex flex-wrap gap-2">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={t.search}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="ps-9"
          />
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx,.txt"
          className="hidden"
          onChange={(e) => handleFileUpload(e, 'document')}
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => handleFileUpload(e, 'image')}
        />
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          {isUploading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4 me-1" />}
          {t.upload}
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => cameraInputRef.current?.click()}
          disabled={isUploading}
        >
          <Camera className="w-4 h-4 me-1" />
          {t.camera}
        </Button>
        
        <Dialog open={showAddNote} onOpenChange={setShowAddNote}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4 me-1" />
              {t.addNote}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t.addNote}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>{t.noteTitle}</Label>
                <Input
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                />
              </div>
              <div>
                <Label>{t.noteContent}</Label>
                <Textarea
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  rows={4}
                />
              </div>
              <div>
                <Label>{t.tags}</Label>
                <Input
                  value={noteTags}
                  onChange={(e) => setNoteTags(e.target.value)}
                  placeholder="medication, lab, appointment"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowAddNote(false)}>
                  {t.cancel}
                </Button>
                <Button onClick={handleAddNote}>
                  {t.save}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filter tabs */}
      <Tabs value={filterKind} onValueChange={setFilterKind}>
        <TabsList className="w-full">
          <TabsTrigger value="all" className="flex-1">{t.tabs.all}</TabsTrigger>
          <TabsTrigger value="document" className="flex-1">
            <FileText className="w-4 h-4 me-1" />
            {t.tabs.documents}
          </TabsTrigger>
          <TabsTrigger value="image" className="flex-1">
            <ImageIcon className="w-4 h-4 me-1" />
            {t.tabs.images}
          </TabsTrigger>
          <TabsTrigger value="note" className="flex-1">
            <StickyNote className="w-4 h-4 me-1" />
            {t.tabs.notes}
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Items list */}
      <ScrollArea className="h-[400px]">
        {filteredItems.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>{t.noItems}</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredItems.map((item) => (
              <Card 
                key={item.id} 
                className="cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => setPreviewItem(item)}
              >
                <CardContent className="p-3">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      item.kind === 'document' ? 'bg-blue-500/10 text-blue-500' :
                      item.kind === 'image' ? 'bg-green-500/10 text-green-500' :
                      'bg-yellow-500/10 text-yellow-500'
                    }`}>
                      {getKindIcon(item.kind)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-foreground truncate">{item.title}</h4>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <Calendar className="w-3 h-3" />
                        <span>{format(new Date(item.created_at), 'dd/MM/yyyy HH:mm', { locale })}</span>
                      </div>
                      {item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {item.tags.slice(0, 3).map((tag, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              <Tag className="w-2.5 h-2.5 me-1" />
                              {tag}
                            </Badge>
                          ))}
                          {item.tags.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{item.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                    <Button variant="ghost" size="icon" className="shrink-0">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Preview dialog */}
      <Dialog open={!!previewItem} onOpenChange={() => setPreviewItem(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {previewItem && getKindIcon(previewItem.kind)}
              {previewItem?.title}
            </DialogTitle>
          </DialogHeader>
          {previewItem && (
            <div className="space-y-4">
              {previewItem.kind === 'image' && previewItem.storage_url && (
                <img 
                  src={previewItem.storage_url} 
                  alt={previewItem.title}
                  className="max-w-full max-h-[400px] object-contain rounded-lg mx-auto"
                />
              )}
              {previewItem.kind === 'note' && previewItem.extracted_text && (
                <div className="bg-muted p-4 rounded-lg whitespace-pre-wrap">
                  {previewItem.extracted_text}
                </div>
              )}
              {previewItem.kind === 'document' && previewItem.storage_url && (
                <div className="text-center py-8">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <a 
                    href={previewItem.storage_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {t.download}
                  </a>
                </div>
              )}
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{format(new Date(previewItem.created_at), 'PPpp', { locale })}</span>
                {previewItem.tags.length > 0 && (
                  <div className="flex gap-1">
                    {previewItem.tags.map((tag, i) => (
                      <Badge key={i} variant="outline" className="text-xs">{tag}</Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
