'use client';

import { useState } from 'react';
import { Checkbox } from '@/components/common/checkbox';
import { Slider } from '@/components/common/slider';
import { Button } from '@/components/common/button';
import { X, SlidersHorizontal } from 'lucide-react';
import type { FilterParams } from '@/lib/types';

interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

interface FilterSidebarProps {
  filters: FilterParams;
  onFilterChange: (filters: FilterParams) => void;
  brands?: FilterOption[];
  categories?: FilterOption[];
  priceRange?: { min: number; max: number };
}

export function FilterSidebar({
  filters,
  onFilterChange,
  brands = [],
  categories = [],
  priceRange = { min: 0, max: 100000000 },
}: FilterSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localPriceRange, setLocalPriceRange] = useState([
    filters.priceMin || priceRange.min,
    filters.priceMax || priceRange.max,
  ]);

  const handleBrandToggle = (brand: string) => {
    const currentBrands = filters.brand || [];
    const newBrands = currentBrands.includes(brand)
      ? currentBrands.filter((b) => b !== brand)
      : [...currentBrands, brand];
    onFilterChange({ ...filters, brand: newBrands, page: 1 });
  };

  const handleCategoryChange = (category: string) => {
    onFilterChange({ ...filters, category, page: 1 });
  };

  const handlePriceChange = (value: number[]) => {
    setLocalPriceRange(value);
  };

  const applyPriceFilter = () => {
    onFilterChange({
      ...filters,
      priceMin: localPriceRange[0],
      priceMax: localPriceRange[1],
      page: 1,
    });
  };

  const handleRatingFilter = (rating: number) => {
    onFilterChange({
      ...filters,
      rating: filters.rating === rating ? undefined : rating,
      page: 1,
    });
  };

  const handleStockFilter = () => {
    onFilterChange({
      ...filters,
      inStock: !filters.inStock,
      page: 1,
    });
  };

  const handleFlashSaleFilter = () => {
    onFilterChange({
      ...filters,
      flashSale: !filters.flashSale,
      page: 1,
    });
  };

  const clearFilters = () => {
    onFilterChange({
      page: 1,
      size: filters.size,
      sort: filters.sort,
    });
    setLocalPriceRange([priceRange.min, priceRange.max]);
  };

  const hasActiveFilters =
    (filters.brand && filters.brand.length > 0) ||
    filters.category ||
    filters.priceMin !== undefined ||
    filters.priceMax !== undefined ||
    filters.rating ||
    filters.inStock ||
    filters.flashSale;

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-4">
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full"
        >
          <SlidersHorizontal className="w-4 h-4 mr-2" />
          Filters
          {hasActiveFilters && (
            <span className="ml-2 bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">
              !
            </span>
          )}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 z-40 h-screen lg:h-auto w-80 lg:w-full
          bg-background border-r lg:border-r-0 lg:border-none
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          overflow-y-auto
        `}
      >
        <div className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Filters</h2>
            <div className="flex items-center gap-2">
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-xs"
                >
                  Clear all
                </Button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="lg:hidden p-2 hover:bg-accent rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Categories */}
          {categories.length > 0 && (
            <div className="mb-6">
              <h3 className="font-medium mb-3">Category</h3>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <label
                    key={cat.value}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="category"
                      checked={filters.category === cat.value}
                      onChange={() => handleCategoryChange(cat.value)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm flex-1">{cat.label}</span>
                    {cat.count !== undefined && (
                      <span className="text-xs text-muted-foreground">
                        ({cat.count})
                      </span>
                    )}
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Brands */}
          {brands.length > 0 && (
            <div className="mb-6">
              <h3 className="font-medium mb-3">Brand</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {brands.map((brand) => (
                  <label
                    key={brand.value}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Checkbox
                      checked={filters.brand?.includes(brand.value)}
                      onCheckedChange={() => handleBrandToggle(brand.value)}
                    />
                    <span className="text-sm flex-1">{brand.label}</span>
                    {brand.count !== undefined && (
                      <span className="text-xs text-muted-foreground">
                        ({brand.count})
                      </span>
                    )}
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Price Range */}
          <div className="mb-6">
            <h3 className="font-medium mb-3">Price Range</h3>
            <Slider
              value={localPriceRange}
              onValueChange={handlePriceChange}
              min={priceRange.min}
              max={priceRange.max}
              step={100000}
              className="mb-4"
            />
            <div className="flex items-center gap-2 text-sm">
              <span>{localPriceRange[0].toLocaleString()} đ</span>
              <span>-</span>
              <span>{localPriceRange[1].toLocaleString()} đ</span>
            </div>
            <Button
              size="sm"
              onClick={applyPriceFilter}
              className="w-full mt-2"
            >
              Apply
            </Button>
          </div>

          {/* Rating */}
          <div className="mb-6">
            <h3 className="font-medium mb-3">Rating</h3>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <label
                  key={rating}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="rating"
                    checked={filters.rating === rating}
                    onChange={() => handleRatingFilter(rating)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">{rating}★ & up</span>
                </label>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div className="mb-6">
            <h3 className="font-medium mb-3">Availability</h3>
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={filters.inStock || false}
                onCheckedChange={handleStockFilter}
              />
              <span className="text-sm">In Stock Only</span>
            </label>
          </div>

          {/* Flash Sale */}
          <div className="mb-6">
            <h3 className="font-medium mb-3">Special Offers</h3>
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={filters.flashSale || false}
                onCheckedChange={handleFlashSaleFilter}
              />
              <span className="text-sm">Flash Sale</span>
            </label>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

