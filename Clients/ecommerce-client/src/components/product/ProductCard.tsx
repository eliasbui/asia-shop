'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/lib/types/domain';
import { formatCurrency } from '@/lib/utils/format';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className = '' }: ProductCardProps) {
  const t = useTranslations('product');

  const renderPrice = () => {
    const { list, sale, flashSale } = product.price;

    return (
      <div className="space-y-1">
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-lg">
            {formatCurrency(sale?.amount || list.amount, list.currency)}
          </span>
          {sale && (
            <span className="text-sm text-muted-foreground line-through">
              {formatCurrency(list.amount, list.currency)}
            </span>
          )}
        </div>
        {flashSale && (
          <Badge variant="destructive" className="text-xs">
            Flash Sale - Ends Soon
          </Badge>
        )}
      </div>
    );
  };

  const renderStockStatus = () => {
    const status = product.variants?.[0]?.stock.status;
    if (!status || status === 'in-stock') return null;

    const variants = {
      'low-stock': { text: 'Còn ít', variant: 'secondary' as const },
      'out-of-stock': { text: 'Hết hàng', variant: 'destructive' as const },
    };

    const config = variants[status];
    return <Badge variant={config.variant} className="text-xs">{config.text}</Badge>;
  };

  return (
    <div className={`group relative bg-white rounded-lg border hover:shadow-lg transition-shadow duration-200 ${className}`}>
      <Link href={`/p/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden rounded-t-lg">
          <Image
            src={product.media[0]?.url || '/placeholder-product.jpg'}
            alt={product.media[0]?.alt || product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-200"
          />

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.badges?.includes('new') && (
              <Badge variant="default" className="text-xs">Mới</Badge>
            )}
            {product.badges?.includes('bestseller') && (
              <Badge variant="secondary" className="text-xs">Bán chạy</Badge>
            )}
          </div>

          {/* Action buttons */}
          <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="icon"
              variant="secondary"
              className="h-8 w-8"
              onClick={(e) => {
                e.preventDefault();
                // Add to wishlist logic
              }}
            >
              <Heart className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-medium text-sm mb-1 line-clamp-2 group-hover:text-primary transition-colors">
            {product.title}
          </h3>

          <p className="text-xs text-muted-foreground mb-2">{product.brand}</p>

          {/* Rating */}
          <div className="flex items-center space-x-1 mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.floor(product.rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              ({product.reviewCount})
            </span>
          </div>

          {renderPrice()}
          {renderStockStatus()}
        </div>
      </Link>

      {/* Quick Add to Cart */}
      <div className="px-4 pb-4">
        <Button
          size="sm"
          className="w-full"
          variant="outline"
          onClick={() => {
            // Add to cart logic
          }}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {t('addToCart')}
        </Button>
      </div>
    </div>
  );
}