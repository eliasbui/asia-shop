'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Truck, Clock, Check } from 'lucide-react';

interface ShippingStepProps {
  data: any;
  onChange: (data: any) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const shippingOptions = [
  {
    id: 'standard',
    name: 'Giao hàng tiêu chuẩn',
    description: 'Giao hàng trong 3-5 ngày làm việc',
    cost: 30000,
    estimatedDays: 3,
    icon: <Truck className="w-5 h-5" />,
    features: ['Giao hàng tận nơi', 'Theo dõi đơn hàng', 'Miễn phí đổi trả']
  },
  {
    id: 'express',
    name: 'Giao hàng nhanh',
    description: 'Giao hàng trong 1-2 ngày làm việc',
    cost: 80000,
    estimatedDays: 1,
    icon: <Clock className="w-5 h-5" />,
    features: ['Giao hàng hỏa tốc', 'Ưu tiên xử lý', 'Bảo hiểm hàng hóa'],
    popular: true
  },
  {
    id: 'overnight',
    name: 'Giao hàng trong ngày',
    description: 'Giao hàng trong 24 giờ',
    cost: 150000,
    estimatedDays: 0,
    icon: <Check className="w-5 h-5" />,
    features: ['Giao hàng siêu tốc', 'Giao trong ngày', 'Hỗ trợ 24/7']
  }
];

export function ShippingStep({ data, onChange, onNext, onPrevious }: ShippingStepProps) {
  const [selectedMethod, setSelectedMethod] = useState(data.shipping.method || 'standard');

  const handleSubmit = () => {
    const selectedShipping = shippingOptions.find(option => option.id === selectedMethod);
    onChange({
      shipping: {
        method: selectedMethod,
        cost: selectedShipping?.cost || 0,
        estimatedDays: selectedShipping?.estimatedDays || 3
      }
    });
    onNext();
  };

  const getEstimatedDate = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Phương thức vận chuyển</h2>
        <p className="text-muted-foreground">
          Chọn phương thức vận chuyển phù hợp với bạn
        </p>
      </div>

      {/* Shipping Options */}
      <div className="space-y-4">
        {shippingOptions.map((option) => (
          <Card
            key={option.id}
            className={`p-4 cursor-pointer border-2 transition-all hover:shadow-md ${
              selectedMethod === option.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setSelectedMethod(option.id)}
          >
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  ${selectedMethod === option.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600'
                  }
                `}>
                  {option.icon}
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold">{option.name}</h3>
                      {option.popular && (
                        <Badge variant="secondary" className="text-xs">
                          Phổ biến
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {option.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-lg">
                      {option.cost === 0 ? 'Miễn phí' : `${(option.cost / 1000).toFixed(0)}k đ`}
                    </div>
                    {option.estimatedDays !== undefined && (
                      <p className="text-xs text-muted-foreground">
                        Nhận hàng {getEstimatedDate(option.estimatedDays)}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  {option.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Check className="w-3 h-3 text-green-600" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Delivery Notice */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="flex items-start space-x-3">
          <Truck className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900 mb-1">Thông tin giao hàng</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Giao hàng từ 8:00 - 22:00 các ngày trong tuần</li>
              <li>• Bạn sẽ nhận được SMS/Xác nhận khi đơn hàng được giao</li>
              <li>• Miễn phí vận chuyển cho đơn hàng từ 2.000.000đ</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious}>
          Quay lại
        </Button>
        <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
          Tiếp tục
        </Button>
      </div>
    </div>
  );
}