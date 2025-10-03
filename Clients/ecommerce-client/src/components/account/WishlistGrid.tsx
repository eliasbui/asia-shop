'use client';

import { useState } from 'react';
import { WishlistItem } from '@/lib/types/account';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Heart,
  ShoppingCart,
  Star,
  Eye,
  ExternalLink,
  AlertTriangle,
  Package
} from 'lucide-react';
import Link from 'next/link';

interface WishlistGridProps {
  items: WishlistItem[];
  viewMode: 'grid' | 'list';
  onAddToCart: (item: WishlistItem) => Promise<void>;
  onRemove: (itemId: string) => Promise<void>;
  isInCart: (productId: string, variantId: string) => boolean;
}

export function WishlistGrid({ items, viewMode, onAddToCart, onRemove, isInCart }: WishlistGridProps) {
  const [loadingItems, setLoadingItems] = useState<Set<string>>(new Set());
  const [removedItems, setRemovedItems] = useState<Set<string>>(new Set());

  const handleAddToCart = async (item: WishlistItem) => {
    setLoadingItems(prev => new Set(prev).add(item.id));
    try {
      await onAddToCart(item);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setLoadingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(item.id);
        return newSet;
      });
    }
  };

  const handleRemove = async (itemId: string) => {
    setLoadingItems(prev => new Set(prev).add(itemId));
    try {
      await onRemove(itemId);
      setRemovedItems(prev => new Set(prev).add(itemId));
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
    } finally {
      setLoadingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  const formatPrice = (price: number, originalPrice?: number) => {
    const priceVND = new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(price * 23000);

    if (originalPrice && originalPrice > price) {
      const originalVND = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0,
      }).format(originalPrice * 23000);

      return { price: priceVND, original: originalVND };
    }

    return { price: priceVND };
  };

  const renderStars = (rating?: number) => {
    if (!rating) return null;

    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="text-sm text-muted-foreground ml-1">
          ({rating})
        </span>
      </div>
    );
  };

  if (viewMode === 'list') {
    return (
      <div className="space-y-4">
        {items.map((item) => {
          if (removedItems.has(item.id)) return null;

          const price = formatPrice(item.product.price, item.product.originalPrice);
          const inCart = isInCart(item.product.id, item.variantId || 'default');
          const isLoading = loadingItems.has(item.id);

          return (
            <Card key={item.id} className={`p-4 transition-opacity ${removedItems.has(item.id) ? 'opacity-50' : ''}`}>
              <div className="flex items-center space-x-4">
                {/* Product Image */}
                <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  {item.product.image ? (
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-lg truncate">
                        <Link
                          href={`/products/${item.product.slug}`}
                          className="hover:text-blue-600 transition-colors"
                        >
                          {item.product.name}
                        </Link>
                      </h3>
                      <div className="flex items-center space-x-2 mt-1">
                        {renderStars(item.product.rating)}
                        {item.product.reviewCount && (
                          <span className="text-sm text-muted-foreground">
                            ({item.product.reviewCount} đánh giá)
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className="font-semibold text-lg">{price.price}</span>
                        {price.original && (
                          <span className="text-sm text-muted-foreground line-through">
                            {price.original}
                          </span>
                        )}
                        {price.original && (
                          <Badge variant="destructive" className="text-xs">
                            -{Math.round(((item.product.originalPrice! - item.product.price) / item.product.originalPrice!) * 100)}%
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Stock Status */}
                    <div className="flex flex-col items-end space-y-2">
                      {item.product.inStock ? (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          Còn hàng
                        </Badge>
                      ) : (
                        <Badge variant="destructive">
                          Hết hàng
                        </Badge>
                      )}

                      {/* Actions */}
                      <div className="flex items-center space-x-2">
                        {item.product.inStock && !inCart && (
                          <Button
                            size="sm"
                            onClick={() => handleAddToCart(item)}
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <>
                                <ShoppingCart className="w-4 h-4 mr-1" />
                                Thêm vào giỏ
                              </>
                            )}
                          </Button>
                        )}

                        {inCart && (
                          <Button size="sm" variant="outline" disabled>
                            <ShoppingCart className="w-4 h-4 mr-1" />
                            Đã trong giỏ
                          </Button>
                        )}

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRemove(item.id)}
                          disabled={isLoading}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          {isLoading ? (
                            <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Heart className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Added Date */}
                  <div className="text-xs text-muted-foreground mt-2">
                    Thêm vào {new Date(item.addedAt).toLocaleDateString('vi-VN')}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    );
  }

  // Grid View
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {items.map((item) => {
        if (removedItems.has(item.id)) return null;

        const price = formatPrice(item.product.price, item.product.originalPrice);
        const inCart = isInCart(item.product.id, item.variantId || 'default');
        const isLoading = loadingItems.has(item.id);

        return (
          <Card key={item.id} className={`overflow-hidden transition-opacity ${removedItems.has(item.id) ? 'opacity-50' : ''}`}>
            {/* Product Image */}
            <div className="relative">
              <Link href={`/products/${item.product.slug}`}>
                <div className="aspect-square bg-gray-100 overflow-hidden group">
                  {item.product.image ? (
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                </div>
              </Link>

              {/* Stock Badge */}
              <div className="absolute top-2 left-2">
                {item.product.inStock ? (
                  <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                    Còn hàng
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="text-xs">
                    Hết hàng
                  </Badge>
                )}
              </div>

              {/* Quick Actions */}
              <div className="absolute top-2 right-2 flex flex-col space-y-2">
                <Button
                  size="sm"
                  variant="secondary"
                  className="w-8 h-8 p-0 rounded-full bg-white/90 hover:bg-white"
                  onClick={() => handleRemove(item.id)}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="w-3 h-3 border border-gray-600 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Heart className="w-3 h-3 text-red-600 fill-current" />
                  )}
                </Button>
              </div>

              {/* Discount Badge */}
              {item.product.originalPrice && item.product.originalPrice > item.product.price && (
                <div className="absolute bottom-2 left-2">
                  <Badge variant="destructive" className="text-xs">
                    -{Math.round(((item.product.originalPrice - item.product.price) / item.product.originalPrice) * 100)}%
                  </Badge>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="p-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-sm line-clamp-2">
                  <Link
                    href={`/products/${item.product.slug}`}
                    className="hover:text-blue-600 transition-colors"
                  >
                    {item.product.name}
                  </Link>
                </h3>

                {/* Rating */}
                {renderStars(item.product.rating)}

                {/* Price */}
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-lg">{price.price}</span>
                  {price.original && (
                    <span className="text-sm text-muted-foreground line-through">
                      {price.original}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="space-y-2 pt-2">
                  {item.product.inStock ? (
                    inCart ? (
                      <Button size="sm" className="w-full" disabled>
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Đã trong giỏ hàng
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        className="w-full"
                        onClick={() => handleAddToCart(item)}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        ) : (
                          <ShoppingCart className="w-4 h-4 mr-2" />
                        )}
                        Thêm vào giỏ
                      </Button>
                    )
                  ) : (
                    <Alert>
                      <AlertTriangle className="w-4 h-4" />
                      <AlertDescription className="text-xs">
                        Sản phẩm hiện hết hàng
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                {/* Added Date */}
                <div className="text-xs text-muted-foreground">
                  Thêm vào {new Date(item.addedAt).toLocaleDateString('vi-VN')}
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}