/**
 * AI Gift Assistant Component
 * Floating AI assistant for gift recommendations and insights
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  X,
  TrendingUp,
  Heart,
  Lightbulb,
  Calendar,
  Users,
  Zap,
  Gift,
  MessageCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { aiService, type GiftRecommendation, type SmartSuggestion } from '@/services/ai.service';
import { Progress } from '@/components/ui/progress';

interface AIGiftAssistantProps {
  userId: string;
  recipientId?: string;
  onGiftSelect?: (giftId: string, message?: string) => void;
  onClose?: () => void;
}

export function AIGiftAssistant({
  userId,
  recipientId,
  onGiftSelect,
  onClose,
}: AIGiftAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<GiftRecommendation[]>([]);
  const [suggestions, setSuggestions] = useState<SmartSuggestion[]>([]);
  const [activeTab, setActiveTab] = useState('recommendations');

  useEffect(() => {
    if (isOpen && recipientId) {
      loadRecommendations();
    }
  }, [isOpen, recipientId]);

  useEffect(() => {
    loadSuggestions();
  }, [userId]);

  const loadRecommendations = async () => {
    if (!recipientId) return;

    setIsLoading(true);
    try {
      const recs = await aiService.getGiftRecommendations(userId, recipientId);
      setRecommendations(recs);
    } catch (error) {
      console.error('Failed to load recommendations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadSuggestions = async () => {
    try {
      const suggs = await aiService.getSmartSuggestions(userId);
      setSuggestions(suggs.slice(0, 5));
    } catch (error) {
      console.error('Failed to load suggestions:', error);
    }
  };

  const handleGiftSelect = (giftId: string, suggestedMessage?: string) => {
    if (onGiftSelect) {
      onGiftSelect(giftId, suggestedMessage);
    }
    setIsOpen(false);
  };

  const handleClose = () => {
    setIsOpen(false);
    onClose?.();
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-500';
    if (confidence >= 0.6) return 'text-yellow-500';
    return 'text-orange-500';
  };

  return (
    <>
      {/* Floating Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        <Button
          size="lg"
          className="rounded-full w-16 h-16 shadow-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 relative group"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Sparkles className="w-6 h-6" />
          
          {/* Pulse Effect */}
          <span className="absolute inset-0 rounded-full bg-violet-400 opacity-0 group-hover:opacity-30 animate-ping" />
          
          {/* Notification Badge */}
          {suggestions.length > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-red-500 text-white px-2 py-1 text-xs">
              {suggestions.length}
            </Badge>
          )}
        </Button>
      </motion.div>

      {/* AI Assistant Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-24 right-6 z-50 w-96"
          >
            <Card className="bg-gray-900/95 backdrop-blur-xl border-gray-800 shadow-2xl">
              <CardHeader className="border-b border-gray-800">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Sparkles className="w-5 h-5 text-violet-400" />
                    AI Gift Assistant
                  </CardTitle>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={handleClose}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="w-full grid grid-cols-3 bg-gray-800/50">
                    <TabsTrigger value="recommendations" className="text-xs">
                      <Gift className="w-3 h-3 mr-1" />
                      For Them
                    </TabsTrigger>
                    <TabsTrigger value="suggestions" className="text-xs">
                      <Lightbulb className="w-3 h-3 mr-1" />
                      Ideas
                    </TabsTrigger>
                    <TabsTrigger value="insights" className="text-xs">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Trends
                    </TabsTrigger>
                  </TabsList>

                  {/* Recommendations Tab */}
                  <TabsContent value="recommendations" className="m-0">
                    <ScrollArea className="h-96">
                      {isLoading ? (
                        <div className="flex items-center justify-center h-96">
                          <div className="text-center space-y-3">
                            <Sparkles className="w-8 h-8 text-violet-400 animate-pulse mx-auto" />
                            <p className="text-sm text-gray-400">
                              Analyzing preferences...
                            </p>
                          </div>
                        </div>
                      ) : recommendations.length > 0 ? (
                        <div className="space-y-3 p-4">
                          {recommendations.map((rec, index) => (
                            <motion.div
                              key={rec.gift.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                            >
                              <Card className="bg-gray-800/50 border-gray-700 hover:border-violet-500 transition-all cursor-pointer group">
                                <CardContent className="p-3">
                                  <div className="flex items-start gap-3">
                                    <div className="text-4xl">{rec.gift.emoji}</div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center justify-between mb-1">
                                        <h4 className="text-white font-medium text-sm">
                                          {rec.gift.name}
                                        </h4>
                                        <Badge variant="outline" className="text-xs">
                                          ${rec.gift.value}
                                        </Badge>
                                      </div>
                                      
                                      <p className="text-xs text-gray-400 mb-2">
                                        {rec.reason}
                                      </p>

                                      {rec.occasion && (
                                        <Badge className="text-xs bg-violet-600 mb-2">
                                          <Calendar className="w-3 h-3 mr-1" />
                                          {rec.occasion}
                                        </Badge>
                                      )}

                                      {rec.suggestedMessage && (
                                        <div className="text-xs text-gray-500 italic mb-2 flex items-start gap-1">
                                          <MessageCircle className="w-3 h-3 mt-0.5" />
                                          <span className="flex-1">"{rec.suggestedMessage}"</span>
                                        </div>
                                      )}

                                      <div className="flex items-center gap-2 mt-2">
                                        <div className="flex-1">
                                          <div className="flex items-center justify-between mb-1">
                                            <span className="text-xs text-gray-500">
                                              Confidence
                                            </span>
                                            <span className={`text-xs font-medium ${getConfidenceColor(rec.confidence)}`}>
                                              {Math.round(rec.confidence * 100)}%
                                            </span>
                                          </div>
                                          <Progress
                                            value={rec.confidence * 100}
                                            className="h-1"
                                          />
                                        </div>
                                      </div>

                                      <Button
                                        size="sm"
                                        className="w-full mt-3 bg-violet-600 hover:bg-violet-700"
                                        onClick={() => handleGiftSelect(rec.gift.id, rec.suggestedMessage)}
                                      >
                                        <Zap className="w-3 h-3 mr-1" />
                                        Send Gift
                                      </Button>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-96">
                          <div className="text-center space-y-3">
                            <Gift className="w-8 h-8 text-gray-600 mx-auto" />
                            <p className="text-sm text-gray-500">
                              Select a recipient to see<br />personalized recommendations
                            </p>
                          </div>
                        </div>
                      )}
                    </ScrollArea>
                  </TabsContent>

                  {/* Smart Suggestions Tab */}
                  <TabsContent value="suggestions" className="m-0">
                    <ScrollArea className="h-96">
                      {suggestions.length > 0 ? (
                        <div className="space-y-3 p-4">
                          {suggestions.map((suggestion, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                            >
                              <Card className="bg-gray-800/50 border-gray-700 hover:border-violet-500 transition-all">
                                <CardContent className="p-3">
                                  <div className="flex items-start gap-3">
                                    <Users className="w-5 h-5 text-violet-400 mt-1" />
                                    <div className="flex-1">
                                      <div className="flex items-center justify-between mb-2">
                                        <Badge className="text-xs bg-purple-600">
                                          {suggestion.type}
                                        </Badge>
                                        <span className="text-xs text-gray-500">
                                          Priority: {suggestion.priority}%
                                        </span>
                                      </div>
                                      
                                      <h4 className="text-white font-medium text-sm mb-1">
                                        @{suggestion.recipient.username}
                                      </h4>
                                      
                                      <p className="text-xs text-gray-400 mb-3">
                                        {suggestion.recipient.reason}
                                      </p>

                                      <div className="flex items-center gap-2">
                                        {suggestion.gifts.slice(0, 3).map((gift) => (
                                          <div
                                            key={gift.gift.id}
                                            className="text-2xl"
                                            title={gift.gift.name}
                                          >
                                            {gift.gift.emoji}
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-96">
                          <div className="text-center space-y-3">
                            <Lightbulb className="w-8 h-8 text-gray-600 mx-auto" />
                            <p className="text-sm text-gray-500">
                              No suggestions at the moment.<br />
                              Keep gifting to unlock insights!
                            </p>
                          </div>
                        </div>
                      )}
                    </ScrollArea>
                  </TabsContent>

                  {/* Insights Tab */}
                  <TabsContent value="insights" className="m-0">
                    <ScrollArea className="h-96">
                      <div className="p-4 space-y-4">
                        <Card className="bg-gradient-to-br from-violet-900/50 to-purple-900/50 border-violet-700">
                          <CardContent className="p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <TrendingUp className="w-4 h-4 text-violet-400" />
                              <h4 className="text-white font-medium text-sm">
                                Trending Now
                              </h4>
                            </div>
                            <p className="text-xs text-gray-300">
                              🔥 Fire gifts are up 45% this week!
                            </p>
                          </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-blue-900/50 to-cyan-900/50 border-blue-700">
                          <CardContent className="p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Heart className="w-4 h-4 text-blue-400" />
                              <h4 className="text-white font-medium text-sm">
                                Your Stats
                              </h4>
                            </div>
                            <p className="text-xs text-gray-300">
                              You're in the top 15% of gifters this month! 🎉
                            </p>
                          </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 border-green-700">
                          <CardContent className="p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Zap className="w-4 h-4 text-green-400" />
                              <h4 className="text-white font-medium text-sm">
                                Quick Tip
                              </h4>
                            </div>
                            <p className="text-xs text-gray-300">
                              Best time to send gifts is 6-8 PM for maximum impact!
                            </p>
                          </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-orange-900/50 to-red-900/50 border-orange-700">
                          <CardContent className="p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Calendar className="w-4 h-4 text-orange-400" />
                              <h4 className="text-white font-medium text-sm">
                                Upcoming
                              </h4>
                            </div>
                            <p className="text-xs text-gray-300">
                              2 friends have birthdays coming up this week! 🎂
                            </p>
                          </CardContent>
                        </Card>
                      </div>
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
