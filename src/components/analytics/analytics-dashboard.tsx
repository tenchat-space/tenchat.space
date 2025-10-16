/**
 * Analytics Dashboard Component
 * Comprehensive gifting analytics and insights
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Gift,
  Users,
  Calendar,
  Award,
  Target,
  Zap,
  Crown,
  Activity,
  BarChart3,
  PieChart,
  LineChart,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AnalyticsDashboardProps {
  userId: string;
  timeRange?: '7d' | '30d' | '90d' | 'all';
}

interface Stats {
  totalGiftsSent: number;
  totalGiftsReceived: number;
  totalValueSent: number;
  totalValueReceived: number;
  uniqueRecipients: number;
  uniqueSenders: number;
  averageGiftValue: number;
  mostPopularGift: string;
  currentStreak: number;
  longestStreak: number;
  rank: number;
  totalUsers: number;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  progress: number;
  target: number;
  unlocked: boolean;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  reward?: string;
}

export function AnalyticsDashboard({ userId, timeRange = '30d' }: AnalyticsDashboardProps) {
  const [stats, setStats] = useState<Stats>({
    totalGiftsSent: 42,
    totalGiftsReceived: 38,
    totalValueSent: 520,
    totalValueReceived: 480,
    uniqueRecipients: 15,
    uniqueSenders: 12,
    averageGiftValue: 12.4,
    mostPopularGift: '❤️ Heart',
    currentStreak: 7,
    longestStreak: 14,
    rank: 234,
    totalUsers: 10000,
  });

  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: 'first_gift',
      name: 'First Steps',
      description: 'Send your first gift',
      icon: '🎁',
      progress: 1,
      target: 1,
      unlocked: true,
      rarity: 'common',
    },
    {
      id: 'gift_10',
      name: 'Generous Spirit',
      description: 'Send 10 gifts',
      icon: '💝',
      progress: 10,
      target: 10,
      unlocked: true,
      rarity: 'common',
    },
    {
      id: 'gift_50',
      name: 'Gift Master',
      description: 'Send 50 gifts',
      icon: '🌟',
      progress: 42,
      target: 50,
      unlocked: false,
      rarity: 'rare',
    },
    {
      id: 'streak_7',
      name: 'Week Warrior',
      description: 'Maintain a 7-day gifting streak',
      icon: '🔥',
      progress: 7,
      target: 7,
      unlocked: true,
      rarity: 'rare',
    },
    {
      id: 'legendary_gift',
      name: 'Big Spender',
      description: 'Send a legendary gift',
      icon: '👑',
      progress: 0,
      target: 1,
      unlocked: false,
      rarity: 'legendary',
      reward: 'Exclusive "Whale" Badge',
    },
  ]);

  const [topRecipients, setTopRecipients] = useState([
    { username: 'alice', count: 8, value: 120, emoji: '👩' },
    { username: 'bob', count: 6, value: 95, emoji: '👨' },
    { username: 'charlie', count: 5, value: 80, emoji: '🧑' },
    { username: 'diana', count: 4, value: 65, emoji: '👱‍♀️' },
    { username: 'eve', count: 3, value: 45, emoji: '👩‍🦰' },
  ]);

  const [giftHistory, setGiftHistory] = useState([
    { day: 'Mon', sent: 5, received: 4 },
    { day: 'Tue', sent: 7, received: 6 },
    { day: 'Wed', sent: 6, received: 5 },
    { day: 'Thu', sent: 8, received: 7 },
    { day: 'Fri', sent: 9, received: 8 },
    { day: 'Sat', sent: 4, received: 5 },
    { day: 'Sun', sent: 3, received: 3 },
  ]);

  const percentile = ((stats.totalUsers - stats.rank) / stats.totalUsers * 100).toFixed(1);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'bg-yellow-600';
      case 'epic': return 'bg-purple-600';
      case 'rare': return 'bg-blue-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div className="h-full">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full grid grid-cols-4 bg-gray-800">
          <TabsTrigger value="overview">
            <Activity className="w-4 h-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="achievements">
            <Award className="w-4 h-4 mr-2" />
            Achievements
          </TabsTrigger>
          <TabsTrigger value="insights">
            <TrendingUp className="w-4 h-4 mr-2" />
            Insights
          </TabsTrigger>
          <TabsTrigger value="leaderboard">
            <Crown className="w-4 h-4 mr-2" />
            Ranking
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="m-0">
          <ScrollArea className="h-[calc(100vh-12rem)]">
            <div className="p-4 space-y-4">
              {/* Key Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-violet-900/50 to-purple-900/50 border-violet-700">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Gift className="w-5 h-5 text-violet-400" />
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">
                      {stats.totalGiftsSent}
                    </div>
                    <div className="text-xs text-gray-400">Gifts Sent</div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-900/50 to-cyan-900/50 border-blue-700">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <DollarSign className="w-5 h-5 text-blue-400" />
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">
                      ${stats.totalValueSent}
                    </div>
                    <div className="text-xs text-gray-400">Total Value</div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 border-green-700">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Users className="w-5 h-5 text-green-400" />
                      <Badge className="bg-green-600 text-xs px-2">
                        Active
                      </Badge>
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">
                      {stats.uniqueRecipients}
                    </div>
                    <div className="text-xs text-gray-400">Recipients</div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-orange-900/50 to-red-900/50 border-orange-700">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Zap className="w-5 h-5 text-orange-400" />
                      <span className="text-orange-400 font-bold">🔥</span>
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">
                      {stats.currentStreak}
                    </div>
                    <div className="text-xs text-gray-400">Day Streak</div>
                  </CardContent>
                </Card>
              </div>

              {/* Giving vs Receiving */}
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-violet-400" />
                    Giving vs Receiving
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">Gifts Sent</span>
                      <span className="text-sm font-medium text-white">{stats.totalGiftsSent}</span>
                    </div>
                    <Progress value={(stats.totalGiftsSent / (stats.totalGiftsSent + stats.totalGiftsReceived)) * 100} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">Gifts Received</span>
                      <span className="text-sm font-medium text-white">{stats.totalGiftsReceived}</span>
                    </div>
                    <Progress value={(stats.totalGiftsReceived / (stats.totalGiftsSent + stats.totalGiftsReceived)) * 100} className="h-2 [&>div]:bg-blue-600" />
                  </div>
                  <div className="pt-2 border-t border-gray-800">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Balance</span>
                      <Badge className={stats.totalGiftsSent > stats.totalGiftsReceived ? 'bg-violet-600' : 'bg-blue-600'}>
                        {stats.totalGiftsSent > stats.totalGiftsReceived ? 'Generous Giver' : 'Well Loved'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Top Recipients */}
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-violet-400" />
                    Top Recipients
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {topRecipients.map((recipient, index) => (
                      <div key={recipient.username} className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-800 text-white font-bold">
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                        </div>
                        <div className="text-2xl">{recipient.emoji}</div>
                        <div className="flex-1">
                          <div className="text-white font-medium">@{recipient.username}</div>
                          <div className="text-xs text-gray-500">{recipient.count} gifts • ${recipient.value}</div>
                        </div>
                        <Badge variant="outline">{recipient.count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Weekly Activity */}
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <LineChart className="w-5 h-5 text-violet-400" />
                    This Week
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {giftHistory.map((day) => (
                      <div key={day.day} className="flex items-center gap-3">
                        <span className="text-sm text-gray-400 w-12">{day.day}</span>
                        <div className="flex-1 flex items-center gap-2">
                          <div className="flex-1 flex items-center gap-1">
                            <div 
                              className="h-6 bg-violet-600 rounded"
                              style={{ width: `${(day.sent / 10) * 100}%` }}
                            />
                            <span className="text-xs text-gray-500">{day.sent}</span>
                          </div>
                          <div className="flex-1 flex items-center gap-1">
                            <div 
                              className="h-6 bg-blue-600 rounded"
                              style={{ width: `${(day.received / 10) * 100}%` }}
                            />
                            <span className="text-xs text-gray-500">{day.received}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-800">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-violet-600 rounded" />
                      <span className="text-xs text-gray-400">Sent</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-600 rounded" />
                      <span className="text-xs text-gray-400">Received</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="m-0">
          <ScrollArea className="h-[calc(100vh-12rem)]">
            <div className="p-4 space-y-3">
              {achievements.map((achievement) => (
                <Card 
                  key={achievement.id}
                  className={`
                    ${achievement.unlocked 
                      ? 'bg-gradient-to-r from-violet-900/50 to-purple-900/50 border-violet-700' 
                      : 'bg-gray-900/50 border-gray-800'
                    }
                  `}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`text-4xl ${achievement.unlocked ? '' : 'grayscale opacity-50'}`}>
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-white font-semibold">{achievement.name}</h4>
                          <Badge className={getRarityColor(achievement.rarity)}>
                            {achievement.rarity}
                          </Badge>
                          {achievement.unlocked && (
                            <Badge className="bg-green-600">✓ Unlocked</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-400 mb-2">
                          {achievement.description}
                        </p>
                        {achievement.reward && (
                          <p className="text-xs text-violet-400 mb-2">
                            🎁 Reward: {achievement.reward}
                          </p>
                        )}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-500">Progress</span>
                            <span className="text-white">
                              {achievement.progress}/{achievement.target}
                            </span>
                          </div>
                          <Progress 
                            value={(achievement.progress / achievement.target) * 100}
                            className="h-2"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value="insights" className="m-0">
          <ScrollArea className="h-[calc(100vh-12rem)]">
            <div className="p-4 space-y-4">
              <Card className="bg-gradient-to-br from-violet-900/50 to-purple-900/50 border-violet-700">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Target className="w-6 h-6 text-violet-400 flex-shrink-0" />
                    <div>
                      <h4 className="text-white font-semibold mb-2">Your Gifting Personality</h4>
                      <p className="text-gray-300 text-sm mb-3">
                        You're a <span className="text-violet-400 font-semibold">Balanced Giver</span>! 
                        You maintain a healthy balance between sending and receiving gifts.
                      </p>
                      <div className="flex gap-2">
                        <Badge className="bg-violet-600">Thoughtful</Badge>
                        <Badge className="bg-purple-600">Consistent</Badge>
                        <Badge className="bg-pink-600">Social</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-gray-800">
                <CardContent className="p-4">
                  <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    Recommendations
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-300">✨ You're close to unlocking "Gift Master" - just 8 more gifts!</p>
                    <p className="text-gray-300">🔥 Keep your streak going! Gift someone today.</p>
                    <p className="text-gray-300">👥 You've sent gifts to 15 people. Try reaching 20 for the "Social Butterfly" badge.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Leaderboard Tab */}
        <TabsContent value="leaderboard" className="m-0">
          <ScrollArea className="h-[calc(100vh-12rem)]">
            <div className="p-4 space-y-4">
              <Card className="bg-gradient-to-br from-yellow-900/50 to-orange-900/50 border-yellow-700">
                <CardContent className="p-4">
                  <div className="text-center">
                    <Crown className="w-12 h-12 text-yellow-400 mx-auto mb-2" />
                    <div className="text-4xl font-bold text-white mb-1">#{stats.rank}</div>
                    <div className="text-sm text-gray-300 mb-2">Your Global Rank</div>
                    <Badge className="bg-yellow-600">Top {percentile}%</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Top Gifters This Month</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { rank: 1, username: 'crypto_king', gifts: 523, emoji: '👑' },
                      { rank: 2, username: 'gift_master', gifts: 487, emoji: '🎁' },
                      { rank: 3, username: 'generous_soul', gifts: 456, emoji: '💝' },
                      { rank: 4, username: 'whale_1337', gifts: 423, emoji: '🐋' },
                      { rank: 5, username: 'diamond_hands', gifts: 398, emoji: '💎' },
                    ].map((user) => (
                      <div key={user.rank} className="flex items-center gap-3 p-2 rounded hover:bg-gray-800 transition-colors">
                        <div className="text-2xl">
                          {user.rank === 1 ? '🥇' : user.rank === 2 ? '🥈' : user.rank === 3 ? '🥉' : `#${user.rank}`}
                        </div>
                        <div className="text-2xl">{user.emoji}</div>
                        <div className="flex-1">
                          <div className="text-white font-medium">@{user.username}</div>
                          <div className="text-xs text-gray-500">{user.gifts} gifts sent</div>
                        </div>
                        {user.rank <= 3 && (
                          <Badge className={
                            user.rank === 1 ? 'bg-yellow-600' :
                            user.rank === 2 ? 'bg-gray-600' :
                            'bg-orange-600'
                          }>
                            Champion
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
