'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { MapPin, Truck, CreditCard, Check, AlertCircle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/format';
import { CartItem } from '@/lib/state/cartStore';

interface ReviewStepProps {
  data: any;
  items: CartItem[];
  subtotal: number;
  total: number;
  onPrevious: () => void;
  onConfirm: () => void;
}

export function ReviewStep({ data, items, subtotal, total, onPrevious, onConfirm }: ReviewStepProps) {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!termsAccepted) return;

    setIsSubmitting(true);
    try {
      // Simulate order processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      onConfirm();
    } catch (error) {
      console.error('Order submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPaymentMethodName = () => {
    const paymentMethods = {
      cod: 'Thanh toán khi nhận hàng (COD)',
      card: 'Thẻ tín dụng/Ghi nợ',
      banking: 'Chuyển khoản ngân hàng',
      ewallet: 'Ví điện tử'
    };
    return paymentMethods[data.payment.method as keyof typeof paymentMethods] || data.payment.method;
  };

  const getShippingMethodName = () => {
    const shippingMethods = {
      standard: 'Giao hàng tiêu chuẩn',
      express: 'Giao hàng nhanh',
      overnight: 'Giao hàng trong ngày'
    };
    return shippingMethods[data.shipping.method as keyof typeof shippingMethods] || data.shipping.method;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Xác nhận đơn hàng</h2>
        <p className="text-muted-foreground">
          Vui lòng kiểm tra lại thông tin đơn hàng trước khi xác nhận
        </p>
      </div>

      {/* Order Information */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Shipping Address */}
        <Card className="p-4">
          <div className="flex items-center space-x-2 mb-3">
            <MapPin className="w-4 h-4 text-blue-600" />
            <h3 className="font-semibold">Địa chỉ giao hàng</h3>
          </div>
          <div className="space-y-1 text-sm">
            <p className="font-medium">{data.shippingAddress.fullName}</p>
            <p>{data.shippingAddress.phone}</p>
            <p>{data.shippingAddress.address}</p>
            <p>{data.shippingAddress.district}, {data.shippingAddress.city}</p>
          </div>
        </Card>

        {/* Shipping & Payment */}
        <div className="space-y-4">
          <Card className="p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Truck className="w-4 h-4 text-blue-600" />
              <h3 className="font-semibold">Vận chuyển</h3>
            </div>
            <p className="text-sm">{getShippingMethodName()}</p>
            <p className="text-sm text-muted-foreground">
              {data.shipping.cost === 0 ? 'Miễn phí' : formatCurrency(data.shipping.cost, 'VND')}
            </p>
          </Card>

          <Card className="p-4">
            <div className="flex items-center space-x-2 mb-3">
              <CreditCard className="w-4 h-4 text-blue-600" />
              <h3 className="font-semibold">Thanh toán</h3>
            </div>
            <p className="text-sm">{getPaymentMethodName()}</p>
            {data.payment.cardNumber && (
              <p className="text-sm text-muted-foreground">
                Thẻ kết thúc bằng {data.payment.cardNumber.slice(-4)}
              </p>
            )}
          </Card>
        </div>
      </div>

      {/* Order Items */}
      <Card className="p-4">
        <h3 className="font-semibold mb-4">Sản phẩm ({items.length})</h3>
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gray-100 rounded flex-shrink-0" />
              <div className="flex-1">
                <p className="font-medium">{item.product.title}</p>
                <p className="text-sm text-muted-foreground">
                  {Object.entries(item.variant.attributes)
                    .map(([key, value]) => `${key}: ${value}`)
                    .join(', ')}
                </p>
                <p className="text-sm">Số lượng: {item.quantity}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">
                  {formatCurrency(
                    (item.variant.price?.sale?.amount || item.variant.price?.list.amount || item.product.price.sale?.amount || item.product.price.list.amount) * item.quantity,
                    'VND'
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Price Summary */}
      <Card className="p-4">
        <h3 className="font-semibold mb-4">Chi tiết thanh toán</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Tạm tính ({items.length} sản phẩm)</span>
            <span>{formatCurrency(subtotal, 'VND')}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Phí vận chuyển</span>
            <span>
              {data.shipping.cost === 0 ? 'Miễn phí' : formatCurrency(data.shipping.cost, 'VND')}
            </span>
          </div>
          <Separator />
          <div className="flex justify-between font-semibold text-lg">
            <span>Tổng cộng</span>
            <span className="text-red-600">{formatCurrency(total, 'VND')}</span>
          </div>
        </div>
      </Card>

      {/* Important Notice */}
      <Card className="p-4 bg-yellow-50 border-yellow-200">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-yellow-900 mb-1">Lưu ý quan trọng</h4>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• Đơn hàng sẽ được xác nhận qua SMS và Email</li>
              <li>• Thời gian giao hàng dự kiến: 1-5 ngày làm việc</li>
              <li>• Bạn có thể hủy đơn hàng trong vòng 1 giờ sau khi đặt</li>
              <li>• Chính sách đổi trả: 30 ngày kể từ ngày nhận hàng</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Terms and Conditions */}
      <Card className="p-4">
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="terms"
              checked={termsAccepted}
              onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
            />
            <div className="text-sm">
              <label htmlFor="terms" className="cursor-pointer">
                Tôi đã đọc và đồng ý với{' '}
                <a href="/legal/terms" className="text-blue-600 hover:underline">
                  Điều khoản sử dụng
                </a>{' '}
                và{' '}
                <a href="/legal/privacy" className="text-blue-600 hover:underline">
                  Chính sách bảo mật
                </a>
              </label>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox
              id="confirm"
              checked={termsAccepted}
              onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
            />
            <label htmlFor="confirm" className="text-sm cursor-pointer">
              Tôi xác nhận thông tin đơn hàng là chính xác và đồng ý đặt hàng
            </label>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious} disabled={isSubmitting}>
          Quay lại
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!termsAccepted || isSubmitting}
          className="bg-green-600 hover:bg-green-700 min-w-32"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Đang xử lý...
            </>
          ) : (
            <>
              <Check className="w-4 h-4 mr-2" />
              Xác nhận đặt hàng
            </>
          )}
        </Button>
      </div>
    </div>
  );
}