'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, ArrowUp, ArrowDown, Minus, Search, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { searchApi } from '@/lib/api/search';

interface TrendingItem {
  term: string;
  trend: 'up' | 'down' | 'stable';
  change: number;
  category?: string;
  searchCount?: number;
}

interface TrendingSearchesProps {
  onSearchSelect?: (term: string) => void;
  maxItems?: number;
  showTrend?: boolean;
  showCategory?: boolean;
  showSearchCount?: boolean;
  refreshInterval?: number;
  className?: string;
}

export const TrendingSearches: React.FC<TrendingSearchesProps> = ({
  onSearchSelect,
  maxItems = 10,
  showTrend = true,
  showCategory = true,
  showSearchCount = false,
  refreshInterval = 5 * 60 * 1000, // 5 minutes
  className
}) => {
  const [trendingItems, setTrendingItems] = useState<TrendingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  // Generate trending data with mock trends
  const generateTrendingData = (searches: string[]): TrendingItem[] => {
    const categories = [
      'Electronics', 'Fashion', 'Home', 'Sports', 'Beauty',
      'Toys', 'Books', 'Automotive', 'Health', 'Food'
    ];

    return searches.slice(0, maxItems).map((term, index) => {
      const trends: Array<'up' | 'down' | 'stable'> = ['up', 'down', 'stable'];
      const trend = trends[Math.floor(Math.random() * trends.length)];
      const change = trend === 'stable' ? 0 : Math.floor(Math.random() * 50) + 1;

      return {
        term,
        trend,
        change: trend === 'down' ? -change : change,
        category: categories[Math.floor(Math.random() * categories.length)],
        searchCount: Math.floor(Math.random() * 10000) + 1000
      };
    });
  };

  // Fetch trending searches
  const fetchTrendingSearches = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const searches = await searchApi.getTrendingSearches();
      const trendingData = generateTrendingData(searches);

      setTrendingItems(trendingData);
      setLastRefresh(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load trending searches');
      console.error('Error fetching trending searches:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch and periodic refresh
  useEffect(() => {
    fetchTrendingSearches();

    if (refreshInterval > 0) {
      const interval = setInterval(fetchTrendingSearches, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [refreshInterval]);

  // Handle search selection
  const handleSearchSelect = (term: string) => {
    onSearchSelect?.(term);
  };

  // Get trend icon
  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <ArrowUp className="h-3 w-3 text-green-600" />;
      case 'down':
        return <ArrowDown className="h-3 w-3 text-red-600" />;
      case 'stable':
        return <Minus className="h-3 w-3 text-gray-400" />;
    }
  };

  // Get trend color
  const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return 'text-green-600 bg-green-50';
      case 'down':
        return 'text-red-600 bg-red-50';
      case 'stable':
        return 'text-gray-600 bg-gray-50';
    }
  };

  // Format search count
  const formatSearchCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  if (error) {
    return (
      <Card className={cn('w-full', className)}>
        <CardContent className="p-4">
          <div className="text-center text-destructive">
            <TrendingUp className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Failed to load trending searches</p>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchTrendingSearches}
              className="mt-2"
            >
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Trending Searches
          </CardTitle>
          <div className="flex items-center gap-2">
            {lastRefresh && (
              <span className="text-xs text-muted-foreground">
                Updated {lastRefresh.toLocaleTimeString()}
              </span>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={fetchTrendingSearches}
              disabled={isLoading}
              className="h-6 w-6"
            >
              {isLoading ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Search className="h-3 w-3" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-1">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-center gap-3 p-2">
                <div className="h-4 w-4 bg-muted rounded animate-pulse" />
                <div className="flex-1">
                  <div className="h-4 w-3/4 bg-muted rounded animate-pulse mb-1" />
                  <div className="h-3 w-1/2 bg-muted rounded animate-pulse" />
                </div>
                <div className="h-6 w-12 bg-muted rounded animate-pulse" />
              </div>
            ))}
          </div>
        ) : trendingItems.length > 0 ? (
          <div className="space-y-1">
            {trendingItems.map((item, index) => (
              <button
                key={item.term}
                className="w-full p-2 text-left hover:bg-accent hover:text-accent-foreground transition-colors rounded-md group"
                onClick={() => handleSearchSelect(item.term)}
              >
                <div className="flex items-center gap-3">
                  {/* Rank */}
                  <div className={cn(
                    'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold',
                    index < 3 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                  )}>
                    {index + 1}
                  </div>

                  {/* Search Term */}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                      {item.term}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      {showCategory && item.category && (
                        <Badge variant="secondary" className="text-xs px-1 py-0">
                          {item.category}
                        </Badge>
                      )}
                      {showSearchCount && item.searchCount && (
                        <span className="text-xs text-muted-foreground">
                          {formatSearchCount(item.searchCount)} searches
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Trend Indicator */}
                  {showTrend && (
                    <div className={cn(
                      'flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium',
                      getTrendColor(item.trend)
                    )}>
                      {getTrendIcon(item.trend)}
                      {Math.abs(item.change)}%
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No trending searches available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};