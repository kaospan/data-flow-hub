import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Plus,
  Search,
  FileSpreadsheet,
  Image,
  Video,
  Link2,
  FileText,
  MoreVertical,
  Upload,
  Clock,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const sourceTypes = [
  { id: 'spreadsheet', icon: FileSpreadsheet, labelHe: 'גיליון אלקטרוני', labelEn: 'Spreadsheet', color: 'text-success', bgColor: 'bg-success/10' },
  { id: 'image', icon: Image, labelHe: 'תמונה / OCR', labelEn: 'Image / OCR', color: 'text-info', bgColor: 'bg-info/10' },
  { id: 'video', icon: Video, labelHe: 'וידאו / תמלול', labelEn: 'Video / Transcript', color: 'text-warning', bgColor: 'bg-warning/10' },
  { id: 'api', icon: Link2, labelHe: 'חיבור API', labelEn: 'API Connection', color: 'text-primary', bgColor: 'bg-primary/10' },
  { id: 'document', icon: FileText, labelHe: 'מסמך PDF', labelEn: 'PDF Document', color: 'text-destructive', bgColor: 'bg-destructive/10' },
];

const existingSources = [
  { id: 1, name: 'sales_data.xlsx', type: 'spreadsheet', records: 1250, status: 'active', lastSync: '5 דקות' },
  { id: 2, name: 'invoice_scan.pdf', type: 'image', records: 45, status: 'processing', lastSync: '1 שעה' },
  { id: 3, name: 'customer_list.csv', type: 'spreadsheet', records: 892, status: 'active', lastSync: '2 שעות' },
  { id: 4, name: 'CRM API', type: 'api', records: 3420, status: 'active', lastSync: '10 דקות' },
  { id: 5, name: 'meeting_recording.mp4', type: 'video', records: 1, status: 'error', lastSync: '1 יום' },
];

const Sources = () => {
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const getSourceType = (typeId: string) => sourceTypes.find((s) => s.id === typeId);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle2 className="w-4 h-4 text-success" />;
      case 'processing':
        return <Clock className="w-4 h-4 text-warning animate-pulse" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-destructive" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      he: { active: 'פעיל', processing: 'בעיבוד', error: 'שגיאה' },
      en: { active: 'Active', processing: 'Processing', error: 'Error' },
    };
    return labels[language][status as keyof typeof labels.he];
  };

  const filteredSources = existingSources.filter((source) =>
    source.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">{t('sources.title')}</h1>
          <p className="text-muted-foreground mt-1">
            {language === 'he' ? 'נהלו את מקורות הנתונים שלכם' : 'Manage your data sources'}
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="hero">
              <Plus className="w-4 h-4 me-2" />
              {t('sources.add')}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {language === 'he' ? 'הוסף מקור נתונים חדש' : 'Add New Data Source'}
              </DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {sourceTypes.map((type) => (
                <button
                  key={type.id}
                  className="flex flex-col items-center gap-3 p-6 rounded-xl bg-secondary/50 border border-border hover:border-primary/50 hover:bg-secondary transition-all"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  <div className={`w-14 h-14 rounded-xl ${type.bgColor} flex items-center justify-center`}>
                    <type.icon className={`w-7 h-7 ${type.color}`} />
                  </div>
                  <span className="font-medium text-sm">
                    {language === 'he' ? type.labelHe : type.labelEn}
                  </span>
                </button>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder={language === 'he' ? 'חיפוש מקורות...' : 'Search sources...'}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="ps-10 bg-secondary/50"
        />
      </div>

      {/* Sources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSources.map((source) => {
          const typeInfo = getSourceType(source.type);
          return (
            <div key={source.id} className="glass-card-hover p-5 group">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${typeInfo?.bgColor} flex items-center justify-center`}>
                  {typeInfo && <typeInfo.icon className={`w-6 h-6 ${typeInfo.color}`} />}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>{t('common.view')}</DropdownMenuItem>
                    <DropdownMenuItem>{t('common.edit')}</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">{t('common.delete')}</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <h3 className="font-semibold mb-1 truncate">{source.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {source.records.toLocaleString()} {language === 'he' ? 'רשומות' : 'records'}
              </p>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  {getStatusIcon(source.status)}
                  <span>{getStatusLabel(source.status)}</span>
                </div>
                <span className="text-muted-foreground">
                  {language === 'he' ? `לפני ${source.lastSync}` : `${source.lastSync} ago`}
                </span>
              </div>
            </div>
          );
        })}

        {/* Empty state / Add new card */}
        <button
          onClick={() => setIsAddDialogOpen(true)}
          className="glass-card p-5 flex flex-col items-center justify-center gap-3 min-h-[180px] border-dashed hover:border-primary/50 transition-colors"
        >
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Upload className="w-6 h-6 text-primary" />
          </div>
          <span className="font-medium text-muted-foreground">
            {language === 'he' ? 'הוסף מקור חדש' : 'Add new source'}
          </span>
        </button>
      </div>
    </div>
  );
};

export default Sources;
