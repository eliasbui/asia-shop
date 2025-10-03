'use client';

import { Order } from '@/lib/types/account';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import {
  X,
  Package,
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  CreditCard,
  Phone,
  Mail,
  User,
  Calendar,
  DollarSign,
  RefreshCw,
  Download
} from 'lucide-react';

interface OrderHistoryProps {
  order: Order;
  onClose: () => void;
}

export function OrderHistory({ order, onClose }: OrderHistoryProps) {
  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      refunded: 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status: string) => {
    const texts = {
      pending: 'Chờ xử lý',
      processing: 'Đang xử lý',
      shipped: 'Đang giao hàng',
      delivered: 'Đã giao hàng',
      cancelled: 'Đã hủy',
      refunded: 'Đã hoàn tiền'
    };
    return texts[status as keyof typeof texts] || status;
  };

  const getPaymentStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      refunded: 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getPaymentStatusText = (status: string) => {
    const texts = {
      pending: 'Chờ thanh toán',
      paid: 'Đã thanh toán',
      failed: 'Thanh toán thất bại',
      refunded: 'Đã hoàn tiền'
    };
    return texts[status as keyof typeof texts] || status;
  };

  const getTrackingSteps = () => {
    const steps = [
      { key: 'pending', label: 'Đơn hàng đã đặt', completed: true, date: order.createdAt },
      { key: 'processing', label: 'Đang xử lý', completed: ['processing', 'shipped', 'delivered'].includes(order.status), date: order.updatedAt },
      { key: 'shipped', label: 'Đang giao hàng', completed: ['shipped', 'delivered'].includes(order.status), date: order.shippedAt },
      { key: 'delivered', label: 'Đã giao hàng', completed: order.status === 'delivered', date: order.deliveredAt }
    ];

    return steps.filter(step => {
      if (order.status === 'cancelled' || order.status === 'refunded') {
        return step.key === 'pending';
      }
      return true;
    });
  };

  const getProgressPercentage = () => {
    const steps = getTrackingSteps();
    const completedSteps = steps.filter(step => step.completed).length;
    return (completedSteps / steps.length) * 100;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b sticky top-0 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Chi tiết đơn hàng</h2>
              <p className="text-muted-foreground">{order.orderNumber}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Order Status */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Tình trạng đơn hàng</h3>
              <div className="flex items-center space-x-2">
                <Badge className={getStatusColor(order.status)}>
                  {getStatusText(order.status)}
                </Badge>
                <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                  {getPaymentStatusText(order.paymentStatus)}
                </Badge>
              </div>
            </div>

            {/* Tracking Progress */}
            {order.status !== 'cancelled' && order.status !== 'refunded' && (
              <div className="space-y-4">
                <Progress value={getProgressPercentage()} className="h-2" />
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {getTrackingSteps().map((step, index) => (
                    <div key={step.key} className="text-center">
                      <div className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center ${
                        step.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                      }`}>
                        {step.completed ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <Clock className="w-4 h-4" />
                        )}
                      </div>
                      <p className="text-sm font-medium">{step.label}</p>
                      {step.date && (
                        <p className="text-xs text-muted-foreground">
                          {new Date(step.date).toLocaleDateString('vi-VN')}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {order.trackingNumber && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Mã vận chuyển</p>
                    <p className="text-sm text-muted-foreground">{order.trackingNumber}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Theo dõi
                  </Button>
                </div>
              </div>
            )}
          </Card>

          {/* Order Items */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Sản phẩm ({order.items.length})</h3>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-muted-foreground">SKU: {item.sku}</p>
                    <p className="text-sm text-muted-foreground">Số lượng: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                        minimumFractionDigits: 0,
                      }).format(item.price * 23000)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Tổng: {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                        minimumFractionDigits: 0,
                      }).format(item.total * 23000)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Order Summary */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Tóm tắt đơn hàng</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Tạm tính</span>
                <span>
                  {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                    minimumFractionDigits: 0,
                  }).format(order.subtotal * 23000)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Phí vận chuyển</span>
                <span>
                  {order.shipping === 0 ? 'Miễn phí' : new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                    minimumFractionDigits: 0,
                  }).format(order.shipping * 23000)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Thuế</span>
                <span>
                  {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                    minimumFractionDigits: 0,
                  }).format(order.tax * 23000)}
                </span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Giảm giá</span>
                  <span>
                    -{new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                      minimumFractionDigits: 0,
                    }).format(order.discount * 23000)}
                  </span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Tổng cộng</span>
                <span className="text-lg">
                  {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                    minimumFractionDigits: 0,
                  }).format(order.total * 23000)}
                </span>
              </div>
            </div>
          </Card>

          {/* Shipping & Billing Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Địa chỉ giao hàng
              </h3>
              <div className="space-y-2 text-sm">
                <p className="font-medium">
                  {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                </p>
                {order.shippingAddress.company && (
                  <p>{order.shippingAddress.company}</p>
                )}
                <p>{order.shippingAddress.address}</p>
                {order.shippingAddress.apartment && (
                  <p>{order.shippingAddress.apartment}</p>
                )}
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                </p>
                <p>{order.shippingAddress.country}</p>
                {order.shippingAddress.phone && (
                  <p className="flex items-center">
                    <Phone className="w-3 h-3 mr-1" />
                    {order.shippingAddress.phone}
                  </p>
                )}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Thông tin thanh toán
              </h3>
              <div className="space-y-2 text-sm">
                <p className="font-medium">
                  {order.billingAddress.firstName} {order.billingAddress.lastName}
                </p>
                {order.billingAddress.company && (
                  <p>{order.billingAddress.company}</p>
                )}
                <p>{order.billingAddress.address}</p>
                {order.billingAddress.apartment && (
                  <p>{order.billingAddress.apartment}</p>
                )}
                <p>
                  {order.billingAddress.city}, {order.billingAddress.state} {order.billingAddress.postalCode}
                </p>
                <p>{order.billingAddress.country}</p>
                <div className="pt-2 border-t">
                  <p>Phương thức: {order.paymentMethod}</p>
                  <p className="flex items-center mt-1">
                    <Calendar className="w-3 h-3 mr-1" />
                    Ngày đặt: {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Tải hóa đơn
              </Button>
              {order.status === 'delivered' && (
                <Button variant="outline">
                  Mua lại
                </Button>
              )}
            </div>
            <Button onClick={onClose}>
              Đóng
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}