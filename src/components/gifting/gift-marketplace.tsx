/**
 * Gift Marketplace Component
 * Browse, filter, and purchase gifts
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  TrendingUp,
  Star,
  Crown,
  Zap,
  Sparkles,
  ShoppingCart,
  Grid3x3,
  List,
  SlidersHorizontal,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { giftingService, type Gift } from '@/lib/appwrite/services/gifting.service';

interface GiftMarketplaceProps {
  onGiftSelect?: (gift: Gift) => void;
  onPurchase?: (giftId: string) => void;
}

export function GiftMarketplace({ onGiftSelect, onPurchase }: GiftMarketplaceProps) {
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [filteredGifts, setFilteredGifts] = useState<Gift[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRarity, setSelectedRarity] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [sortBy, setSortBy] = useState<'popular' | 'price_low' | 'price_high' | 'newest'>('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadGifts();
  }, []);

  useEffect(() => {
    filterAndSortGifts();
  }, [gifts, searchQuery, selectedCategory, selectedRarity, priceRange, sortBy]);

  const loadGifts = () => {
    const allGifts = giftingService.getAvailableGifts();
    setGifts(allGifts);
    setFilteredGifts(allGifts);
  };

  const filterAndSortGifts = () => {
    let filtered = [...gifts];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(gift =>
        gift.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(gift => gift.category === selectedCategory);
    }

    // Rarity filter
    if (selectedRarity !== 'all') {
      filtered = filtered.filter(gift => gift.rarity === selectedRarity);
    }

    // Price range filter
    filtered = filtered.filter(
      gift => gift.value >= priceRange[0] && gift.value <= priceRange[1]
    );

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price_low':
          return a.value - b.value;
        case 'price_high':
          return b.value - a.value;
        case 'newest':
          return 0; // Would use actual creation date
        case 'popular':
        default:
          return b.value - a.value; // Mock popularity by value
      }
    });

    setFilteredGifts(filtered);
  };

  const getRarityColor = (rarity?: string) => {
    switch (rarity) {
      case 'legendary': return 'text-yellow-400 border-yellow-400';
      case 'epic': return 'text-purple-400 border-purple-400';
      case 'rare': return 'text-blue-400 border-blue-400';
      case 'common': return 'text-gray-400 border-gray-400';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  const getRarityBg = (rarity?: string) => {
    switch (rarity) {
      case 'legendary': return 'bg-gradient-to-br from-yellow-900/20 to-orange-900/20';
      case 'epic': return 'bg-gradient-to-br from-purple-900/20 to-pink-900/20';
      case 'rare': return 'bg-gradient-to-br from-blue-900/20 to-cyan-900/20';
      case 'common': return 'bg-gradient-to-br from-gray-900/20 to-gray-800/20';
      default: return 'bg-gray-900/20';
    }
  };

  const getRarityIcon = (rarity?: string) => {
    switch (rarity) {
      case 'legendary': return <Crown className="w-4 h-4" />;
      case 'epic': return <Zap className="w-4 h-4" />;
      case 'rare': return <Sparkles className="w-4 h-4" />;
      default: return <Star className="w-4 h-4" />;
    }
  };

  const categories = [
    { value: 'all', label: 'All Gifts', emoji: '🎁' },
    { value: 'emoji', label: 'Emojis', emoji: '😊' },
    { value: 'crypto', label: 'Crypto', emoji: '💰' },
    { value: 'sticker', label: 'Stickers', emoji: '🎨' },
    { value: 'nft', label: 'NFTs', emoji: '🖼️' },
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-800 p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <ShoppingCart className="w-6 h-6 text-violet-400" />
            Gift Marketplace
          </h2>
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="outline"
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="bg-gray-800 border-gray-700"
            >
              {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid3x3 className="w-4 h-4" />}
            </Button>
            <Button
              size="icon"
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="bg-gray-800 border-gray-700"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Search and Quick Filters */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              placeholder="Search gifts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-800 border-gray-700 text-white"
            />
          </div>
          <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger className="w-40 bg-gray-800 border-gray-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="price_low">Price: Low to High</SelectItem>
              <SelectItem value="price_high">Price: High to Low</SelectItem>
              <SelectItem value="newest">Newest First</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Category Tabs */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="w-full bg-gray-800">
            {categories.map((cat) => (
              <TabsTrigger key={cat.value} value={cat.value} className="flex-1">
                <span className="mr-2">{cat.emoji}</span>
                {cat.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Advanced Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4 space-y-4">
                  {/* Rarity Filter */}
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">Rarity</label>
                    <div className="flex gap-2 flex-wrap">
                      {['all', 'common', 'rare', 'epic', 'legendary'].map((rarity) => (
                        <Button
                          key={rarity}
                          size="sm"
                          variant={selectedRarity === rarity ? 'default' : 'outline'}
                          onClick={() => setSelectedRarity(rarity)}
                          className={selectedRarity === rarity ? 'bg-violet-600' : ''}
                        >
                          {rarity === 'all' ? 'All' : rarity.charAt(0).toUpperCase() + rarity.slice(1)}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm text-gray-400">Price Range</label>
                      <span className="text-sm text-white">
                        ${priceRange[0]} - ${priceRange[1]}
                      </span>
                    </div>
                    <Slider
                      min={0}
                      max={100}
                      step={5}
                      value={priceRange}
                      onValueChange={(value) => setPriceRange(value as [number, number])}
                      className="w-full"
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Gift Grid/List */}
      <ScrollArea className="flex-1">
        <div className={`p-4 ${
          viewMode === 'grid' 
            ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'
            : 'space-y-3'
        }`}>
          {filteredGifts.map((gift, index) => (
            <motion.div
              key={gift.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              {viewMode === 'grid' ? (
                // Grid View
                <Card 
                  className={`
                    ${getRarityBg(gift.rarity)}
                    border-2 ${getRarityColor(gift.rarity)}
                    hover:scale-105 transition-all cursor-pointer group
                  `}
                  onClick={() => onGiftSelect?.(gift)}
                >
                  <CardContent className="p-4 text-center">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                      className="text-6xl mb-2"
                    >
                      {gift.emoji}
                    </motion.div>
                    <h3 className="text-white font-semibold text-sm mb-1 truncate">
                      {gift.name}
                    </h3>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Badge className={`text-xs ${getRarityColor(gift.rarity)}`}>
                        {getRarityIcon(gift.rarity)}
                        {gift.rarity}
                      </Badge>
                    </div>
                    <div className="text-violet-400 font-bold text-lg mb-2">
                      ${gift.value}
                    </div>
                    <Button
                      size="sm"
                      className="w-full bg-violet-600 hover:bg-violet-700 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        onPurchase?.(gift.id);
                      }}
                    >
                      <ShoppingCart className="w-3 h-3 mr-1" />
                      Buy Now
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                // List View
                <Card 
                  className={`
                    ${getRarityBg(gift.rarity)}
                    border ${getRarityColor(gift.rarity)}
                    hover:border-violet-500 transition-all cursor-pointer
                  `}
                  onClick={() => onGiftSelect?.(gift)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center gap-4">
                      <div className="text-5xl">{gift.emoji}</div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-semibold mb-1">{gift.name}</h3>
                        <div className="flex items-center gap-2">
                          <Badge className={`text-xs ${getRarityColor(gift.rarity)}`}>
                            {getRarityIcon(gift.rarity)}
                            {gift.rarity}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {gift.category}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-violet-400 font-bold text-xl mb-2">
                          ${gift.value}
                        </div>
                        <Button
                          size="sm"
                          className="bg-violet-600 hover:bg-violet-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            onPurchase?.(gift.id);
                          }}
                        >
                          <ShoppingCart className="w-3 h-3 mr-1" />
                          Buy
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          ))}
        </div>

        {filteredGifts.length === 0 && (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <Filter className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">No gifts found</p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSelectedRarity('all');
                  setPriceRange([0, 100]);
                }}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        )}
      </ScrollArea>

      {/* Stats Footer */}
      <div className="border-t border-gray-800 p-4 bg-gray-900/50">
        <div className="flex items-center justify-between text-sm text-gray-400">
          <span>
            Showing {filteredGifts.length} of {gifts.length} gifts
          </span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4 text-violet-400" />
              {filteredGifts.filter(g => g.rarity === 'legendary').length} Legendary
            </span>
            <span className="flex items-center gap-1">
              <Zap className="w-4 h-4 text-purple-400" />
              {filteredGifts.filter(g => g.rarity === 'epic').length} Epic
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
