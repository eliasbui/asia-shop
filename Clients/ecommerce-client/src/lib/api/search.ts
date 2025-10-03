import { SuggestPayload, Product } from '@/lib/types/domain';

// Search cache interface
interface SearchCache {
  data: SuggestPayload;
  timestamp: number;
}

// In-memory cache with 5-minute TTL
const searchCache = new Map<string, SearchCache>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Mock data for trending searches
const TRENDING_SEARCHES = [
  'iPhone 15 Pro Max',
  'Samsung Galaxy S24',
  'AirPods Pro',
  'MacBook Pro M3',
  'iPad Air',
  'Sony PlayStation 5',
  'Nike Air Max',
  'Adidas Ultraboost',
  'Dyson V15',
  'Instant Pot Duo',
  'Lego Creator',
  'Barbie Dreamhouse',
  'Nintendo Switch',
  'OLED TV 55 inch',
  'Coffee Maker Deluxe'
];

// Mock categories
const CATEGORIES = [
  { slug: 'electronics', name: 'Electronics' },
  { slug: 'phones', name: 'Smartphones' },
  { slug: 'laptops', name: 'Laptops' },
  { slug: 'audio', name: 'Audio & Headphones' },
  { slug: 'gaming', name: 'Gaming' },
  { slug: 'clothing', name: 'Clothing & Fashion' },
  { slug: 'shoes', name: 'Shoes' },
  { slug: 'home', name: 'Home & Kitchen' },
  { slug: 'toys', name: 'Toys & Games' },
  { slug: 'sports', name: 'Sports & Outdoors' }
];

// Mock products generator
function generateMockProducts(query: string, count: number = 5): Pick<Product, 'id' | 'slug' | 'title' | 'media' | 'price'>[] {
  const products: Pick<Product, 'id' | 'slug' | 'title' | 'media' | 'price'>[] = [];

  for (let i = 0; i < count; i++) {
    const id = `product-${Date.now()}-${i}`;
    const price = Math.floor(Math.random() * 1000000) + 100000; // 100k to 1.1M VND

    products.push({
      id,
      slug: `${query.toLowerCase().replace(/\s+/g, '-')}-${i}`,
      title: `${query} - Product ${i + 1}`,
      media: [{
        url: `https://picsum.photos/seed/${id}/200/200.jpg`,
        alt: `${query} Product ${i + 1}`,
        type: 'image'
      }],
      price: {
        list: { amount: price, currency: 'VND' },
        sale: Math.random() > 0.7 ? { amount: Math.floor(price * 0.8), currency: 'VND' } : undefined,
        percentOff: Math.random() > 0.7 ? Math.floor(Math.random() * 30) + 10 : undefined
      }
    });
  }

  return products;
}

// Generate suggested queries based on input
function generateSuggestedQueries(query: string): string[] {
  if (!query || query.length < 2) return [];

  const suggestions = [
    `${query} pro`,
    `${query} max`,
    `${query} premium`,
    `${query} deluxe`,
    `best ${query}`,
    `cheap ${query}`,
    `${query} review`,
    `${query} price`
  ];

  return suggestions.slice(0, 5);
}

// Check if cache entry is valid
function isCacheValid(cache: SearchCache): boolean {
  return Date.now() - cache.timestamp < CACHE_TTL;
}

// Search API functions
export const searchApi = {
  /**
   * Get search suggestions with caching
   */
  async getSuggestions(query: string): Promise<SuggestPayload> {
    // Check cache first
    const cacheKey = query.toLowerCase().trim();
    const cached = searchCache.get(cacheKey);

    if (cached && isCacheValid(cached)) {
      return cached.data;
    }

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));

    // Generate mock data
    const payload: SuggestPayload = {
      suggestedQueries: generateSuggestedQueries(query),
      topCategories: CATEGORIES.slice(0, 4),
      topProducts: generateMockProducts(query, Math.min(5, Math.max(2, Math.floor(Math.random() * 5))))
    };

    // Cache the result
    searchCache.set(cacheKey, {
      data: payload,
      timestamp: Date.now()
    });

    return payload;
  },

  /**
   * Get trending searches
   */
  async getTrendingSearches(): Promise<string[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100));

    return TRENDING_SEARCHES;
  },

  /**
   * Get popular categories
   */
  async getPopularCategories(): Promise<{ slug: string; name: string }[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 50));

    return CATEGORIES;
  },

  /**
   * Clear search cache
   */
  clearCache(): void {
    searchCache.clear();
  },

  /**
   * Get cache size (for debugging)
   */
  getCacheSize(): number {
    return searchCache.size;
  }
};

// Export types for external use
export type { SearchCache };