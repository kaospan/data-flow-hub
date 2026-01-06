import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

interface MixedTextProps {
  children: React.ReactNode;
  className?: string;
  as?: 'span' | 'div' | 'p';
}

/**
 * Component for handling mixed LTR/RTL content
 * Automatically detects and applies proper text direction
 */
export function MixedText({ children, className, as: Component = 'span' }: MixedTextProps) {
  return (
    <Component 
      className={cn('unicode-bidi-isolate', className)}
      style={{ unicodeBidi: 'isolate' }}
    >
      {children}
    </Component>
  );
}

interface BidiTextProps {
  text: string;
  className?: string;
  forceDirection?: 'ltr' | 'rtl' | 'auto';
}

/**
 * Smart bidirectional text component
 * Detects Hebrew/Arabic characters and applies appropriate direction
 */
export function BidiText({ text, className, forceDirection }: BidiTextProps) {
  const detectDirection = (str: string): 'ltr' | 'rtl' => {
    // Check for Hebrew or Arabic characters
    const rtlPattern = /[\u0590-\u05FF\u0600-\u06FF\u0750-\u077F]/;
    return rtlPattern.test(str) ? 'rtl' : 'ltr';
  };

  const direction = forceDirection === 'auto' || !forceDirection 
    ? detectDirection(text) 
    : forceDirection;

  return (
    <span 
      className={className}
      dir={direction}
      style={{ unicodeBidi: 'isolate' }}
    >
      {text}
    </span>
  );
}

interface MonospacePreviewProps {
  content: string;
  className?: string;
  maxLines?: number;
}

/**
 * Monospace preview for tables and structured data
 * Preserves formatting and handles mixed direction content
 */
export function MonospacePreview({ content, className, maxLines = 10 }: MonospacePreviewProps) {
  const { language } = useLanguage();
  
  const lines = content.split('\n').slice(0, maxLines);
  const hasMore = content.split('\n').length > maxLines;

  return (
    <div className={cn('relative', className)}>
      <pre 
        className="font-mono text-xs bg-secondary/50 p-4 rounded-lg overflow-x-auto whitespace-pre"
        dir="ltr" // Tables should always be LTR for consistent alignment
        style={{ 
          unicodeBidi: 'isolate',
          tabSize: 4,
        }}
      >
        {lines.map((line, index) => (
          <div key={index} className="min-w-0">
            {/* Wrap each cell value to handle RTL content within LTR table */}
            <BidiText text={line} forceDirection="auto" />
          </div>
        ))}
      </pre>
      {hasMore && (
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-secondary/80 to-transparent flex items-end justify-center pb-1">
          <span className="text-xs text-muted-foreground">
            {language === 'he' ? `עוד ${content.split('\n').length - maxLines} שורות...` : `${content.split('\n').length - maxLines} more lines...`}
          </span>
        </div>
      )}
    </div>
  );
}

interface SpreadsheetPreviewProps {
  data: string[][];
  className?: string;
  maxRows?: number;
  maxCols?: number;
}

/**
 * Preview component for spreadsheet data
 * Handles Hebrew column headers and mixed content
 */
export function SpreadsheetPreview({ 
  data, 
  className, 
  maxRows = 10, 
  maxCols = 5 
}: SpreadsheetPreviewProps) {
  const { language } = useLanguage();
  
  const displayData = data.slice(0, maxRows).map(row => row.slice(0, maxCols));
  const hasMoreRows = data.length > maxRows;
  const hasMoreCols = data[0]?.length > maxCols;

  if (data.length === 0) {
    return (
      <div className={cn('text-center py-4 text-muted-foreground', className)}>
        {language === 'he' ? 'אין נתונים להצגה' : 'No data to display'}
      </div>
    );
  }

  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="w-full border-collapse font-mono text-xs" dir="ltr">
        <thead>
          <tr className="bg-secondary/70">
            {displayData[0]?.map((header, colIndex) => (
              <th 
                key={colIndex} 
                className="border border-border/50 px-3 py-2 text-start font-semibold"
              >
                <BidiText text={header || ''} forceDirection="auto" />
              </th>
            ))}
            {hasMoreCols && (
              <th className="border border-border/50 px-3 py-2 text-muted-foreground">
                ...
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {displayData.slice(1).map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-secondary/30">
              {row.map((cell, colIndex) => (
                <td 
                  key={colIndex} 
                  className="border border-border/50 px-3 py-2"
                >
                  <BidiText text={cell || ''} forceDirection="auto" />
                </td>
              ))}
              {hasMoreCols && (
                <td className="border border-border/50 px-3 py-2 text-muted-foreground">
                  ...
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {hasMoreRows && (
        <div className="text-center py-2 text-xs text-muted-foreground border-x border-b border-border/50 bg-secondary/30">
          {language === 'he' 
            ? `עוד ${data.length - maxRows} שורות...` 
            : `${data.length - maxRows} more rows...`}
        </div>
      )}
    </div>
  );
}

interface OCRConfidenceIndicatorProps {
  confidence: number;
  className?: string;
}

/**
 * Visual indicator for OCR confidence level
 */
export function OCRConfidenceIndicator({ confidence, className }: OCRConfidenceIndicatorProps) {
  const { language } = useLanguage();
  
  const getConfidenceColor = (conf: number) => {
    if (conf >= 90) return 'text-success bg-success/10';
    if (conf >= 70) return 'text-warning bg-warning/10';
    return 'text-destructive bg-destructive/10';
  };

  const getConfidenceLabel = (conf: number) => {
    if (conf >= 90) return language === 'he' ? 'גבוה' : 'High';
    if (conf >= 70) return language === 'he' ? 'בינוני' : 'Medium';
    return language === 'he' ? 'נמוך' : 'Low';
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className={cn('px-2 py-0.5 rounded-full text-xs font-medium', getConfidenceColor(confidence))}>
        {confidence.toFixed(0)}%
      </div>
      <span className="text-xs text-muted-foreground">
        {getConfidenceLabel(confidence)}
      </span>
    </div>
  );
}
