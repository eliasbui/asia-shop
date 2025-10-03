'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/lib/state/cartStore';
import { formatCurrency } from '@/lib/utils/format';
import { CartItem } from '@/components/cart/CartItem';
import { CartSummary } from '@/components/cart/CartSummary';
import { EmptyCart } from '@/components/cart/EmptyCart';

export function CartPage() {
  const t = useTranslations('cart');
  const { items, clearCart, getTotalPrice } = useCartStore();
  const { subtotal, total } = getTotalPrice();

  if (items.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('cart')}</h1>
        <p className="text-muted-foreground">
          {items.length} {items.length === 1 ? 'sản phẩm' : 'sản phẩm'} trong giỏ hàng
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}

          {/* Cart Actions */}
          <div className="flex items-center justify-between pt-4 border-t">
            <Button
              variant="outline"
              onClick={clearCart}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Xóa giỏ hàng
            </Button>

            <Link href="/c/all">
              <Button variant="outline">
                <ShoppingBag className="h-4 w-4 mr-2" />
                {t('continueShopping')}
              </Button>
            </Link>
          </div>
        </div>

        {/* Cart Summary */}
        <div>
          <CartSummary subtotal={subtotal} total={total} />
        </div>
      </div>

      {/* Recommended Products */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Có thể bạn cũng thích</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {/* Mock recommended products */}
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="bg-white rounded-lg border p-4 text-center">
              <div className="w-full h-24 bg-gray-100 rounded mb-2" />
              <p className="text-sm font-medium truncate">Sản phẩm gợi ý {i + 1}</p>
              <p className="text-sm text-muted-foreground">1.290.000₫</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}