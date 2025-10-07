"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { Search, X, Loader2, Clock, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { api } from "@/lib/api/fetch-wrapper";
import { SuggestPayloadSchema } from "@/types/models";
import { debounce, formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/lib/state/ui-store";
import { Button } from "@/components/ui/button";
import type { SuggestPayload } from "@/types/models";

interface AutosuggestInputProps {
  className?: string;
  placeholder?: string;
  locale?: string;
  onSearch?: (query: string) => void;
  autoFocus?: boolean;
}

export function AutosuggestInput({
  className,
  placeholder,
  locale = "vi",
  onSearch,
  autoFocus = false,
}: AutosuggestInputProps) {
  const t = useTranslations();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  const { searchHistory, addToSearchHistory } = useUIStore();

  // Fetch suggestions with debounce
  const {
    data: suggestions,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["suggest", query],
    queryFn: async () => {
      if (query.length < 2) return null;
      
      const response = await api.get<SuggestPayload>("/suggest", {
        params: { q: query, limit: 10 },
        schema: SuggestPayloadSchema,
      });
      return response;
    },
    enabled: query.length >= 2,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Debounced query update
  const debouncedSetQuery = useCallback(
    debounce((value: string) => {
      setQuery(value);
    }, 250),
    []
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    debouncedSetQuery(value);
    setIsOpen(true);
  };

  const handleSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    addToSearchHistory(searchQuery);
    setIsOpen(false);
    setQuery("");
    
    if (onSearch) {
      onSearch(searchQuery);
    } else {
      router.push(`/${locale}/s?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch(e.currentTarget.value);
    } else if (e.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const handleClear = () => {
    setQuery("");
    inputRef.current?.focus();
  };

  const handleProductClick = (slug: string) => {
    setIsOpen(false);
    router.push(`/${locale}/p/${slug}`);
  };

  const handleCategoryClick = (slug: string) => {
    setIsOpen(false);
    router.push(`/${locale}/c/${slug}`);
  };

  // Prefetch trending on focus
  useEffect(() => {
    if (isFocused && !query) {
      refetch();
    }
  }, [isFocused, query, refetch]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!inputRef.current?.parentElement?.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const showHistory = !query && searchHistory.length > 0;
  const showSuggestions = query.length >= 2 && suggestions;

  return (
    <div className={cn("relative", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            setIsFocused(true);
            setIsOpen(true);
          }}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder || t("common.searchPlaceholder")}
          className={cn(
            "w-full rounded-lg border bg-background py-2 pl-9 pr-9 text-sm",
            "focus:outline-none focus:ring-2 focus:ring-ring",
            "placeholder:text-muted-foreground"
          )}
          autoFocus={autoFocus}
          autoComplete="off"
          aria-label={t("common.search")}
          aria-expanded={isOpen}
          aria-controls="search-suggestions"
          aria-autocomplete="list"
        />
        
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label={t("common.close")}
          >
            <X className="h-4 w-4" />
          </button>
        )}
        
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
        )}
      </div>

      {/* Suggestions Dropdown */}
      {isOpen && (showHistory || showSuggestions) && (
        <div
          id="search-suggestions"
          role="listbox"
          className="absolute left-0 right-0 top-full z-50 mt-1 max-h-[400px] overflow-y-auto rounded-lg border bg-popover p-2 shadow-lg"
        >
          {/* Search History */}
          {showHistory && (
            <div className="mb-2">
              <p className="mb-2 px-2 text-xs font-medium text-muted-foreground">
                Recent Searches
              </p>
              {searchHistory.slice(0, 5).map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(item)}
                  className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent"
                >
                  <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="flex-1 text-left">{item}</span>
                </button>
              ))}
            </div>
          )}

          {/* Suggested Queries */}
          {showSuggestions && suggestions.suggestedQueries.length > 0 && (
            <div className="mb-2">
              <p className="mb-2 px-2 text-xs font-medium text-muted-foreground">
                Suggestions
              </p>
              {suggestions.suggestedQueries.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(suggestion)}
                  className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent"
                >
                  <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="flex-1 text-left">{suggestion}</span>
                </button>
              ))}
            </div>
          )}

          {/* Top Categories */}
          {showSuggestions && suggestions.topCategories.length > 0 && (
            <div className="mb-2">
              <p className="mb-2 px-2 text-xs font-medium text-muted-foreground">
                Categories
              </p>
              {suggestions.topCategories.map((category) => (
                <button
                  key={category.slug}
                  onClick={() => handleCategoryClick(category.slug)}
                  className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent"
                >
                  <span className="flex-1 text-left">{category.name}</span>
                </button>
              ))}
            </div>
          )}

          {/* Top Products */}
          {showSuggestions && suggestions.topProducts.length > 0 && (
            <div>
              <p className="mb-2 px-2 text-xs font-medium text-muted-foreground">
                Products
              </p>
              {suggestions.topProducts.map((product) => (
                <button
                  key={product.id}
                  onClick={() => handleProductClick(product.slug)}
                  className="flex w-full items-center gap-3 rounded-md px-2 py-2 hover:bg-accent"
                >
                  <div className="relative h-10 w-10 overflow-hidden rounded bg-muted">
                    {product.media[0] && (
                      <Image
                        src={product.media[0].url}
                        alt={product.media[0].alt}
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="line-clamp-1 text-sm">{product.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatCurrency(
                        product.price.sale?.amount || product.price.list.amount,
                        locale === "vi" ? "VND" : "USD",
                        locale
                      )}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Clear History */}
          {showHistory && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => useUIStore.getState().clearSearchHistory()}
              className="mt-2 w-full"
            >
              Clear History
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
