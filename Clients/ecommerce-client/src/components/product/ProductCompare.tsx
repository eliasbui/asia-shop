'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { X, Plus, Check, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Product } from '@/lib/types/domain';
import { formatCurrency } from '@/lib/utils/format';

interface ProductCompareProps {
  className?: string;
}

interface CompareItem {
  product: Product;
  selectedVariant?: string;
}

export function ProductCompare({ className = '' }: ProductCompareProps) {
  const t = useTranslations('product');
  const [compareItems, setCompareItems] = useState<CompareItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const addToCompare = (product: Product) => {
    if (compareItems.length >= 3) {
      // Remove oldest item if already at max
      setCompareItems(prev => [...prev.slice(1), { product }]);
    } else if (!compareItems.some(item => item.product.id === product.id)) {
      setCompareItems(prev => [...prev, { product }]);
    }
  };

  const removeFromCompare = (productId: string) => {
    setCompareItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const clearCompare = () => {
    setCompareItems([]);
  };

  const getComparisonSpecs = () => {
    const allSpecs = new Set<string>();
    compareItems.forEach(item => {
      if (item.product.specs) {
        Object.keys(item.product.specs).forEach(spec => allSpecs.add(spec));
      }
    });
    return Array.from(allSpecs);
  };

  const getSpecValue = (product: Product, spec: string) => {
    return product.specs?.[spec] || '-';
  };

  if (compareItems.length === 0) {
    return (
      <div className={`hidden ${className}`}>
        <Button
          variant="outline"
          size="sm"
          disabled
          className="opacity-50 cursor-not-allowed"
        >
          Compare Products (0/3)
        </Button>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="relative"
        >
          Compare Products ({compareItems.length}/3)
          {compareItems.length > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
              {compareItems.length}
            </span>
          )}
        </Button>
        {compareItems.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearCompare}
            className="text-muted-foreground hover:text-destructive"
          >
            Clear All
          </Button>
        )}
      </div>

      {/* Quick Compare Bar */}
      {compareItems.length > 0 && !isOpen && (
        <div className="mt-2 p-2 bg-muted rounded-lg">
          <div className="flex space-x-2 overflow-x-auto">
            {compareItems.map((item) => (
              <div key={item.product.id} className="flex-shrink-0 flex items-center space-x-2 bg-background rounded p-2 border">
                <Image
                  src={item.product.media[0]?.url || '/placeholder-product.jpg'}
                  alt={item.product.title}
                  width={40}
                  height={40}
                  className="object-cover rounded"
                />
                <span className="text-xs font-medium truncate max-w-[100px]">
                  {item.product.title}
                </span>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6"
                  onClick={() => removeFromCompare(item.product.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
            {compareItems.length < 3 && (
              <Button
                variant="dashed"
                size="sm"
                className="flex-shrink-0 border-dashed"
                disabled
              >
                <Plus className="h-3 w-3 mr-1" />
                Add Product
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Full Compare View */}
      {isOpen && (
        <Card className="mt-4">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Product Comparison</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left p-4 font-medium">Feature</th>
                    {compareItems.map((item) => (
                      <th key={item.product.id} className="p-4">
                        <div className="space-y-2">
                          <div className="relative">
                            <Image
                              src={item.product.media[0]?.url || '/placeholder-product.jpg'}
                              alt={item.product.title}
                              width={120}
                              height={120}
                              className="object-cover rounded-lg mx-auto"
                            />
                            <Button
                              size="icon"
                              variant="destructive"
                              className="absolute -top-2 -right-2 h-6 w-6"
                              onClick={() => removeFromCompare(item.product.id)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                          <h3 className="font-medium text-sm text-center line-clamp-2">
                            {item.product.title}
                          </h3>
                          <p className="text-xs text-muted-foreground text-center">
                            {item.product.brand}
                          </p>
                        </div>
                      </th>
                    ))}
                    {compareItems.length < 3 && (
                      <th className="p-4">
                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                          <Plus className="h-8 w-8 mb-2" />
                          <span className="text-sm">Add Product</span>
                        </div>
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {/* Price */}
                  <tr className="border-t">
                    <td className="p-4 font-medium">Price</td>
                    {compareItems.map((item) => {
                      const { list, sale } = item.product.price;
                      return (
                        <td key={item.product.id} className="p-4">
                          <div className="text-center space-y-1">
                            <div className="font-bold text-lg">
                              {formatCurrency(sale?.amount || list.amount, list.currency)}
                            </div>
                            {sale && (
                              <div className="text-sm text-muted-foreground line-through">
                                {formatCurrency(list.amount, list.currency)}
                              </div>
                            )}
                          </div>
                        </td>
                      );
                    })}
                    {compareItems.length < 3 && <td className="p-4"></td>}
                  </tr>

                  {/* Rating */}
                  <tr className="border-t">
                    <td className="p-4 font-medium">Rating</td>
                    {compareItems.map((item) => (
                      <td key={item.product.id} className="p-4">
                        <div className="flex items-center justify-center space-x-1">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < Math.floor(item.product.rating)
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            ({item.product.reviewCount})
                          </span>
                        </div>
                      </td>
                    ))}
                    {compareItems.length < 3 && <td className="p-4"></td>}
                  </tr>

                  {/* Stock Status */}
                  <tr className="border-t">
                    <td className="p-4 font-medium">Availability</td>
                    {compareItems.map((item) => {
                      const status = item.product.variants?.[0]?.stock.status || 'in-stock';
                      return (
                        <td key={item.product.id} className="p-4">
                          <div className="flex justify-center">
                            {status === 'in-stock' && (
                              <Badge variant="default" className="bg-green-100 text-green-800">
                                In Stock
                              </Badge>
                            )}
                            {status === 'low-stock' && (
                              <Badge variant="secondary">
                                Low Stock
                              </Badge>
                            )}
                            {status === 'out-of-stock' && (
                              <Badge variant="destructive">
                                Out of Stock
                              </Badge>
                            )}
                          </div>
                        </td>
                      );
                    })}
                    {compareItems.length < 3 && <td className="p-4"></td>}
                  </tr>

                  {/* Badges */}
                  <tr className="border-t">
                    <td className="p-4 font-medium">Features</td>
                    {compareItems.map((item) => (
                      <td key={item.product.id} className="p-4">
                        <div className="flex flex-wrap gap-1 justify-center">
                          {item.product.badges?.map((badge) => (
                            <Badge
                              key={badge}
                              variant={badge === 'new' ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {badge}
                            </Badge>
                          ))}
                        </div>
                      </td>
                    ))}
                    {compareItems.length < 3 && <td className="p-4"></td>}
                  </tr>

                  {/* Specifications */}
                  {getComparisonSpecs().map((spec) => (
                    <tr key={spec} className="border-t">
                      <td className="p-4 font-medium">{spec}</td>
                      {compareItems.map((item) => (
                        <td key={item.product.id} className="p-4">
                          <div className="text-center text-sm">
                            {getSpecValue(item.product, spec)}
                          </div>
                        </td>
                      ))}
                      {compareItems.length < 3 && <td className="p-4"></td>}
                    </tr>
                  ))}

                  {/* Actions */}
                  <tr className="border-t">
                    <td className="p-4 font-medium">Actions</td>
                    {compareItems.map((item) => (
                      <td key={item.product.id} className="p-4">
                        <div className="flex flex-col space-y-2">
                          <Button size="sm" className="w-full">
                            Add to Cart
                          </Button>
                          <Button size="sm" variant="outline" className="w-full">
                            View Details
                          </Button>
                        </div>
                      </td>
                    ))}
                    {compareItems.length < 3 && <td className="p-4"></td>}
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Export hook for adding products to compare
export const useProductCompare = () => {
  const [compareItems, setCompareItems] = useState<CompareItem[]>([]);

  const addToCompare = (product: Product) => {
    if (!compareItems.some(item => item.product.id === product.id)) {
      setCompareItems(prev => [...prev, { product }]);
      return true;
    }
    return false;
  };

  const removeFromCompare = (productId: string) => {
    setCompareItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const isInCompare = (productId: string) => {
    return compareItems.some(item => item.product.id === productId);
  };

  const compareCount = compareItems.length;

  return {
    compareItems,
    addToCompare,
    removeFromCompare,
    isInCompare,
    compareCount
  };
};