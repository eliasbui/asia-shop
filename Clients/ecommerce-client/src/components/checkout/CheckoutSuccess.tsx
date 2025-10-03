'use client';

import Link from 'next/link';
import { CheckCircle, Package, Truck, Home, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export function CheckoutSuccess() {
  // Mock order data
  const orderNumber = `ORD${Date.now().toString().slice(-8)}`;
  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 3);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
        </div>

        {/* Success Message */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-green-600">
            Đặt hàng thành công!
          </h1>
          <p className="text-lg text-muted-foreground">
            Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đã được xác nhận và đang được xử lý.
          </p>
        </div>

        {/* Order Information */}
        <Card className="p-6 text-left">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">Thông tin đơn hàng</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mã đơn hàng:</span>
                  <span className="font-mono font-medium">{orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ngày đặt hàng:</span>
                  <span>{new Date().toLocaleDateString('vi-VN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Dự kiến giao hàng:</span>
                  <span>{estimatedDelivery.toLocaleDateString('vi-VN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phương thức thanh toán:</span>
                  <span>Thanh toán khi nhận hàng (COD)</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Next Steps */}
        <Card className="p-6 bg-blue-50 border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-4">Các bước tiếp theo</h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                <Package className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-medium text-blue-900 mb-1">Xác nhận đơn hàng</h4>
              <p className="text-blue-700">Bạn sẽ nhận được email xác nhận trong vài phút</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-medium text-blue-900 mb-1">Xử lý đơn hàng</h4>
              <p className="text-blue-700">Đơn hàng được đóng gói và chuẩn bị giao</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-medium text-blue-900 mb-1">Giao hàng</h4>
              <p className="text-blue-700">Đơn hàng được giao đến địa chỉ của bạn</p>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/account/orders">
              <Button variant="outline" className="w-full sm:w-auto">
                Xem chi tiết đơn hàng
              </Button>
            </Link>
            <Link href="/">
              <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
                <Home className="w-4 h-4 mr-2" />
                Về trang chủ
              </Button>
            </Link>
          </div>

          <Link href="/c/all">
            <Button variant="ghost" className="text-blue-600 hover:text-blue-700">
              <ShoppingBag className="w-4 h-4 mr-2" />
              Tiếp tục mua sắm
            </Button>
          </Link>
        </div>

        {/* Customer Support */}
        <Card className="p-4 bg-gray-50">
          <div className="text-center space-y-2">
            <h4 className="font-medium">Cần hỗ trợ?</h4>
            <p className="text-sm text-muted-foreground">
              Liên hệ đội ngũ chăm sóc khách hàng của chúng tôi
            </p>
            <div className="flex justify-center space-x-4 text-sm">
              <span>📞 1900 1234</span>
              <span>✉️ support@asiashop.vn</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}