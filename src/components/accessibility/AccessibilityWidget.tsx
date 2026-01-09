import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { 
  Accessibility, 
  Sun, 
  Moon, 
  Type, 
  Eye, 
  MousePointer,
  Link2,
  RotateCcw,
  X
} from 'lucide-react';

export function AccessibilityWidget() {
  const { language } = useLanguage();
  const { settings, updateSetting, resetSettings } = useAccessibility();
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const labels = {
    he: {
      title: 'נגישות',
      fontSize: 'גודל גופן',
      normal: 'רגיל',
      large: 'גדול',
      xlarge: 'גדול מאוד',
      highContrast: 'ניגודיות גבוהה',
      reducedMotion: 'הפחתת תנועה',
      linkHighlight: 'הדגשת קישורים',
      darkMode: 'מצב כהה',
      lightMode: 'מצב בהיר',
      reset: 'איפוס הגדרות',
      close: 'סגור',
    },
    en: {
      title: 'Accessibility',
      fontSize: 'Font Size',
      normal: 'Normal',
      large: 'Large',
      xlarge: 'X-Large',
      highContrast: 'High Contrast',
      reducedMotion: 'Reduce Motion',
      linkHighlight: 'Highlight Links',
      darkMode: 'Dark Mode',
      lightMode: 'Light Mode',
      reset: 'Reset Settings',
      close: 'Close',
    },
  };

  const t = labels[language];

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-6 start-6 z-50 w-14 h-14 rounded-full shadow-lg bg-primary text-primary-foreground hover:bg-primary/90 border-2 border-primary-foreground/20"
          aria-label={t.title}
        >
          <Accessibility className="w-6 h-6" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        side="top" 
        align="start" 
        className="w-80 p-0 bg-card border-border shadow-xl"
        sideOffset={12}
      >
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <Accessibility className="w-5 h-5 text-primary" />
            {t.title}
          </h3>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsOpen(false)}
            className="h-8 w-8"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-4 space-y-5">
          {/* Theme Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {theme === 'dark' ? (
                <Moon className="w-5 h-5 text-muted-foreground" />
              ) : (
                <Sun className="w-5 h-5 text-warning" />
              )}
              <span className="font-medium">
                {theme === 'dark' ? t.darkMode : t.lightMode}
              </span>
            </div>
            <Switch
              checked={theme === 'dark'}
              onCheckedChange={toggleTheme}
            />
          </div>

          {/* Font Size */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Type className="w-5 h-5 text-muted-foreground" />
              <span className="font-medium">{t.fontSize}</span>
            </div>
            <div className="flex gap-2">
              {(['normal', 'large', 'xlarge'] as const).map((size) => (
                <Button
                  key={size}
                  variant={settings.fontSize === size ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateSetting('fontSize', size)}
                  className="flex-1"
                >
                  {t[size]}
                </Button>
              ))}
            </div>
          </div>

          {/* High Contrast */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Eye className="w-5 h-5 text-muted-foreground" />
              <span className="font-medium">{t.highContrast}</span>
            </div>
            <Switch
              checked={settings.highContrast}
              onCheckedChange={(v) => updateSetting('highContrast', v)}
            />
          </div>

          {/* Reduced Motion */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MousePointer className="w-5 h-5 text-muted-foreground" />
              <span className="font-medium">{t.reducedMotion}</span>
            </div>
            <Switch
              checked={settings.reducedMotion}
              onCheckedChange={(v) => updateSetting('reducedMotion', v)}
            />
          </div>

          {/* Link Highlight */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link2 className="w-5 h-5 text-muted-foreground" />
              <span className="font-medium">{t.linkHighlight}</span>
            </div>
            <Switch
              checked={settings.linkHighlight}
              onCheckedChange={(v) => updateSetting('linkHighlight', v)}
            />
          </div>

          {/* Reset Button */}
          <Button
            variant="outline"
            className="w-full"
            onClick={resetSettings}
          >
            <RotateCcw className="w-4 h-4 me-2" />
            {t.reset}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
