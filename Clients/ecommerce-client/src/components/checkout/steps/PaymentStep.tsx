'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Smartphone, DollarSign, Shield, Check } from 'lucide-react';

interface PaymentStepProps {
  data: any;
  onChange: (data: any) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const paymentMethods = [
  {
    id: 'cod',
    name: 'Thanh toán khi nhận hàng (COD)',
    description: 'Thanh toán bằng tiền mặt khi nhận hàng',
    icon: <DollarSign className="w-5 h-5" />,
    fee: 0,
    features: ['Thanh toán khi nhận hàng', 'An toàn tuyệt đối', 'Không cần thông tin thẻ']
  },
  {
    id: 'card',
    name: 'Thẻ tín dụng/Ghi nợ',
    description: 'Visa, Mastercard, JCB',
    icon: <CreditCard className="w-5 h-5" />,
    fee: 0,
    features: ['Xử lý nhanh chóng', 'Bảo mật SSL', 'Thanh toán quốc tế']
  },
  {
    id: 'banking',
    name: 'Chuyển khoản ngân hàng',
    description: 'Internet Banking, Mobile Banking',
    icon: <Smartphone className="w-5 h-5" />,
    fee: 0,
    features: ['Miễn phí giao dịch', 'An toàn', 'Nhiều ngân hàng']
  },
  {
    id: 'ewallet',
    name: 'Ví điện tử',
    description: 'MoMo, ZaloPay, VNPay',
    icon: <Smartphone className="w-5 h-5" />,
    fee: 5000,
    features: ['Thanh toán nhanh', 'Nhiều ưu đãi', 'Tiện lợi']
  }
];

export function PaymentStep({ data, onChange, onNext, onPrevious }: PaymentStepProps) {
  const [selectedMethod, setSelectedMethod] = useState(data.payment.method || 'cod');
  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: ''
  });

  const handleSubmit = () => {
    const paymentData = {
      method: selectedMethod,
      ...(selectedMethod === 'card' ? cardData : {})
    };

    onChange({
      payment: paymentData
    });

    onNext();
  };

  const handleCardDataChange = (field: string, value: string) => {
    setCardData(prev => ({ ...prev, [field]: value }));
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.slice(0, 2) + '/' + v.slice(2, 4);
    }
    return v;
  };

  const selectedPaymentMethod = paymentMethods.find(method => method.id === selectedMethod);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Phương thức thanh toán</h2>
        <p className="text-muted-foreground">
          Chọn phương thức thanh toán an toàn và tiện lợi
        </p>
      </div>

      {/* Payment Methods */}
      <div className="space-y-4">
        {paymentMethods.map((method) => (
          <Card
            key={method.id}
            className={`p-4 cursor-pointer border-2 transition-all hover:shadow-md ${
              selectedMethod === method.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setSelectedMethod(method.id)}
          >
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  ${selectedMethod === method.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600'
                  }
                `}>
                  {method.icon}
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold">{method.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {method.description}
                    </p>
                  </div>
                  {method.fee > 0 && (
                    <Badge variant="outline" className="text-xs">
                      Phí: {method.fee.toLocaleString()}đ
                    </Badge>
                  )}
                </div>

                <div className="space-y-1">
                  {method.features.map((feature, index) => (
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

      {/* Card Details Form */}
      {selectedMethod === 'card' && (
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Thông tin thẻ</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="cardNumber">Số thẻ *</Label>
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={cardData.cardNumber}
                onChange={(e) => handleCardDataChange('cardNumber', formatCardNumber(e.target.value))}
                maxLength={19}
                required
              />
            </div>

            <div>
              <Label htmlFor="cardHolder">Tên chủ thẻ *</Label>
              <Input
                id="cardHolder"
                placeholder="NGUYEN VAN A"
                value={cardData.cardHolder}
                onChange={(e) => handleCardDataChange('cardHolder', e.target.value.toUpperCase())}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiryDate">Ngày hết hạn *</Label>
                <Input
                  id="expiryDate"
                  placeholder="MM/YY"
                  value={cardData.expiryDate}
                  onChange={(e) => handleCardDataChange('expiryDate', formatExpiryDate(e.target.value))}
                  maxLength={5}
                  required
                />
              </div>
              <div>
                <Label htmlFor="cvv">CVV *</Label>
                <Input
                  id="cvv"
                  placeholder="123"
                  value={cardData.cvv}
                  onChange={(e) => handleCardDataChange('cvv', e.target.value.replace(/\D/g, '').slice(0, 3))}
                  maxLength={3}
                  required
                />
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Security Badge */}
      <Card className="p-4 bg-green-50 border-green-200">
        <div className="flex items-start space-x-3">
          <Shield className="w-5 h-5 text-green-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-green-900 mb-1">Bảo mật thanh toán</h4>
            <p className="text-sm text-green-800">
              Mọi thông tin thanh toán của bạn đều được mã hóa SSL và bảo vệ theo tiêu chuẩn PCI-DSS.
              Chúng tôi không lưu trữ thông tin thẻ của bạn.
            </p>
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