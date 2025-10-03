'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { X, ShoppingCart, Heart, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Product, Variant } from '@/lib/types/domain';
import { formatCurrency } from '@/lib/utils/format';

interface ProductQuickViewProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductQuickView({ product, isOpen, onClose }: ProductQuickViewProps) {
  const t = useTranslations('product');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<Variant | undefined>(
    product.variants?.[0]
  );
  const [quantity, setQuantity] = useState(1);

  const handleNextImage = () => {
    setSelectedImageIndex((prev) =>
      prev === product.media.length - 1 ? 0 : prev + 1
    );
  };

  const handlePrevImage = () => {
    setSelectedImageIndex((prev) =>
      prev === 0 ? product.media.length - 1 : prev - 1
    );
  };

  const handleVariantChange = (variant: Variant) => {
    setSelectedVariant(variant);
    setSelectedImageIndex(0);
  };

  const renderPrice = () => {
    const price = selectedVariant?.price || product.price;
    const { list, sale, flashSale } = price;

    return (
      <div className="space-y-2">
        <div className="flex items-center space-x-3">
          <span className="text-2xl font-bold text-primary">
            {formatCurrency(sale?.amount || list.amount, list.currency)}
          </span>
          {sale && (
            <span className="text-lg text-muted-foreground line-through">
              {formatCurrency(list.amount, list.currency)}
            </span>
          )}
          {sale && price.percentOff && (
            <Badge variant="destructive">
              -{price.percentOff}%
            </Badge>
          )}
        </div>
        {flashSale && (
          <div className="flex items-center space-x-2">
            <Badge variant="destructive" className="animate-pulse">
              Flash Sale
            </Badge>
            <span className="text-sm text-muted-foreground">
              Ends in {new Date(flashSale.endsAt).toLocaleTimeString()}
            </span>
          </div>
        )}
      </div>
    );
  };

  const renderStockStatus = () => {
    const status = selectedVariant?.stock.status || 'in-stock';
    const qty = selectedVariant?.stock.qty;

    if (status === 'in-stock') {
      return (
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm text-green-600">In Stock</span>
          {qty && qty > 0 && (
            <span className="text-sm text-muted-foreground">
              ({qty} available)
            </span>
          )}
        </div>
      );
    }

    if (status === 'low-stock') {
      return (
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
          <span className="text-sm text-yellow-600">Low Stock</span>
          {qty && qty > 0 && (
            <span className="text-sm text-muted-foreground">
              (Only {qty} left)
            </span>
          )}
        </div>
      );
    }

    return (
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
        <span className="text-sm text-red-600">Out of Stock</span>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product.title}</DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-lg border">
              <Image
                src={product.media[selectedImageIndex]?.url || '/placeholder-product.jpg'}
                alt={product.media[selectedImageIndex]?.alt || product.title}
                fill
                className="object-cover"
              />

              {product.media.length > 1 && (
                <>
                  <Button
                    size="icon"
                    variant="outline"
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                    onClick={handlePrevImage}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                    onClick={handleNextImage}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}

              {/* Badges */}
              <div className="absolute top-2 left-2 flex flex-col gap-1">
                {product.badges?.includes('new') && (
                  <Badge variant="default">New</Badge>
                )}
                {product.badges?.includes('bestseller') && (
                  <Badge variant="secondary">Bestseller</Badge>
                )}
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {product.media.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {product.media.map((media, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative w-16 h-16 rounded border-2 transition-all ${
                      selectedImageIndex === index
                        ? 'border-primary'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Image
                      src={media.url}
                      alt={media.alt}
                      fill
                      className="object-cover rounded"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-4">
            {/* Rating */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {product.rating} ({product.reviewCount} reviews)
              </span>
            </div>

            {/* Brand */}
            <p className="text-lg text-muted-foreground">{product.brand}</p>

            {/* Price */}
            {renderPrice()}

            {/* Stock Status */}
            {renderStockStatus()}

            {/* Short Description */}
            {product.shortDesc && (
              <p className="text-sm text-muted-foreground leading-relaxed">
                {product.shortDesc}
              </p>
            )}

            {/* Variant Selector */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Options</h4>
                <div className="grid grid-cols-2 gap-2">
                  {product.variants.map((variant) => (
                    <Button
                      key={variant.id}
                      variant={selectedVariant?.id === variant.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleVariantChange(variant)}
                      className="justify-start"
                    >
                      {Object.entries(variant.attributes).map(([key, value]) => (
                        <span key={key}>
                          {key}: {value}
                        </span>
                      ))}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium">Quantity:</span>
              <div className="flex items-center space-x-2">
                <Button
                  size="icon"
                  variant="outline"
                  className="h-8 w-8"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </Button>
                <span className="w-8 text-center">{quantity}</span>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-8 w-8"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <Button
                className="flex-1"
                disabled={selectedVariant?.stock.status === 'out-of-stock'}
                onClick={() => {
                  // Add to cart logic
                  console.log('Adding to cart:', {
                    product: product.id,
                    variant: selectedVariant?.id,
                    quantity
                  });
                }}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
              <Button
                size="icon"
                variant="outline"
                onClick={() => {
                  // Add to wishlist logic
                }}
              >
                <Heart className="h-4 w-4" />
              </Button>
            </div>

            {/* Key Features */}
            {product.specs && Object.keys(product.specs).length > 0 && (
              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Key Features</h4>
                <div className="space-y-1">
                  {Object.entries(product.specs).slice(0, 3).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{key}:</span>
                      <span>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}