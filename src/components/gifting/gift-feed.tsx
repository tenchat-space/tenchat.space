/**
 * Gift Feed Component
 * Instagram/TikTok-style social feed for public gifts
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Heart,
  MessageCircle,
  Share2,
  TrendingUp,
  Fire,
  Clock,
  Users,
  Sparkles,
  Crown,
  Zap,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatDistanceToNow } from 'date-fns';

interface GiftPost {
  id: string;
  giftId: string;
  giftName: string;
  giftEmoji: string;
  giftValue: number;
  giftRarity: 'common' | 'rare' | 'epic' | 'legendary';
  sender: {
    id: string;
    username: string;
    avatar?: string;
    verified?: boolean;
  };
  receiver: {
    id: string;
    username: string;
    avatar?: string;
    verified?: boolean;
  };
  message?: string;
  timestamp: Date;
  isPublic: boolean;
  reactions: {
    likes: number;
    fires: number;
    hearts: number;
  };
  comments: number;
  shares: number;
  trending?: boolean;
  occasion?: string;
}

interface GiftFeedProps {
  feedType?: 'global' | 'friends' | 'trending' | 'following';
  onGiftClick?: (giftId: string) => void;
  onUserClick?: (userId: string) => void;
}

export function GiftFeed({ 
  feedType = 'global',
  onGiftClick,
  onUserClick,
}: GiftFeedProps) {
  const [posts, setPosts] = useState<GiftPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(feedType);

  useEffect(() => {
    loadFeed(activeTab);
  }, [activeTab]);

  const loadFeed = async (type: string) => {
    setLoading(true);
    try {
      // Mock data - in production, fetch from API
      const mockPosts: GiftPost[] = [
        {
          id: '1',
          giftId: 'diamond_ring',
          giftName: 'Diamond Ring',
          giftEmoji: '💍',
          giftValue: 100,
          giftRarity: 'legendary',
          sender: {
            id: 'user1',
            username: 'crypto_whale',
            verified: true,
          },
          receiver: {
            id: 'user2',
            username: 'lucky_person',
          },
          message: 'For always being there! 💕',
          timestamp: new Date(Date.now() - 1000 * 60 * 5),
          isPublic: true,
          reactions: {
            likes: 1234,
            fires: 567,
            hearts: 890,
          },
          comments: 45,
          shares: 23,
          trending: true,
          occasion: 'anniversary',
        },
        {
          id: '2',
          giftId: 'rocket',
          giftName: 'Rocket',
          giftEmoji: '🚀',
          giftValue: 15,
          giftRarity: 'rare',
          sender: {
            id: 'user3',
            username: 'hodler',
          },
          receiver: {
            id: 'user4',
            username: 'diamond_hands',
          },
          message: 'To the moon! 🌙',
          timestamp: new Date(Date.now() - 1000 * 60 * 30),
          isPublic: true,
          reactions: {
            likes: 456,
            fires: 234,
            hearts: 123,
          },
          comments: 12,
          shares: 8,
        },
      ];
      
      setPosts(mockPosts);
    } catch (error) {
      console.error('Failed to load feed:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRarityColor = (rarity: string) => {
    const colors = {
      common: 'text-gray-400',
      rare: 'text-blue-400',
      epic: 'text-purple-400',
      legendary: 'text-yellow-400',
    };
    return colors[rarity as keyof typeof colors] || colors.common;
  };

  const getRarityBg = (rarity: string) => {
    const colors = {
      common: 'bg-gray-600',
      rare: 'bg-blue-600',
      epic: 'bg-purple-600',
      legendary: 'bg-yellow-600',
    };
    return colors[rarity as keyof typeof colors] || colors.common;
  };

  const handleReaction = (postId: string, type: 'like' | 'fire' | 'heart') => {
    // Handle reaction
    console.log('Reaction:', postId, type);
  };

  const handleComment = (postId: string) => {
    // Open comment dialog
    console.log('Comment on:', postId);
  };

  const handleShare = (postId: string) => {
    // Share functionality
    console.log('Share:', postId);
  };

  return (
    <div className="h-full flex flex-col">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full grid grid-cols-4 bg-gray-800">
          <TabsTrigger value="global">
            <Users className="w-4 h-4 mr-2" />
            Global
          </TabsTrigger>
          <TabsTrigger value="friends">
            <Heart className="w-4 h-4 mr-2" />
            Friends
          </TabsTrigger>
          <TabsTrigger value="trending">
            <TrendingUp className="w-4 h-4 mr-2" />
            Trending
          </TabsTrigger>
          <TabsTrigger value="following">
            <Sparkles className="w-4 h-4 mr-2" />
            Following
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="flex-1 m-0">
          <ScrollArea className="h-[calc(100vh-12rem)]">
            <div className="space-y-4 p-4">
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <Sparkles className="w-8 h-8 text-violet-400 animate-pulse" />
                </div>
              ) : posts.length > 0 ? (
                posts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-all overflow-hidden">
                      {/* Post Header */}
                      <div className="p-4 border-b border-gray-800">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar
                              className="cursor-pointer ring-2 ring-violet-600"
                              onClick={() => onUserClick?.(post.sender.id)}
                            >
                              <AvatarImage src={post.sender.avatar} />
                              <AvatarFallback>
                                {post.sender.username[0].toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => onUserClick?.(post.sender.id)}
                                  className="text-white font-medium hover:text-violet-400 transition-colors"
                                >
                                  @{post.sender.username}
                                </button>
                                {post.sender.verified && (
                                  <Badge className="bg-blue-600 text-xs px-1.5 py-0">
                                    ✓
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <span>sent to</span>
                                <button
                                  onClick={() => onUserClick?.(post.receiver.id)}
                                  className="text-violet-400 hover:text-violet-300"
                                >
                                  @{post.receiver.username}
                                </button>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {post.trending && (
                              <Badge className="bg-orange-600">
                                <Fire className="w-3 h-3 mr-1" />
                                Trending
                              </Badge>
                            )}
                            <span className="text-xs text-gray-500">
                              <Clock className="w-3 h-3 inline mr-1" />
                              {formatDistanceToNow(post.timestamp, { addSuffix: true })}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Gift Display */}
                      <div 
                        className="relative bg-gradient-to-br from-gray-800 to-gray-900 p-12 cursor-pointer group"
                        onClick={() => onGiftClick?.(post.giftId)}
                      >
                        {/* Background glow effect */}
                        <div className={`absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity ${
                          post.giftRarity === 'legendary' ? 'bg-yellow-500' :
                          post.giftRarity === 'epic' ? 'bg-purple-500' :
                          post.giftRarity === 'rare' ? 'bg-blue-500' :
                          'bg-gray-500'
                        }`} />

                        <div className="relative text-center">
                          <motion.div
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                            className="text-8xl mb-4"
                          >
                            {post.giftEmoji}
                          </motion.div>
                          
                          <h3 className={`text-2xl font-bold mb-2 ${getRarityColor(post.giftRarity)}`}>
                            {post.giftName}
                          </h3>
                          
                          <div className="flex items-center justify-center gap-2">
                            <Badge className={`${getRarityBg(post.giftRarity)} text-white`}>
                              {post.giftRarity === 'legendary' && <Crown className="w-3 h-3 mr-1" />}
                              {post.giftRarity === 'epic' && <Zap className="w-3 h-3 mr-1" />}
                              {post.giftRarity.toUpperCase()}
                            </Badge>
                            <Badge variant="outline" className="text-white">
                              ${post.giftValue}
                            </Badge>
                            {post.occasion && (
                              <Badge className="bg-violet-600">
                                {post.occasion}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Message */}
                      {post.message && (
                        <div className="px-4 py-3 border-b border-gray-800">
                          <p className="text-white text-sm">{post.message}</p>
                        </div>
                      )}

                      {/* Actions */}
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-4">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleReaction(post.id, 'like')}
                              className="text-gray-400 hover:text-red-500"
                            >
                              <Heart className="w-4 h-4 mr-1" />
                              {post.reactions.likes}
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleReaction(post.id, 'fire')}
                              className="text-gray-400 hover:text-orange-500"
                            >
                              <Fire className="w-4 h-4 mr-1" />
                              {post.reactions.fires}
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleComment(post.id)}
                              className="text-gray-400 hover:text-blue-500"
                            >
                              <MessageCircle className="w-4 h-4 mr-1" />
                              {post.comments}
                            </Button>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleShare(post.id)}
                            className="text-gray-400 hover:text-violet-500"
                          >
                            <Share2 className="w-4 h-4 mr-1" />
                            {post.shares}
                          </Button>
                        </div>

                        {/* Quick reactions */}
                        <div className="flex items-center gap-2 pt-2 border-t border-gray-800">
                          <span className="text-xs text-gray-500">Quick react:</span>
                          {['❤️', '🔥', '🎉', '👏', '😍'].map((emoji) => (
                            <button
                              key={emoji}
                              className="text-lg hover:scale-125 transition-transform"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              ) : (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <Sparkles className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500">No gifts to show yet</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Be the first to send a public gift!
                    </p>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
