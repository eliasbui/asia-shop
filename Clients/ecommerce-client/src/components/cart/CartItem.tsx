'use client';

import Image from 'next/image';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/lib/state/cartStore';
import { formatCurrency } from '@/lib/utils/format';
import { CartItem as CartItemType } from '@/lib/state/cartStore';

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore();
  const { product, variant, quantity } = item;

  const price = variant.price || product.price;
  const unitPrice = price.sale?.amount || price.list.amount;
  const totalPrice = unitPrice * quantity;

  const handleQuantityChange = (newQuantity: number) => {
    updateQuantity(item.id, newQuantity);
  };

  const handleRemove = () => {
    removeItem(item.id);
  };

  const renderStockStatus = () => {
    const status = variant.stock?.status;
    if (!status || status === 'in-stock') return null;

    const statusConfig = {
      'low-stock': { text: 'Còn ít', variant: 'secondary' as const },
      'out-of-stock': { text: 'Hết hàng', variant: 'destructive' as const },
    };

    const config = statusConfig[status];
    return <Badge variant={config.variant} className="text-xs">{config.text}</Badge>;
  };

  return (
    <Card className="p-6">
      <div className="flex gap-4">
        {/* Product Image */}
        <div className="relative w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
          <Image
            src={variant.media?.[0]?.url || product.media[0]?.url || '/placeholder-product.jpg'}
            alt={variant.media?.[0]?.alt || product.media[0]?.alt || product.title}
            fill
            className="object-cover"
          />
          {price.flashSale && (
            <Badge variant="destructive" className="absolute top-1 left-1 text-xs">
              Flash Sale
            </Badge>
          )}
        </div>

        {/* Product Info */}
        <div className="flex-1 space-y-2">
          <div>
            <h3 className="font-medium text-lg line-clamp-1">{product.title}</h3>
            <p className="text-sm text-muted-foreground">{product.brand}</p>

            {/* Variant Info */}
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-muted-foreground">
                {Object.entries(variant.attributes)
                  .map(([key, value]) => `${key}: ${value}`)
                  .join(', ')}
              </span>
              <span className="text-xs text-muted-foreground">|</span>
              <span className="text-xs text-muted-foreground">SKU: {variant.sku}</span>
            </div>
          </div>

          {/* Price and Stock */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-lg">
                  {formatCurrency(unitPrice, price.list.currency)}
                </span>
                {price.sale && (
                  <span className="text-sm text-muted-foreground line-through">
                    {formatCurrency(price.list.amount, price.list.currency)}
                  </span>
                )}
              </div>
              {renderStockStatus()}
            </div>

            <div className="text-right">
              <div className="font-semibold text-lg">
                {formatCurrency(totalPrice, price.list.currency)}
              </div>
              {price.sale && price.percentOff && (
                <div className="text-xs text-green-600">
                  Tiết kiệm {formatCurrency(
                    price.list.amount * quantity - totalPrice,
                    price.list.currency
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Số lượng:</span>
              <div className="flex items-center border rounded-lg">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                  className="h-8 w-8 p-0"
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="w-12 text-center text-sm font-medium">
                  {quantity}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={variant.stock?.status === 'out-of-stock'}
                  className="h-8 w-8 p-0"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemove}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}