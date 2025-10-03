'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { searchApi } from '@/lib/api/search';
import { SuggestPayload } from '@/lib/types/domain';

interface UseSearchOptions {
  debounceMs?: number;
  minQueryLength?: number;
  enabled?: boolean;
}

interface UseSearchReturn {
  query: string;
  setQuery: (query: string) => void;
  suggestions: SuggestPayload | null;
  isLoading: boolean;
  error: Error | null;
  trendingSearches: string[];
  popularCategories: { slug: string; name: string }[];
  clearSuggestions: () => void;
  refetchTrending: () => Promise<void>;
}

export function useSearch(options: UseSearchOptions = {}): UseSearchReturn {
  const {
    debounceMs = 250,
    minQueryLength = 2,
    enabled = true
  } = options;

  const [query, setQueryState] = useState('');
  const [suggestions, setSuggestions] = useState<SuggestPayload | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [trendingSearches, setTrendingSearches] = useState<string[]>([]);
  const [popularCategories, setPopularCategories] = useState<{ slug: string; name: string }[]>([]);

  const debounceTimeoutRef = useRef<NodeJS.Timeout>();
  const mountedRef = useRef(true);
  const lastQueryRef = useRef<string>('');

  // Fetch suggestions with debouncing
  const fetchSuggestions = useCallback(async (searchQuery: string) => {
    if (!enabled || searchQuery.length < minQueryLength) {
      setSuggestions(null);
      return;
    }

    // Skip if same as last query
    if (searchQuery === lastQueryRef.current) {
      return;
    }

    lastQueryRef.current = searchQuery;
    setIsLoading(true);
    setError(null);

    try {
      const result = await searchApi.getSuggestions(searchQuery);

      if (mountedRef.current) {
        setSuggestions(result);
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err : new Error('Failed to fetch suggestions'));
        setSuggestions(null);
      }
    } finally {
      if (mountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [enabled, minQueryLength]);

  // Debounced query handler
  const setQuery = useCallback((newQuery: string) => {
    setQueryState(newQuery);

    // Clear existing timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Set new timeout
    debounceTimeoutRef.current = setTimeout(() => {
      fetchSuggestions(newQuery);
    }, debounceMs);
  }, [fetchSuggestions, debounceMs]);

  // Clear suggestions
  const clearSuggestions = useCallback(() => {
    setSuggestions(null);
    setError(null);
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
  }, []);

  // Fetch trending searches
  const fetchTrendingSearches = useCallback(async () => {
    try {
      const trending = await searchApi.getTrendingSearches();
      if (mountedRef.current) {
        setTrendingSearches(trending);
      }
    } catch (err) {
      console.error('Failed to fetch trending searches:', err);
    }
  }, []);

  // Fetch popular categories
  const fetchPopularCategories = useCallback(async () => {
    try {
      const categories = await searchApi.getPopularCategories();
      if (mountedRef.current) {
        setPopularCategories(categories);
      }
    } catch (err) {
      console.error('Failed to fetch popular categories:', err);
    }
  }, []);

  // Refetch trending searches
  const refetchTrending = useCallback(async () => {
    await Promise.all([
      fetchTrendingSearches(),
      fetchPopularCategories()
    ]);
  }, [fetchTrendingSearches, fetchPopularCategories]);

  // Initialize trending searches and categories
  useEffect(() => {
    fetchTrendingSearches();
    fetchPopularCategories();
  }, [fetchTrendingSearches, fetchPopularCategories]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  return {
    query,
    setQuery,
    suggestions,
    isLoading,
    error,
    trendingSearches,
    popularCategories,
    clearSuggestions,
    refetchTrending
  };
}

// Hook for managing search history
interface UseSearchHistoryReturn {
  history: string[];
  addToHistory: (query: string) => void;
  removeFromHistory: (query: string) => void;
  clearHistory: () => void;
}

export function useSearchHistory(maxItems: number = 10): UseSearchHistoryReturn {
  const [history, setHistory] = useState<string[]>([]);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('search-history');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setHistory(parsed);
        }
      }
    } catch (error) {
      console.error('Failed to load search history:', error);
    }
  }, []);

  // Save to localStorage whenever history changes
  useEffect(() => {
    try {
      localStorage.setItem('search-history', JSON.stringify(history));
    } catch (error) {
      console.error('Failed to save search history:', error);
    }
  }, [history]);

  const addToHistory = useCallback((query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;

    setHistory(prev => {
      // Remove if already exists
      const filtered = prev.filter(item => item !== trimmed);
      // Add to beginning
      const updated = [trimmed, ...filtered];
      // Limit to maxItems
      return updated.slice(0, maxItems);
    });
  }, [maxItems]);

  const removeFromHistory = useCallback((query: string) => {
    setHistory(prev => prev.filter(item => item !== query));
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    try {
      localStorage.removeItem('search-history');
    } catch (error) {
      console.error('Failed to clear search history:', error);
    }
  }, []);

  return {
    history,
    addToHistory,
    removeFromHistory,
    clearHistory
  };
}