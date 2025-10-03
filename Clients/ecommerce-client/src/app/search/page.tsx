'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Filter, Grid3X3, List } from 'lucide-react';
import { AutosuggestInput } from '@/components/search/AutosuggestInput';
import { SearchResults } from '@/components/search/SearchResults';
import { TrendingSearches } from '@/components/search/TrendingSearches';
import { SearchHistory } from '@/components/search/SearchHistory';
import { useSearch } from '@/lib/hooks/useSearch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams?.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('relevance');
  const [showFilters, setShowFilters] = useState(false);

  const {
    suggestions,
    isLoading,
    trendingSearches,
    clearSuggestions
  } = useSearch({
    debounceMs: 250,
    minQueryLength: 2
  });

  // Update query when URL parameter changes
  useEffect(() => {
    if (searchParams?.get('q') !== query) {
      setQuery(searchParams?.get('q') || '');
    }
  }, [searchParams, query]);

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    // Update URL without page reload
    const url = new URL(window.location.href);
    url.searchParams.set('q', searchQuery);
    window.history.pushState({}, '', url.toString());
  };

  const handleClearSearch = () => {
    setQuery('');
    clearSuggestions();
    const url = new URL(window.location.href);
    url.searchParams.delete('q');
    window.history.pushState({}, '', url.toString());
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Search Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search Input */}
            <div className="flex-1 max-w-2xl w-full">
              <AutosuggestInput
                placeholder="Search for products, brands, categories..."
                onSearch={handleSearch}
                autoFocus
                className="w-full"
              />
            </div>

            {/* Search Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="hidden md:flex"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex bg-muted rounded-md p-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Search Summary */}
          {query && (
            <div className="flex items-center gap-2 mt-4">
              <span className="text-sm text-muted-foreground">
                Showing results for:
              </span>
              <Badge variant="secondary" className="text-sm">
                {query}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearSearch}
                className="h-6 px-2 text-xs"
              >
                Clear
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Trending Searches */}
            <TrendingSearches
              onSearchSelect={handleSearch}
              maxItems={8}
              className="hidden lg:block"
            />

            {/* Search History */}
            <SearchHistory
              onSearchSelect={handleSearch}
              maxItems={8}
              className="hidden lg:block"
            />

            {/* Quick Filters */}
            <Card className="hidden lg:block">
              <CardHeader>
                <CardTitle className="text-lg">Quick Filters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Price Range</h4>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      Under 500K
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      500K - 1M
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      1M - 5M
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      Over 5M
                    </Button>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Categories</h4>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                      Electronics
                    </Badge>
                    <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                      Fashion
                    </Badge>
                    <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                      Home
                    </Badge>
                    <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                      Sports
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Results Area */}
          <div className="lg:col-span-3">
            {query ? (
              <>
                {/* Search Results */}
                {isLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
                    <p className="text-muted-foreground">Searching for "{query}"...</p>
                  </div>
                ) : suggestions ? (
                  <div>
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold mb-2">Search Results</h2>
                      <p className="text-muted-foreground">
                        Found {suggestions.topProducts.length} products for "{query}"
                      </p>
                    </div>

                    <SearchResults
                      suggestions={suggestions}
                      isLoading={isLoading}
                      onProductClick={(product) => {
                        // Navigate to product page
                        console.log('Navigate to product:', product.slug);
                      }}
                      onCategoryClick={(category) => {
                        // Navigate to category page
                        console.log('Navigate to category:', category.slug);
                      }}
                      onSuggestionClick={(suggestion) => {
                        handleSearch(suggestion);
                      }}
                      maxVisibleProducts={20}
                      maxVisibleCategories={8}
                      maxVisibleSuggestions={6}
                    />
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Search className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No results found</h3>
                    <p className="text-muted-foreground mb-6">
                      Try different keywords or browse our trending searches
                    </p>
                    <Button onClick={() => setQuery('')}>
                      Start Over
                    </Button>
                  </div>
                )}
              </>
            ) : (
              /* Empty State - Show trending and history */
              <div className="space-y-8">
                <div className="text-center py-12">
                  <Search className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h2 className="text-2xl font-bold mb-2">What are you looking for?</h2>
                  <p className="text-muted-foreground">
                    Search for products, brands, or browse trending items
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Mobile Trending Searches */}
                  <TrendingSearches
                    onSearchSelect={handleSearch}
                    maxItems={10}
                    className="lg:hidden"
                  />

                  {/* Mobile Search History */}
                  <SearchHistory
                    onSearchSelect={handleSearch}
                    maxItems={10}
                    className="lg:hidden"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}