'use client'

import { useState } from 'react'
import { SearchFilters, Category, Brand } from '@/types'
import { ChevronDown, ChevronUp, X } from 'lucide-react'

interface ProductFiltersProps {
  filters: SearchFilters
  onFiltersChange: (filters: SearchFilters) => void
  categories: Category[]
  brands: Brand[]
  priceRange: { min: number; max: number }
}

export function ProductFilters({
  filters,
  onFiltersChange,
  categories,
  brands,
  priceRange,
}: ProductFiltersProps) {
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    price: true,
    brand: true,
    rating: true,
    stock: true,
  })

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const handleCategoryChange = (categoryId: string) => {
    onFiltersChange({
      ...filters,
      category: filters.category === categoryId ? undefined : categoryId,
      page: 1,
    })
  }

  const handleBrandChange = (brandId: string) => {
    onFiltersChange({
      ...filters,
      brand: filters.brand === brandId ? undefined : brandId,
      page: 1,
    })
  }

  const handlePriceChange = (type: 'min' | 'max', value: string) => {
    const numValue = value === '' ? undefined : Number(value)
    onFiltersChange({
      ...filters,
      [type === 'min' ? 'priceMin' : 'priceMax']: numValue,
      page: 1,
    })
  }

  const handleRatingChange = (rating: number) => {
    onFiltersChange({
      ...filters,
      rating: filters.rating === rating ? undefined : rating,
      page: 1,
    })
  }

  const handleStockChange = () => {
    onFiltersChange({
      ...filters,
      inStock: !filters.inStock,
      page: 1,
    })
  }

  const clearAllFilters = () => {
    onFiltersChange({
      page: 1,
      limit: 12,
      sortBy: 'newest',
    })
  }

  const hasActiveFilters = 
    filters.category || 
    filters.brand || 
    filters.priceMin !== undefined || 
    filters.priceMax !== undefined ||
    filters.rating !== undefined ||
    filters.inStock

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <X className="h-4 w-4" />
            Clear all
          </button>
        )}
      </div>

      {/* Categories */}
      <div className="border-b pb-4 mb-4">
        <button
          onClick={() => toggleSection('category')}
          className="w-full flex items-center justify-between mb-2"
        >
          <h3 className="font-medium text-gray-900">Category</h3>
          {expandedSections.category ? (
            <ChevronUp className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-500" />
          )}
        </button>
        {expandedSections.category && (
          <div className="space-y-2">
            {categories.map(category => (
              <label key={category.id} className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="category"
                  checked={filters.category === category.id}
                  onChange={() => handleCategoryChange(category.id)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  {category.name}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price Range */}
      <div className="border-b pb-4 mb-4">
        <button
          onClick={() => toggleSection('price')}
          className="w-full flex items-center justify-between mb-2"
        >
          <h3 className="font-medium text-gray-900">Price</h3>
          {expandedSections.price ? (
            <ChevronUp className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-500" />
          )}
        </button>
        {expandedSections.price && (
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.priceMin || ''}
              onChange={(e) => handlePriceChange('min', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              min={priceRange.min}
              max={priceRange.max}
            />
            <span className="text-gray-500">-</span>
            <input
              type="number"
              placeholder="Max"
              value={filters.priceMax || ''}
              onChange={(e) => handlePriceChange('max', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              min={priceRange.min}
              max={priceRange.max}
            />
          </div>
        )}
      </div>

      {/* Brands */}
      <div className="border-b pb-4 mb-4">
        <button
          onClick={() => toggleSection('brand')}
          className="w-full flex items-center justify-between mb-2"
        >
          <h3 className="font-medium text-gray-900">Brand</h3>
          {expandedSections.brand ? (
            <ChevronUp className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-500" />
          )}
        </button>
        {expandedSections.brand && (
          <div className="space-y-2">
            {brands.map(brand => (
              <label key={brand.id} className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="brand"
                  checked={filters.brand === brand.id}
                  onChange={() => handleBrandChange(brand.id)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  {brand.name}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Rating */}
      <div className="border-b pb-4 mb-4">
        <button
          onClick={() => toggleSection('rating')}
          className="w-full flex items-center justify-between mb-2"
        >
          <h3 className="font-medium text-gray-900">Rating</h3>
          {expandedSections.rating ? (
            <ChevronUp className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-500" />
          )}
        </button>
        {expandedSections.rating && (
          <div className="space-y-2">
            {[4, 3, 2, 1].map(rating => (
              <label key={rating} className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="rating"
                  checked={filters.rating === rating}
                  onChange={() => handleRatingChange(rating)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700 flex items-center">
                  {rating}+ stars
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Stock Status */}
      <div className="pb-4">
        <button
          onClick={() => toggleSection('stock')}
          className="w-full flex items-center justify-between mb-2"
        >
          <h3 className="font-medium text-gray-900">Availability</h3>
          {expandedSections.stock ? (
            <ChevronUp className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-500" />
          )}
        </button>
        {expandedSections.stock && (
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={filters.inStock}
              onChange={handleStockChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">
              In Stock Only
            </span>
          </label>
        )}
      </div>
    </div>
  )
}