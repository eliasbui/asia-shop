'use client';

import Link from 'next/link';
import { Shield, Truck, RefreshCw, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/lib/utils/format';

interface CartSummaryProps {
  subtotal: number;
  total: number;
}

export function CartSummary({ subtotal, total }: CartSummaryProps) {
  // Mock shipping and discount calculations
  const shippingFee = subtotal > 2000000 ? 0 : 30000; // Free shipping over 2M VND
  const discount = subtotal > 5000000 ? subtotal * 0.05 : 0; // 5% discount over 5M VND

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Tóm tắt đơn hàng</h3>

      <div className="space-y-4">
        {/* Price Breakdown */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Tạm tính</span>
            <span>{formatCurrency(subtotal, 'VND')}</span>
          </div>

          {shippingFee === 0 ? (
            <div className="flex justify-between text-sm text-green-600">
              <span>Phí vận chuyển</span>
              <span>Miễn phí</span>
            </div>
          ) : (
            <div className="flex justify-between text-sm">
              <span>Phí vận chuyển</span>
              <span>{formatCurrency(shippingFee, 'VND')}</span>
            </div>
          )}

          {discount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Giảm giá (5%)</span>
              <span>-{formatCurrency(discount, 'VND')}</span>
            </div>
          )}

          <Separator />

          <div className="flex justify-between font-semibold text-lg">
            <span>Tổng cộng</span>
            <span className="text-red-600">
              {formatCurrency(total + shippingFee - discount, 'VND')}
            </span>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-3 pt-4 border-t">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Truck className="h-4 w-4 text-blue-600" />
            <span>Miễn phí vận chuyển đơn trên 2 triệu</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4 text-blue-600" />
            <span>Bảo hành chính hãng</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <RefreshCw className="h-4 w-4 text-blue-600" />
            <span>Đổi trả trong 30 ngày</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Gift className="h-4 w-4 text-blue-600" />
            <span>Quà tặng độc quyền</span>
          </div>
        </div>

        {/* Coupon Code */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Mã giảm giá</label>
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Nhập mã giảm giá"
              className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button variant="outline" size="sm">
              Áp dụng
            </Button>
          </div>
        </div>

        {/* Checkout Button */}
        <Link href="/checkout">
          <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
            Thanh toán
          </Button>
        </Link>

        {/* Security Note */}
        <div className="text-center text-xs text-muted-foreground">
          <div className="flex items-center justify-center space-x-2">
            <Shield className="h-3 w-3" />
            <span>Bảo mật và thanh toán an toàn</span>
          </div>
        </div>
      </div>
    </Card>
  );
}