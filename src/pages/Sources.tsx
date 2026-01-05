import { useState, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSources, Source, FileRecord } from '@/hooks/useSources';
import { usePermissions } from '@/hooks/usePermissions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';
import { he, enUS } from 'date-fns/locale';
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
  Loader2,
  File,
  Eye,
  Trash2,
  RefreshCw,
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
import { CanEdit } from '@/components/auth/RoleGuard';

const sourceTypes = [
  { id: 'spreadsheet', icon: FileSpreadsheet, labelHe: 'גיליון אלקטרוני', labelEn: 'Spreadsheet', color: 'text-success', bgColor: 'bg-success/10' },
  { id: 'file', icon: Image, labelHe: 'תמונה / OCR', labelEn: 'Image / OCR', color: 'text-info', bgColor: 'bg-info/10' },
  { id: 'api', icon: Link2, labelHe: 'חיבור API', labelEn: 'API Connection', color: 'text-primary', bgColor: 'bg-primary/10' },
  { id: 'database', icon: FileText, labelHe: 'מסד נתונים', labelEn: 'Database', color: 'text-destructive', bgColor: 'bg-destructive/10' },
];

const Sources = () => {
  const { t, language } = useLanguage();
  const { sources, files, isLoading, createSource, uploadFile, deleteSource, getFileUrl, refetch } = useSources();
  const { canEdit } = usePermissions();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedSourceType, setSelectedSourceType] = useState<string | null>(null);
  const [newSourceName, setNewSourceName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getSourceTypeInfo = (typeId: string) => sourceTypes.find((s) => s.id === typeId);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
      case 'processed':
        return <CheckCircle2 className="w-4 h-4 text-success" />;
      case 'processing':
      case 'pending':
        return <Clock className="w-4 h-4 text-warning animate-pulse" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-destructive" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      he: { active: 'פעיל', processing: 'בעיבוד', error: 'שגיאה', pending: 'ממתין', uploaded: 'הועלה', processed: 'עובד' },
      en: { active: 'Active', processing: 'Processing', error: 'Error', pending: 'Pending', uploaded: 'Uploaded', processed: 'Processed' },
    };
    return labels[language][status as keyof typeof labels.he] || status;
  };

  const formatTime = (dateString: string | null) => {
    if (!dateString) return language === 'he' ? 'לא סונכרן' : 'Never synced';
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: language === 'he' ? he : enUS,
      });
    } catch {
      return '';
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    await uploadFile(file);
    setIsUploading(false);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCreateSource = async () => {
    if (!selectedSourceType || !newSourceName.trim()) return;

    await createSource(newSourceName, selectedSourceType as Source['type']);
    setIsAddDialogOpen(false);
    setSelectedSourceType(null);
    setNewSourceName('');
  };

  const handleViewFile = async (storagePath: string) => {
    const url = await getFileUrl(storagePath);
    if (url) {
      window.open(url, '_blank');
    }
  };

  const filteredSources = sources.filter((source) =>
    source.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFiles = files.filter((file) =>
    file.originalName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    );
  }

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
        <div className="flex gap-3">
          <CanEdit resource="sources">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
              accept=".csv,.xlsx,.xls,.pdf,.png,.jpg,.jpeg,.json,.txt"
            />
            <Button 
              variant="outline" 
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              {isUploading ? (
                <Loader2 className="w-4 h-4 me-2 animate-spin" />
              ) : (
                <Upload className="w-4 h-4 me-2" />
              )}
              {language === 'he' ? 'העלה קובץ' : 'Upload File'}
            </Button>
          </CanEdit>
          <CanEdit resource="sources">
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
                {!selectedSourceType ? (
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    {sourceTypes.map((type) => (
                      <button
                        key={type.id}
                        className="flex flex-col items-center gap-3 p-6 rounded-xl bg-secondary/50 border border-border hover:border-primary/50 hover:bg-secondary transition-all"
                        onClick={() => setSelectedSourceType(type.id)}
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
                ) : (
                  <div className="space-y-4 mt-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        {language === 'he' ? 'שם המקור' : 'Source Name'}
                      </label>
                      <Input
                        value={newSourceName}
                        onChange={(e) => setNewSourceName(e.target.value)}
                        placeholder={language === 'he' ? 'הזינו שם...' : 'Enter name...'}
                      />
                    </div>
                    <div className="flex justify-between">
                      <Button variant="ghost" onClick={() => setSelectedSourceType(null)}>
                        {t('common.back')}
                      </Button>
                      <Button variant="hero" onClick={handleCreateSource} disabled={!newSourceName.trim()}>
                        {t('common.save')}
                      </Button>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </CanEdit>
        </div>
      </div>

      {/* Search & Refresh */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={language === 'he' ? 'חיפוש מקורות וקבצים...' : 'Search sources and files...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="ps-10 bg-secondary/50"
          />
        </div>
        <Button variant="outline" size="icon" onClick={refetch}>
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>

      {/* Sources Section */}
      {filteredSources.length > 0 && (
        <>
          <h2 className="text-lg font-semibold">
            {language === 'he' ? 'מקורות' : 'Sources'} ({filteredSources.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSources.map((source) => {
              const typeInfo = getSourceTypeInfo(source.type);
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
                        <DropdownMenuItem>
                          <Eye className="w-4 h-4 me-2" />
                          {t('common.view')}
                        </DropdownMenuItem>
                        <CanEdit resource="sources">
                          <DropdownMenuItem>{t('common.edit')}</DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => deleteSource(source.id)}
                          >
                            <Trash2 className="w-4 h-4 me-2" />
                            {t('common.delete')}
                          </DropdownMenuItem>
                        </CanEdit>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <h3 className="font-semibold mb-1 truncate">{source.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {source.recordCount.toLocaleString()} {language === 'he' ? 'רשומות' : 'records'}
                  </p>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(source.status)}
                      <span>{getStatusLabel(source.status)}</span>
                    </div>
                    <span className="text-muted-foreground">
                      {formatTime(source.lastSyncAt)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Files Section */}
      {filteredFiles.length > 0 && (
        <>
          <h2 className="text-lg font-semibold mt-8">
            {language === 'he' ? 'קבצים' : 'Files'} ({filteredFiles.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFiles.map((file) => {
              const isImage = file.mimeType.startsWith('image/');
              const isPdf = file.mimeType === 'application/pdf';
              const Icon = isImage ? Image : isPdf ? FileText : File;
              
              return (
                <div key={file.id} className="glass-card-hover p-5 group">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl ${isImage ? 'bg-info/10' : isPdf ? 'bg-destructive/10' : 'bg-secondary'} flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${isImage ? 'text-info' : isPdf ? 'text-destructive' : 'text-muted-foreground'}`} />
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewFile(file.storagePath)}>
                          <Eye className="w-4 h-4 me-2" />
                          {t('common.view')}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <h3 className="font-semibold mb-1 truncate" title={file.originalName}>
                    {file.originalName}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {formatBytes(file.sizeBytes)}
                    {file.ocrConfidence !== null && (
                      <span className="ms-2">
                        • OCR: {file.ocrConfidence.toFixed(0)}%
                      </span>
                    )}
                  </p>
                  {file.textDirection !== 'auto' && (
                    <p className="text-xs text-muted-foreground mb-2">
                      {language === 'he' ? 'כיוון טקסט:' : 'Text direction:'} {file.textDirection.toUpperCase()}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(file.status)}
                      <span>{getStatusLabel(file.status)}</span>
                    </div>
                    <span className="text-muted-foreground">
                      {formatTime(file.createdAt)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Empty state */}
      {filteredSources.length === 0 && filteredFiles.length === 0 && (
        <div className="glass-card p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Upload className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-2">
            {language === 'he' ? 'אין מקורות או קבצים' : 'No sources or files yet'}
          </h3>
          <p className="text-muted-foreground mb-6">
            {language === 'he'
              ? 'העלו קובץ או הוסיפו מקור נתונים כדי להתחיל'
              : 'Upload a file or add a data source to get started'}
          </p>
          <CanEdit resource="sources">
            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                <Upload className="w-4 h-4 me-2" />
                {language === 'he' ? 'העלה קובץ' : 'Upload File'}
              </Button>
              <Button variant="hero" onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="w-4 h-4 me-2" />
                {t('sources.add')}
              </Button>
            </div>
          </CanEdit>
        </div>
      )}
    </div>
  );
};

export default Sources;
