'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { ShoppingCart, User, Menu, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useCartStore } from '@/lib/state/cartStore';
import { formatCurrency } from '@/lib/utils/format';
import { AutosuggestInput } from '@/components/search/AutosuggestInput';

export function Header() {
  const t = useTranslations('common');
  const router = useRouter();
  const { items, getTotalItems, getTotalPrice, updateQuantity } = useCartStore();
  const totalItems = getTotalItems();
  const { total } = getTotalPrice();

  const handleSearch = (query: string) => {
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded bg-primary" />
            <span className="font-bold text-xl">AsiaShop</span>
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <AutosuggestInput
              placeholder={t('searchPlaceholder')}
              onSearch={handleSearch}
              className="w-full"
            />
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/c/all" className="text-sm font-medium hover:text-primary">
              Sản phẩm
            </Link>
            <Link href="/collections" className="text-sm font-medium hover:text-primary">
              Bộ sưu tập
            </Link>
            <Link href="/help" className="text-sm font-medium hover:text-primary">
              Hỗ trợ
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {totalItems > 0 && (
                    <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center text-xs">
                      {totalItems}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-96">
                {items.length === 0 ? (
                  <div className="p-4 text-center">
                    <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm font-medium">Giỏ hàng trống</p>
                    <p className="text-xs text-muted-foreground">Thêm sản phẩm để bắt đầu</p>
                  </div>
                ) : (
                  <>
                    <div className="max-h-96 overflow-y-auto">
                      {items.map((item) => (
                        <div key={item.id} className="p-2 border-b">
                          <div className="flex gap-2">
                            <div className="w-12 h-12 bg-gray-100 rounded flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">
                                {item.product.title}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {Object.entries(item.variant.attributes)
                                  .map(([key, value]) => `${key}: ${value}`)
                                  .join(', ')}
                              </p>
                              <div className="flex items-center justify-between mt-1">
                                <span className="text-sm font-semibold">
                                  {formatCurrency(
                                    (item.variant.price?.sale?.amount || item.variant.price?.list.amount || item.product.price.sale?.amount || item.product.price.list.amount) * item.quantity,
                                    'VND'
                                  )}
                                </span>
                                <div className="flex items-center space-x-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0"
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  >
                                    <Minus className="h-3 w-3" />
                                  </Button>
                                  <span className="text-sm w-6 text-center">
                                    {item.quantity}
                                  </span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0"
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  >
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-4 border-t">
                      <div className="flex justify-between mb-3">
                        <span className="font-medium">Tổng cộng:</span>
                        <span className="font-bold text-red-600">
                          {formatCurrency(total, 'VND')}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <Link href="/cart" className="block">
                          <Button variant="outline" className="w-full">
                            Xem giỏ hàng
                          </Button>
                        </Link>
                        <Link href="/checkout" className="block">
                          <Button className="w-full bg-red-600 hover:bg-red-700">
                            Thanh toán
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-3">
          <AutosuggestInput
            placeholder={t('searchPlaceholder')}
            onSearch={handleSearch}
            className="w-full"
          />
        </div>
      </div>
    </header>
  );
}