'use client';

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  forwardRef,
  useImperativeHandle,
  KeyboardEvent,
  FocusEvent,
  ChangeEvent
} from 'react';
import { Search, X, Loader2, Clock, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useSearch, useSearchHistory } from '@/lib/hooks/useSearch';

export interface AutosuggestInputProps {
  placeholder?: string;
  className?: string;
  onSearch?: (query: string) => void;
  onSuggestionSelect?: (suggestion: string) => void;
  autoFocus?: boolean;
  disabled?: boolean;
  showHistory?: boolean;
  showTrending?: boolean;
  maxSuggestions?: number;
}

export interface AutosuggestInputRef {
  focus: () => void;
  blur: () => void;
  clear: () => void;
  getValue: () => string;
}

export const AutosuggestInput = forwardRef<AutosuggestInputRef, AutosuggestInputProps>(
  ({
    placeholder = 'Search products...',
    className,
    onSearch,
    onSuggestionSelect,
    autoFocus = false,
    disabled = false,
    showHistory = true,
    showTrending = true,
    maxSuggestions = 10
  }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const suggestionsRef = useRef<HTMLDivElement>(null);

    const {
      query,
      setQuery,
      suggestions,
      isLoading,
      error,
      trendingSearches,
      clearSuggestions
    } = useSearch({
      debounceMs: 250,
      minQueryLength: 2
    });

    const {
      history,
      addToHistory,
      removeFromHistory,
      clearHistory
    } = useSearchHistory();

    // Combine all suggestions for keyboard navigation
    const allSuggestions = React.useMemo(() => {
      const items: Array<{
        type: 'history' | 'trending' | 'suggestion' | 'category' | 'product';
        value: string;
        label: string;
        description?: string;
      }> = [];

      // Add trending searches
      if (showTrending && !query && trendingSearches.length > 0) {
        trendingSearches.slice(0, 5).forEach(item => {
          items.push({
            type: 'trending',
            value: item,
            label: item,
            description: 'Trending'
          });
        });
      }

      // Add search history
      if (showHistory && !query && history.length > 0) {
        history.slice(0, 5).forEach(item => {
          items.push({
            type: 'history',
            value: item,
            label: item,
            description: 'Recent search'
          });
        });
      }

      // Add suggested queries
      if (suggestions?.suggestedQueries) {
        suggestions.suggestedQueries.forEach(item => {
          items.push({
            type: 'suggestion',
            value: item,
            label: item,
            description: 'Suggestion'
          });
        });
      }

      return items.slice(0, maxSuggestions);
    }, [query, suggestions, trendingSearches, history, showTrending, showHistory, maxSuggestions]);

    // Handle input focus
    const handleFocus = useCallback(() => {
      setIsOpen(true);
      setSelectedIndex(-1);
    }, []);

    // Handle input blur
    const handleBlur = useCallback((e: FocusEvent<HTMLInputElement>) => {
      // Don't close immediately to allow clicking on suggestions
      setTimeout(() => {
        if (!containerRef.current?.contains(document.activeElement)) {
          setIsOpen(false);
          setSelectedIndex(-1);
        }
      }, 150);
    }, []);

    // Handle input change
    const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setQuery(value);
      setIsOpen(true);
      setSelectedIndex(-1);
    }, [setQuery]);

    // Handle keyboard navigation
    const handleKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
      if (!isOpen || allSuggestions.length === 0) {
        if (e.key === 'Enter' && query.trim()) {
          e.preventDefault();
          handleSearch(query.trim());
        }
        return;
      }

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev =>
            prev < allSuggestions.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev =>
            prev > 0 ? prev - 1 : allSuggestions.length - 1
          );
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0 && selectedIndex < allSuggestions.length) {
            const suggestion = allSuggestions[selectedIndex];
            handleSuggestionSelect(suggestion.value);
          } else if (query.trim()) {
            handleSearch(query.trim());
          }
          break;
        case 'Escape':
          e.preventDefault();
          setIsOpen(false);
          setSelectedIndex(-1);
          inputRef.current?.blur();
          break;
        case 'Tab':
          if (selectedIndex >= 0 && selectedIndex < allSuggestions.length) {
            e.preventDefault();
            const suggestion = allSuggestions[selectedIndex];
            handleSuggestionSelect(suggestion.value);
          }
          break;
      }
    }, [isOpen, allSuggestions, selectedIndex, query]);

    // Handle search
    const handleSearch = useCallback((searchQuery: string) => {
      addToHistory(searchQuery);
      setIsOpen(false);
      setSelectedIndex(-1);
      onSearch?.(searchQuery);
    }, [addToHistory, onSearch]);

    // Handle suggestion selection
    const handleSuggestionSelect = useCallback((value: string) => {
      setQuery(value);
      addToHistory(value);
      setIsOpen(false);
      setSelectedIndex(-1);
      onSuggestionSelect?.(value);
      onSearch?.(value);
    }, [setQuery, addToHistory, onSuggestionSelect, onSearch]);

    // Handle clear input
    const handleClear = useCallback(() => {
      setQuery('');
      inputRef.current?.focus();
      setSelectedIndex(-1);
    }, [setQuery]);

    // Handle click outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsOpen(false);
          setSelectedIndex(-1);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Scroll selected item into view
    useEffect(() => {
      if (selectedIndex >= 0 && suggestionsRef.current) {
        const selectedElement = suggestionsRef.current.querySelector(`[data-index="${selectedIndex}"]`);
        if (selectedElement) {
          selectedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
      }
    }, [selectedIndex]);

    // Imperative methods
    useImperativeHandle(ref, () => ({
      focus: () => inputRef.current?.focus(),
      blur: () => inputRef.current?.blur(),
      clear: handleClear,
      getValue: () => query
    }), [query, handleClear]);

    return (
      <div ref={containerRef} className={cn('relative w-full', className)}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            autoFocus={autoFocus}
            disabled={disabled}
            className="pl-10 pr-10"
            aria-label="Search products"
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            aria-autocomplete="list"
            role="combobox"
          />

          {query && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
              onClick={handleClear}
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </Button>
          )}

          {isLoading && (
            <div className="absolute right-10 top-1/2 -translate-y-1/2">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          )}
        </div>

        {/* Suggestions dropdown */}
        {isOpen && (
          <div
            ref={suggestionsRef}
            className="absolute top-full left-0 right-0 z-50 mt-1 max-h-80 overflow-y-auto rounded-md border bg-popover shadow-md"
            role="listbox"
            aria-label="Search suggestions"
          >
            {error ? (
              <div className="p-4 text-center text-sm text-destructive">
                Failed to load suggestions. Please try again.
              </div>
            ) : allSuggestions.length > 0 ? (
              <div className="py-1">
                {allSuggestions.map((suggestion, index) => (
                  <button
                    key={`${suggestion.type}-${index}`}
                    data-index={index}
                    className={cn(
                      'w-full px-4 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
                      selectedIndex === index && 'bg-accent text-accent-foreground',
                      'flex items-center gap-3'
                    )}
                    onClick={() => handleSuggestionSelect(suggestion.value)}
                    role="option"
                    aria-selected={selectedIndex === index}
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {suggestion.type === 'history' && <Clock className="h-4 w-4 text-muted-foreground" />}
                      {suggestion.type === 'trending' && <TrendingUp className="h-4 w-4 text-muted-foreground" />}

                      <span className="truncate">{suggestion.label}</span>
                    </div>

                    {suggestion.description && (
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {suggestion.description}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            ) : query.length >= 2 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No suggestions found for "{query}"
              </div>
            ) : (
              <div className="p-4 text-center text-sm text-muted-foreground">
                Start typing to see suggestions
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
);

AutosuggestInput.displayName = 'AutosuggestInput';