'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Check, ShoppingBag, Truck, CreditCard, FileCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useCartStore } from '@/lib/state/cartStore';
import { useCheckoutNavigation, useCheckoutData } from '@/lib/state/checkoutStore';
import { formatCurrency } from '@/lib/utils/format';

type CheckoutStep = 'address' | 'shipping' | 'payment' | 'review' | 'success';

interface StepConfig {
  id: CheckoutStep;
  label: string;
  href: string;
  icon: React.ReactNode;
  isCompleted: boolean;
  isActive: boolean;
}

export default function CheckoutStepsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { items, getTotalPrice } = useCartStore();
  const { currentStep, isStepValid } = useCheckoutNavigation();
  const { data } = useCheckoutData();

  // Define step order and configuration
  const stepOrder: CheckoutStep[] = ['address', 'shipping', 'payment', 'review', 'success'];

  const stepConfigs: Record<CheckoutStep, Omit<StepConfig, 'isCompleted' | 'isActive'>> = {
    address: {
      id: 'address',
      label: 'Địa chỉ',
      href: '/checkout/address',
      icon: <ShoppingBag className="w-4 h-4" />
    },
    shipping: {
      id: 'shipping',
      label: 'Vận chuyển',
      href: '/checkout/shipping',
      icon: <Truck className="w-4 h-4" />
    },
    payment: {
      id: 'payment',
      label: 'Thanh toán',
      href: '/checkout/payment',
      icon: <CreditCard className="w-4 h-4" />
    },
    review: {
      id: 'review',
      label: 'Xác nhận',
      href: '/checkout/review',
      icon: <FileCheck className="w-4 h-4" />
    },
    success: {
      id: 'success',
      label: 'Hoàn thành',
      href: '/checkout/success',
      icon: <Check className="w-4 h-4" />
    }
  };

  // Find current step index
  const currentStepIndex = stepOrder.findIndex(step => pathname.includes(step));
  const currentStepName = stepOrder[currentStepIndex] || 'address';

  // Generate step configs with completion status
  const steps: StepConfig[] = stepOrder.map((stepId, index) => {
    const config = stepConfigs[stepId];
    const isCompleted = index < currentStep;
    const isActive = stepId === currentStepName && stepId !== 'success';
    const isValid = isStepValid(index);

    return {
      ...config,
      isCompleted: isCompleted && isValid,
      isActive
    };
  });

  // Calculate progress percentage
  const progressPercentage = ((currentStep + 1) / (stepOrder.length - 1)) * 100;

  // Handle step navigation
  const handleStepClick = (step: CheckoutStep) => {
    const stepIndex = stepOrder.indexOf(step);
    const canNavigate = stepIndex <= currentStep && isStepValid(stepIndex);

    if (canNavigate || step === 'address') {
      router.push(stepConfigs[step].href);
    }
  };

  // Calculate totals
  const { subtotal, total } = getTotalPrice();
  const finalTotal = total + (data.shipping?.cost || 0);

  // Sync checkout step with URL
  useEffect(() => {
    if (currentStep !== currentStepIndex && currentStepIndex >= 0 && currentStepIndex < 4) {
      // Only redirect if the current step in URL is different from store state
      // and if the requested step is valid (completed previous steps)
      if (currentStepIndex <= currentStep || isStepValid(currentStepIndex)) {
        // Update store to match URL
        // This allows for direct navigation to valid steps
      } else {
        // Redirect to current valid step if trying to access invalid step
        router.push(stepConfigs[stepOrder[currentStep]].href);
      }
    }
  }, [currentStep, currentStepIndex, router, isStepValid, stepConfigs, stepOrder]);

  // Check if cart is empty
  if (items.length === 0 && currentStep !== 'success') {
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
          <Button onClick={() => router.push('/c/all')}>
            Tiếp tục mua sắm
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Progress Steps */}
      <Card className="p-6 mb-8">
        <div className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-medium">
              <span>Tiến trình thanh toán</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          {/* Step Navigation */}
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => handleStepClick(step.id)}
                  disabled={step.id === 'success' && currentStep !== 'success'}
                  className={`
                    relative flex items-center justify-center w-12 h-12 rounded-full transition-all
                    ${step.isCompleted
                      ? 'bg-green-600 hover:bg-green-700 text-white cursor-pointer'
                      : step.isActive
                        ? 'bg-blue-600 text-white'
                        : step.id === 'success' && currentStep !== 'success'
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200 cursor-pointer'
                    }
                  `}
                >
                  {step.isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    step.icon
                  )}

                  {/* Step number indicator */}
                  {!step.isCompleted && (
                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
                      {index + 1}
                    </span>
                  )}
                </button>

                {/* Step Label */}
                <div className="ml-3">
                  <p className={`
                    text-sm font-medium
                    ${step.isActive
                      ? 'text-blue-600'
                      : step.isCompleted
                        ? 'text-green-600'
                        : 'text-gray-400'
                    }
                  `}>
                    {step.label}
                  </p>
                </div>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className={`
                    w-16 h-0.5 mx-4
                    ${step.isCompleted
                      ? 'bg-green-600'
                      : 'bg-gray-200'
                    }
                  `} />
                )}
              </div>
            ))}
          </div>

          {/* Current Step Description */}
          {currentStep !== 'success' && (
            <div className="text-center text-sm text-muted-foreground">
              <p>
                {currentStep === 'address' && 'Nhập thông tin địa chỉ giao hàng của bạn'}
                {currentStep === 'shipping' && 'Chọn phương thức vận chuyển phù hợp'}
                {currentStep === 'payment' && 'Chọn phương thức thanh toán an toàn'}
                {currentStep === 'review' && 'Kiểm tra lại thông tin đơn hàng trước khi xác nhận'}
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {children}
        </div>

        {/* Order Summary Sidebar */}
        {currentStep !== 'success' && (
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-4">
              <h3 className="font-semibold mb-4">Tóm tắt đơn hàng</h3>

              {/* Items Summary */}
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span>{items.length} sản phẩm</span>
                  <span>{formatCurrency(subtotal, 'VND')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Phí vận chuyển</span>
                  <span>
                    {data.shipping?.cost === 0
                      ? 'Miễn phí'
                      : formatCurrency(data.shipping?.cost || 0, 'VND')
                    }
                  </span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Tổng cộng</span>
                    <span className="text-red-600">{formatCurrency(finalTotal, 'VND')}</span>
                  </div>
                </div>
              </div>

              {/* Order Items Preview */}
              <div className="space-y-2 max-h-48 overflow-y-auto mb-4">
                {items.slice(0, 3).map((item) => (
                  <div key={item.id} className="flex items-center space-x-3 text-sm">
                    <div className="w-8 h-8 bg-gray-100 rounded flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="truncate font-medium">{item.product.title}</p>
                      <p className="text-muted-foreground text-xs">
                        {item.quantity} x {formatCurrency(
                          item.variant.price?.sale?.amount ||
                          item.variant.price?.list.amount ||
                          item.product.price.sale?.amount ||
                          item.product.price.list.amount,
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
        )}
      </div>
    </div>
  );
}