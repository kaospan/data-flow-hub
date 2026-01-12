import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useHealITChat } from '@/hooks/useHealITChat';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Send, Bot, User, Loader2, AlertCircle, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HealITChatPanelProps {
  patientId?: string;
  organizationId?: string;
  onFollowupsExtracted?: (followups: any[]) => void;
}

export function HealITChatPanel({ 
  patientId, 
  organizationId, 
  onFollowupsExtracted 
}: HealITChatPanelProps) {
  const { language } = useLanguage();
  const { messages, isLoading, error, sendMessage, clearMessages, extractFollowups } = useHealITChat();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const content = {
    he: {
      placeholder: 'תאר את המצב או ההוראה הרפואית...',
      send: 'שלח',
      clear: 'נקה שיחה',
      typing: 'מקליד...',
      error: 'שגיאה',
      welcome: 'שלום! אני העוזר למעקב רפואי. ספר לי על הפניות, בדיקות, או כל דבר שצריך מעקב.',
      examples: [
        'הפניה לקרדיולוג לפני שבוע',
        'תוצאות בדיקת דם - כולסטרול גבוה',
        'שחרור מאשפוז לפני 3 ימים',
      ],
    },
    en: {
      placeholder: 'Describe the situation or medical instruction...',
      send: 'Send',
      clear: 'Clear Chat',
      typing: 'Typing...',
      error: 'Error',
      welcome: "Hi! I'm your follow-up tracking assistant. Tell me about referrals, tests, or anything that needs tracking.",
      examples: [
        'Cardiology referral a week ago',
        'Blood test results - high cholesterol',
        'Discharged from hospital 3 days ago',
      ],
    },
  };

  const t = content[language];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userInput = input;
    setInput('');

    const response = await sendMessage(userInput, { patientId, organizationId });
    
    if (response && onFollowupsExtracted) {
      const followups = extractFollowups(response);
      if (followups.length > 0) {
        onFollowupsExtracted(followups);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleExampleClick = (example: string) => {
    setInput(example);
  };

  return (
    <Card className="flex flex-col h-[600px] bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-teal-200/50 dark:border-teal-700/50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/50">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">HealIT Assistant</h3>
            <p className="text-xs text-muted-foreground">
              {isLoading ? t.typing : 'Follow-up Tracker'}
            </p>
          </div>
        </div>
        {messages.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clearMessages}>
            {t.clear}
          </Button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <Sparkles className="w-12 h-12 mx-auto text-teal-500 mb-4" />
            <p className="text-muted-foreground mb-6">{t.welcome}</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {t.examples.map((example, i) => (
                <button
                  key={i}
                  onClick={() => handleExampleClick(example)}
                  className="px-3 py-2 text-sm rounded-lg bg-muted hover:bg-muted/80 transition-colors text-foreground"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div
              key={i}
              className={cn(
                'flex gap-3',
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
              <div
                className={cn(
                  'max-w-[80%] rounded-2xl px-4 py-3',
                  msg.role === 'user'
                    ? 'bg-teal-600 text-white rounded-br-md'
                    : 'bg-muted text-foreground rounded-bl-md'
                )}
              >
                <p className="whitespace-pre-wrap text-sm">{msg.content || (isLoading && i === messages.length - 1 ? '...' : '')}</p>
              </div>
              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                </div>
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Error */}
      {error && (
        <div className="px-4 pb-2">
          <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 rounded-lg px-3 py-2">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-border/50">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t.placeholder}
            className="min-h-[44px] max-h-32 resize-none bg-muted/50"
            disabled={isLoading}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}
