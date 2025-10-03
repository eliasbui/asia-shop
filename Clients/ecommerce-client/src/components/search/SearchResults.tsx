'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, ShoppingCart, Package, Grid3X3, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { SuggestPayload, Product } from '@/lib/types/domain';
import { formatCurrency } from '@/lib/utils/format';

interface SearchResultsProps {
  suggestions: SuggestPayload | null;
  isLoading?: boolean;
  onProductClick?: (product: Product) => void;
  onCategoryClick?: (category: { slug: string; name: string }) => void;
  onSuggestionClick?: (suggestion: string) => void;
  className?: string;
  maxVisibleProducts?: number;
  maxVisibleCategories?: number;
  maxVisibleSuggestions?: number;
}

interface VirtualScrollProps {
  items: any[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: any, index: number) => React.ReactNode;
}

// Simple virtual scrolling implementation for large result sets
const VirtualScroll: React.FC<VirtualScrollProps> = ({
  items,
  itemHeight,
  containerHeight,
  renderItem
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const visibleStart = Math.floor(scrollTop / itemHeight);
  const visibleEnd = Math.min(
    visibleStart + Math.ceil(containerHeight / itemHeight) + 1,
    items.length
  );

  const visibleItems = items.slice(visibleStart, visibleEnd);
  const totalHeight = items.length * itemHeight;

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', () => {
        setScrollTop(scrollElement.scrollTop);
      });
    }
  }, []);

  return (
    <div
      ref={scrollRef}
      className="overflow-auto"
      style={{ height: containerHeight }}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${visibleStart * itemHeight}px)` }}>
          {visibleItems.map((item, index) => (
            <div key={visibleStart + index} style={{ height: itemHeight }}>
              {renderItem(item, visibleStart + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Product preview component
const ProductPreview: React.FC<{
  product: Pick<Product, 'id' | 'slug' | 'title' | 'media' | 'price'>;
  onClick: () => void;
}> = ({ product, onClick }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const price = product.price;
  const currentPrice = price.sale?.amount || price.list.amount;
  const originalPrice = price.list.amount;
  const hasDiscount = price.sale && price.sale.amount < price.list.amount;

  return (
    <Card
      className="group cursor-pointer transition-all hover:shadow-md hover:scale-[1.02] border-l-4 border-l-transparent hover:border-l-primary"
      onClick={onClick}
    >
      <CardContent className="p-3">
        <div className="flex gap-3">
          {/* Product Image */}
          <div className="relative w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
            {!imageError && product.media[0] ? (
              <Image
                src={product.media[0].url}
                alt={product.media[0].alt}
                fill
                className={cn(
                  'object-cover transition-opacity duration-200',
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                )}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
                sizes="64px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="h-6 w-6 text-gray-400" />
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
              {product.title}
            </h4>

            {/* Price */}
            <div className="flex items-center gap-2 mt-1">
              <span className="font-bold text-sm text-red-600">
                {formatCurrency(currentPrice, 'VND')}
              </span>
              {hasDiscount && (
                <span className="text-xs text-muted-foreground line-through">
                  {formatCurrency(originalPrice, 'VND')}
                </span>
              )}
              {hasDiscount && price.percentOff && (
                <Badge variant="destructive" className="text-xs px-1 py-0">
                  -{price.percentOff}%
                </Badge>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                // Add to cart logic here
              }}
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Category suggestion component
const CategorySuggestion: React.FC<{
  category: { slug: string; name: string };
  onClick: () => void;
}> = ({ category, onClick }) => (
  <button
    className="w-full p-3 text-left hover:bg-accent hover:text-accent-foreground transition-colors rounded-md group"
    onClick={onClick}
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary/10 rounded-md flex items-center justify-center group-hover:bg-primary/20 transition-colors">
          <Grid3X3 className="h-5 w-5 text-primary" />
        </div>
        <div>
          <div className="font-medium text-sm">{category.name}</div>
          <div className="text-xs text-muted-foreground">Browse category</div>
        </div>
      </div>
      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
    </div>
  </button>
);

// Query suggestion component
const QuerySuggestion: React.FC<{
  suggestion: string;
  onClick: () => void;
}> = ({ suggestion, onClick }) => (
  <button
    className="w-full p-3 text-left hover:bg-accent hover:text-accent-foreground transition-colors rounded-md group"
    onClick={onClick}
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-muted rounded-md flex items-center justify-center group-hover:bg-accent transition-colors">
          <span className="text-lg font-semibold text-muted-foreground group-hover:text-foreground">
            🔍
          </span>
        </div>
        <div className="font-medium text-sm">{suggestion}</div>
      </div>
      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
    </div>
  </button>
);

export const SearchResults: React.FC<SearchResultsProps> = ({
  suggestions,
  isLoading = false,
  onProductClick,
  onCategoryClick,
  onSuggestionClick,
  className,
  maxVisibleProducts = 5,
  maxVisibleCategories = 4,
  maxVisibleSuggestions = 3
}) => {
  const [activeSection, setActiveSection] = useState<'products' | 'categories' | 'suggestions' | null>(null);

  if (isLoading) {
    return (
      <div className={cn('p-6 text-center', className)}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
        <p className="mt-2 text-sm text-muted-foreground">Loading suggestions...</p>
      </div>
    );
  }

  if (!suggestions) {
    return (
      <div className={cn('p-6 text-center', className)}>
        <div className="text-muted-foreground">
          <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Start typing to see search results</p>
        </div>
      </div>
    );
  }

  const { topProducts, topCategories, suggestedQueries } = suggestions;
  const hasProducts = topProducts.length > 0;
  const hasCategories = topCategories.length > 0;
  const hasSuggestions = suggestedQueries.length > 0;

  return (
    <div className={cn('w-full max-w-md', className)}>
      {/* Section Tabs */}
      {(hasProducts || hasCategories || hasSuggestions) && (
        <div className="flex gap-1 p-1 border-b">
          {hasProducts && (
            <button
              className={cn(
                'flex-1 px-3 py-2 text-xs font-medium rounded-t-md transition-colors',
                activeSection === 'products' || !activeSection
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              )}
              onClick={() => setActiveSection(activeSection === 'products' ? null : 'products')}
            >
              Products ({topProducts.length})
            </button>
          )}
          {hasCategories && (
            <button
              className={cn(
                'flex-1 px-3 py-2 text-xs font-medium rounded-t-md transition-colors',
                activeSection === 'categories'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              )}
              onClick={() => setActiveSection(activeSection === 'categories' ? null : 'categories')}
            >
              Categories ({topCategories.length})
            </button>
          )}
          {hasSuggestions && (
            <button
              className={cn(
                'flex-1 px-3 py-2 text-xs font-medium rounded-t-md transition-colors',
                activeSection === 'suggestions'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              )}
              onClick={() => setActiveSection(activeSection === 'suggestions' ? null : 'suggestions')}
            >
              Suggestions ({suggestedQueries.length})
            </button>
          )}
        </div>
      )}

      {/* Products Section */}
      {hasProducts && (!activeSection || activeSection === 'products') && (
        <div className="p-2">
          <div className="px-2 py-1">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Products
            </h3>
          </div>
          <div className="space-y-1 max-h-80 overflow-y-auto">
            {topProducts.slice(0, maxVisibleProducts).map((product) => (
              <ProductPreview
                key={product.id}
                product={product}
                onClick={() => onProductClick?.(product as Product)}
              />
            ))}
          </div>
          {topProducts.length > maxVisibleProducts && (
            <div className="p-2 text-center">
              <Button variant="ghost" size="sm" className="text-xs">
                View all {topProducts.length} products
                <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Categories Section */}
      {hasCategories && (!activeSection || activeSection === 'categories') && (
        <div className="p-2">
          <div className="px-2 py-1">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Categories
            </h3>
          </div>
          <div className="space-y-1 max-h-60 overflow-y-auto">
            {topCategories.slice(0, maxVisibleCategories).map((category) => (
              <CategorySuggestion
                key={category.slug}
                category={category}
                onClick={() => onCategoryClick?.(category)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Suggestions Section */}
      {hasSuggestions && (!activeSection || activeSection === 'suggestions') && (
        <div className="p-2">
          <div className="px-2 py-1">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Suggested Searches
            </h3>
          </div>
          <div className="space-y-1 max-h-60 overflow-y-auto">
            {suggestedQueries.slice(0, maxVisibleSuggestions).map((suggestion) => (
              <QuerySuggestion
                key={suggestion}
                suggestion={suggestion}
                onClick={() => onSuggestionClick?.(suggestion)}
              />
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {!hasProducts && !hasCategories && !hasSuggestions && (
        <div className="p-6 text-center">
          <div className="text-muted-foreground">
            <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No results found</p>
            <p className="text-xs mt-1">Try different keywords or browse categories</p>
          </div>
        </div>
      )}
    </div>
  );
};