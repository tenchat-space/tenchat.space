/**
 * AI Message Composer
 * Smart message enhancement and emoji suggestions
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Wand2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { aiService, type MessageEnhancement } from '@/services/ai.service';
import { toast } from 'sonner';

interface AIMessageComposerProps {
  message: string;
  giftType?: string;
  recipient?: string;
  occasion?: string;
  onMessageSelect?: (enhanced: string) => void;
}

export function AIMessageComposer({
  message,
  giftType = 'general',
  recipient = 'Friend',
  occasion,
  onMessageSelect,
}: AIMessageComposerProps) {
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhancement, setEnhancement] = useState<MessageEnhancement | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (message.trim().length > 3) {
      // Auto-enhance after a short delay
      const timer = setTimeout(() => {
        enhanceMessage();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const enhanceMessage = async () => {
    if (!message.trim() || message.length < 3) return;

    setIsEnhancing(true);
    try {
      const enhanced = await aiService.enhanceMessage(message, {
        giftType,
        recipient,
        occasion,
      });
      setEnhancement(enhanced);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Message enhancement failed:', error);
      toast.error('Failed to enhance message');
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleSuggestionSelect = (enhanced: string) => {
    onMessageSelect?.(enhanced);
    setShowSuggestions(false);
    toast.success('Message enhanced! ✨');
  };

  const getToneIcon = (tone: string) => {
    const icons: Record<string, string> = {
      friendly: '😊',
      formal: '🙏',
      playful: '🎉',
      heartfelt: '❤️',
      humorous: '😄',
    };
    return icons[tone] || '💬';
  };

  const getToneColor = (tone: string) => {
    const colors: Record<string, string> = {
      friendly: 'bg-blue-600',
      formal: 'bg-gray-600',
      playful: 'bg-purple-600',
      heartfelt: 'bg-pink-600',
      humorous: 'bg-yellow-600',
    };
    return colors[tone] || 'bg-gray-600';
  };

  if (!message.trim() || message.length < 3) {
    return null;
  }

  return (
    <AnimatePresence>
      {showSuggestions && enhancement && enhancement.suggestions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="mb-3"
        >
          <Card className="bg-gradient-to-r from-violet-900/50 to-purple-900/50 border-violet-700">
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-violet-400" />
                  <span className="text-sm font-medium text-white">
                    AI Enhanced Messages
                  </span>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={enhanceMessage}
                  disabled={isEnhancing}
                  className="h-7 text-xs text-violet-400 hover:text-violet-300"
                >
                  <RefreshCw className={`w-3 h-3 mr-1 ${isEnhancing ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>

              <div className="space-y-2">
                {enhancement.suggestions.map((suggestion, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <button
                      onClick={() => handleSuggestionSelect(suggestion.enhanced)}
                      className="w-full text-left p-2 rounded-lg bg-gray-800/50 hover:bg-gray-800 border border-gray-700 hover:border-violet-500 transition-all group"
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-lg flex-shrink-0">
                          {getToneIcon(suggestion.tone)}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className={`text-xs ${getToneColor(suggestion.tone)}`}>
                              {suggestion.tone}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {Math.round(suggestion.confidence * 100)}% match
                            </span>
                          </div>
                          <p className="text-sm text-white group-hover:text-violet-300 transition-colors">
                            {suggestion.enhanced}
                          </p>
                          {suggestion.emoji.length > 0 && (
                            <div className="flex items-center gap-1 mt-2">
                              {suggestion.emoji.map((emoji, i) => (
                                <span key={i} className="text-sm">
                                  {emoji}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <Wand2 className="w-4 h-4 text-violet-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </button>
                  </motion.div>
                ))}
              </div>

              <div className="mt-3 text-xs text-gray-500 text-center">
                Click any suggestion to use it
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Enhance Button (when no suggestions shown) */}
      {!showSuggestions && message.trim().length >= 3 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-2"
        >
          <Button
            size="sm"
            variant="outline"
            onClick={enhanceMessage}
            disabled={isEnhancing}
            className="w-full bg-violet-900/30 border-violet-700 text-violet-300 hover:bg-violet-900/50"
          >
            <Sparkles className={`w-3 h-3 mr-2 ${isEnhancing ? 'animate-pulse' : ''}`} />
            {isEnhancing ? 'Enhancing...' : 'Enhance with AI'}
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
