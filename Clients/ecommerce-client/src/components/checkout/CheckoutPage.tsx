'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Check, ShoppingBag, Truck, CreditCard, FileCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCartStore } from '@/lib/state/cartStore';
import { formatCurrency } from '@/lib/utils/format';
import { CheckoutSteps } from './CheckoutSteps';
import { AddressStep } from './steps/AddressStep';
import { ShippingStep } from './steps/ShippingStep';
import { PaymentStep } from './steps/PaymentStep';
import { ReviewStep } from './steps/ReviewStep';

type CheckoutStep = 'address' | 'shipping' | 'payment' | 'review';

interface CheckoutData {
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    district: string;
    postalCode: string;
  };
  billingAddress: {
    sameAsShipping: boolean;
    fullName?: string;
    phone?: string;
    address?: string;
    city?: string;
    district?: string;
    postalCode?: string;
  };
  shipping: {
    method: string;
    cost: number;
    estimatedDays: number;
  };
  payment: {
    method: string;
    cardNumber?: string;
    cardHolder?: string;
    expiryDate?: string;
    cvv?: string;
  };
}

export function CheckoutPage() {
  const t = useTranslations('checkout');
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { total: subtotal } = getTotalPrice();

  const [currentStep, setCurrentStep] = useState<CheckoutStep>('address');
  const [checkoutData, setCheckoutData] = useState<CheckoutData>({
    shippingAddress: {
      fullName: '',
      phone: '',
      address: '',
      city: '',
      district: '',
      postalCode: ''
    },
    billingAddress: {
      sameAsShipping: true
    },
    shipping: {
      method: 'standard',
      cost: 30000,
      estimatedDays: 3
    },
    payment: {
      method: 'cod'
    }
  });

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-6 max-w-md mx-auto">
          <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground" />
          <div>
            <h1 className="text-2xl font-bold mb-2">Giỏ hàng trống</h1>
            <p className="text-muted-foreground">
              Bạn cần có sản phẩm trong giỏ hàng để thanh toán
            </p>
          </div>
          <Button onClick={() => window.location.href = '/c/all'}>
            Tiếp tục mua sắm
          </Button>
        </div>
      </div>
    );
  }

  const steps = [
    { id: 'address', label: 'Địa chỉ giao hàng', icon: <ShoppingBag className="w-4 h-4" /> },
    { id: 'shipping', label: 'Vận chuyển', icon: <Truck className="w-4 h-4" /> },
    { id: 'payment', label: 'Thanh toán', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'review', label: 'Xác nhận', icon: <FileCheck className="w-4 h-4" /> }
  ] as const;

  const updateCheckoutData = (step: Partial<CheckoutData>) => {
    setCheckoutData(prev => ({ ...prev, ...step }));
  };

  const goToNextStep = () => {
    const stepOrder: CheckoutStep[] = ['address', 'shipping', 'payment', 'review'];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex < stepOrder.length - 1) {
      setCurrentStep(stepOrder[currentIndex + 1]);
    }
  };

  const goToPreviousStep = () => {
    const stepOrder: CheckoutStep[] = ['address', 'shipping', 'payment', 'review'];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1]);
    }
  };

  const calculateTotal = () => {
    const shippingCost = checkoutData.shipping.cost;
    return subtotal + shippingCost;
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'address':
        return (
          <AddressStep
            data={checkoutData}
            onChange={updateCheckoutData}
            onNext={goToNextStep}
          />
        );
      case 'shipping':
        return (
          <ShippingStep
            data={checkoutData}
            onChange={updateCheckoutData}
            onNext={goToNextStep}
            onPrevious={goToPreviousStep}
          />
        );
      case 'payment':
        return (
          <PaymentStep
            data={checkoutData}
            onChange={updateCheckoutData}
            onNext={goToNextStep}
            onPrevious={goToPreviousStep}
          />
        );
      case 'review':
        return (
          <ReviewStep
            data={checkoutData}
            items={items}
            subtotal={subtotal}
            total={calculateTotal()}
            onPrevious={goToPreviousStep}
            onConfirm={() => {
              // Handle order confirmation
              console.log('Order confirmed:', { items, checkoutData });
              clearCart();
              window.location.href = '/checkout/success';
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('checkout')}</h1>
        <p className="text-muted-foreground">
          Hoàn tất thông tin để đặt hàng
        </p>
      </div>

      {/* Steps */}
      <CheckoutSteps
        steps={steps}
        currentStep={currentStep}
        onStepClick={setCurrentStep}
      />

      <div className="grid lg:grid-cols-3 gap-8 mt-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            {renderStepContent()}
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-4">
            <h3 className="text-lg font-semibold mb-4">Tóm tắt đơn hàng</h3>

            {/* Items Summary */}
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span>{items.length} sản phẩm</span>
                <span>{formatCurrency(subtotal, 'VND')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Phí vận chuyển</span>
                <span>
                  {checkoutData.shipping.cost === 0
                    ? 'Miễn phí'
                    : formatCurrency(checkoutData.shipping.cost, 'VND')
                  }
                </span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold text-lg">
                <span>Tổng cộng</span>
                <span className="text-red-600">
                  {formatCurrency(calculateTotal(), 'VND')}
                </span>
              </div>
            </div>

            {/* Order Items Preview */}
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {items.slice(0, 3).map((item) => (
                <div key={item.id} className="flex items-center space-x-3 text-sm">
                  <div className="w-8 h-8 bg-gray-100 rounded flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="truncate font-medium">{item.product.title}</p>
                    <p className="text-muted-foreground text-xs">
                      {item.quantity} x {formatCurrency(
                        (item.variant.price?.sale?.amount || item.variant.price?.list.amount || item.product.price.sale?.amount || item.product.price.list.amount),
                        'VND'
                      )}
                    </p>
                  </div>
                </div>
              ))}
              {items.length > 3 && (
                <p className="text-xs text-muted-foreground text-center">
                  và {items.length - 3} sản phẩm khác
                </p>
              )}
            </div>

            {/* Security Badge */}
            <div className="mt-6 p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-2 text-green-700">
                <Check className="w-4 h-4" />
                <span className="text-sm">Mua sắm an toàn và bảo mật</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}