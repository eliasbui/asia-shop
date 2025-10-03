'use client';

import React from 'react';
import { Skeleton } from './LoadingSkeleton';
import { cn } from '@/lib/utils/cn';

export interface CheckoutSkeletonProps {
  className?: string;
  currentStep?: number;
  showProgress?: boolean;
  showOrderSummary?: boolean;
  animation?: 'shimmer' | 'pulse' | 'wave' | 'none';
}

const checkoutSteps = [
  { name: 'Address', description: 'Delivery address' },
  { name: 'Shipping', description: 'Shipping method' },
  { name: 'Payment', description: 'Payment details' },
  { name: 'Review', description: 'Review order' },
];

export function CheckoutSkeleton({
  className = '',
  currentStep = 1,
  showProgress = true,
  showOrderSummary = true,
  animation = 'shimmer',
}: CheckoutSkeletonProps) {
  const renderProgressSteps = () => {
    if (!showProgress) return null;

    return (
      <div className="mb-8">
        {/* Progress Bar */}
        <div className="flex items-center justify-between mb-6">
          {checkoutSteps.map((step, index) => {
            const isActive = index + 1 === currentStep;
            const isCompleted = index + 1 < currentStep;

            return (
              <React.Fragment key={step.name}>
                <div className="flex flex-col items-center">
                  <Skeleton
                    variant={isCompleted ? 'circular' : 'rectangular'}
                    width="40px"
                    height="40px"
                    className={cn(
                      isCompleted && 'bg-primary',
                      isActive && 'ring-2 ring-primary'
                    )}
                    animation={animation}
                  />
                  <Skeleton
                    variant="text"
                    height="0.875rem"
                    width="60px"
                    className="mt-2"
                    animation={animation}
                  />
                  <Skeleton
                    variant="text"
                    height="0.75rem"
                    width="80px"
                    className="mt-1"
                    animation={animation}
                  />
                </div>

                {/* Connector Line */}
                {index < checkoutSteps.length - 1 && (
                  <div className="flex-1 mx-4">
                    <Skeleton
                      variant="rectangular"
                      height="2px"
                      className="mt-5"
                      animation={animation}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <AddressStepSkeleton animation={animation} />;
      case 2:
        return <ShippingStepSkeleton animation={animation} />;
      case 3:
        return <PaymentStepSkeleton animation={animation} />;
      case 4:
        return <ReviewStepSkeleton animation={animation} />;
      default:
        return <AddressStepSkeleton animation={animation} />;
    }
  };

  const renderOrderSummary = () => {
    if (!showOrderSummary) return null;

    return (
      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-6">
          <h2 className="text-lg font-semibold mb-4">
            <Skeleton
              variant="text"
              height="1.5rem"
              width="120px"
              animation={animation}
            />
          </h2>

          {/* Order Items */}
          <div className="space-y-4 mb-6">
            {Array.from({ length: 2 }, (_, index) => (
              <div key={index} className="flex space-x-3">
                <Skeleton
                  variant="rectangular"
                  width="60px"
                  height="60px"
                  animation={animation}
                />
                <div className="flex-1 space-y-2">
                  <Skeleton
                    variant="text"
                    height="0.875rem"
                    width="120px"
                    animation={animation}
                  />
                  <Skeleton
                    variant="text"
                    height="0.75rem"
                    width="80px"
                    animation={animation}
                  />
                  <div className="flex justify-between">
                    <Skeleton
                      variant="text"
                      height="0.75rem"
                      width="40px"
                      animation={animation}
                    />
                    <Skeleton
                      variant="text"
                      height="0.875rem"
                      width="50px"
                      animation={animation}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Totals */}
          <div className="space-y-3 border-t border-gray-200 pt-4">
            <div className="flex justify-between">
              <Skeleton
                variant="text"
                height="1rem"
                width="80px"
                animation={animation}
              />
              <Skeleton
                variant="text"
                height="1rem"
                width="60px"
                animation={animation}
              />
            </div>
            <div className="flex justify-between">
              <Skeleton
                variant="text"
                height="1rem"
                width="80px"
                animation={animation}
              />
              <Skeleton
                variant="text"
                height="1rem"
                width="60px"
                animation={animation}
              />
            </div>
            <div className="flex justify-between">
              <Skeleton
                variant="text"
                height="1rem"
                width="60px"
                animation={animation}
              />
              <Skeleton
                variant="text"
                height="1rem"
                width="60px"
                animation={animation}
              />
            </div>
            <div className="border-t border-gray-200 pt-3">
              <div className="flex justify-between">
                <Skeleton
                  variant="text"
                  height="1.25rem"
                  width="100px"
                  animation={animation}
                />
                <Skeleton
                  variant="text"
                  height="1.25rem"
                  width="80px"
                  animation={animation}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 space-y-3">
            <Skeleton
              variant="rectangular"
              height="3rem"
              width="100%"
              animation={animation}
            />
            <Skeleton
              variant="rectangular"
              height="2.5rem"
              width="100%"
              animation={animation}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={cn('w-full max-w-6xl mx-auto px-4 py-8', className)}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">
          <Skeleton
            variant="text"
            height="2rem"
            width="200px"
            animation={animation}
          />
        </h1>
        <Skeleton
          variant="text"
          height="1rem"
          width="300px"
          animation={animation}
        />
      </div>

      {renderProgressSteps()}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {renderStepContent()}
        </div>

        {/* Order Summary */}
        {renderOrderSummary()}
      </div>
    </div>
  );
}

// Individual step skeleton components
function AddressStepSkeleton({ animation }: { animation?: SkeletonProps['animation'] }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-xl font-semibold mb-6">
        <Skeleton
          variant="text"
          height="1.5rem"
          width="150px"
          animation={animation}
        />
      </h2>

      {/* Saved Addresses */}
      <div className="mb-8">
        <Skeleton
          variant="text"
          height="1rem"
          width="120px"
          animation={animation}
        />
        <div className="mt-4 space-y-3">
          {Array.from({ length: 2 }, (_, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <Skeleton
                    variant="text"
                    height="1rem"
                    width="80px"
                    animation={animation}
                  />
                  <Skeleton
                    variant="text"
                    height="1rem"
                    width="150px"
                    animation={animation}
                  />
                  <Skeleton
                    variant="text"
                    height="1rem"
                    width="180px"
                    animation={animation}
                  />
                </div>
                <Skeleton
                  variant="rectangular"
                  width="20px"
                  height="20px"
                  animation={animation}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* New Address Form */}
      <div>
        <Skeleton
          variant="text"
          height="1.25rem"
          width="140px"
          animation={animation}
        />
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Skeleton
              variant="text"
              height="1rem"
              width="60px"
              animation={animation}
            />
            <Skeleton
              variant="rectangular"
              height="2.5rem"
              width="100%"
              animation={animation}
            />
          </div>
          <div className="space-y-2">
            <Skeleton
              variant="text"
              height="1rem"
              width="80px"
              animation={animation}
            />
            <Skeleton
              variant="rectangular"
              height="2.5rem"
              width="100%"
              animation={animation}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Skeleton
              variant="text"
              height="1rem"
              width="40px"
              animation={animation}
            />
            <Skeleton
              variant="rectangular"
              height="2.5rem"
              width="100%"
              animation={animation}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Skeleton
              variant="text"
              height="1rem"
              width="80px"
              animation={animation}
            />
            <Skeleton
              variant="rectangular"
              height="3rem"
              width="100%"
              animation={animation}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ShippingStepSkeleton({ animation }: { animation?: SkeletonProps['animation'] }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-xl font-semibold mb-6">
        <Skeleton
          variant="text"
          height="1.5rem"
          width="150px"
          animation={animation}
        />
      </h2>

      {/* Shipping Methods */}
      <div className="space-y-4">
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Skeleton
                  variant="rectangular"
                  width="20px"
                  height="20px"
                  animation={animation}
                />
                <div className="space-y-2">
                  <Skeleton
                    variant="text"
                    height="1rem"
                    width="120px"
                    animation={animation}
                  />
                  <Skeleton
                    variant="text"
                    height="1rem"
                    width="180px"
                    animation={animation}
                  />
                </div>
              </div>
              <div className="text-right">
                <Skeleton
                  variant="text"
                  height="1.25rem"
                  width="60px"
                  animation={animation}
                />
                <Skeleton
                  variant="text"
                  height="0.875rem"
                  width="80px"
                  animation={animation}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delivery Instructions */}
      <div className="mt-8">
        <Skeleton
          variant="text"
          height="1.25rem"
          width="140px"
          animation={animation}
        />
        <Skeleton
          variant="rectangular"
          height="3rem"
          width="100%"
          className="mt-2"
          animation={animation}
        />
      </div>
    </div>
  );
}

function PaymentStepSkeleton({ animation }: { animation?: SkeletonProps['animation'] }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-xl font-semibold mb-6">
        <Skeleton
          variant="text"
          height="1.5rem"
          width="150px"
          animation={animation}
        />
      </h2>

      {/* Payment Methods */}
      <div className="mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 text-center">
              <Skeleton
                variant="rectangular"
                width="60px"
                height="40px"
                className="mx-auto mb-2"
                animation={animation}
              />
              <Skeleton
                variant="text"
                height="1rem"
                width="60px"
                className="mx-auto"
                animation={animation}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Card Details Form */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Skeleton
            variant="text"
            height="1rem"
            width="80px"
            animation={animation}
          />
          <Skeleton
            variant="rectangular"
            height="2.5rem"
            width="100%"
            animation={animation}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Skeleton
              variant="text"
              height="1rem"
              width="60px"
              animation={animation}
            />
            <Skeleton
              variant="rectangular"
              height="2.5rem"
              width="100%"
              animation={animation}
            />
          </div>
          <div className="space-y-2">
            <Skeleton
              variant="text"
              height="1rem"
              width="80px"
              animation={animation}
            />
            <Skeleton
              variant="rectangular"
              height="2.5rem"
              width="100%"
              animation={animation}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Skeleton
            variant="text"
            height="1rem"
            width="100px"
            animation={animation}
          />
          <Skeleton
            variant="rectangular"
            height="2.5rem"
            width="100%"
            animation={animation}
          />
        </div>

        {/* Save Payment Checkbox */}
        <div className="flex items-center space-x-2">
          <Skeleton
            variant="rectangular"
            width="16px"
            height="16px"
            animation={animation}
          />
          <Skeleton
            variant="text"
            height="1rem"
            width="140px"
            animation={animation}
          />
        </div>
      </div>
    </div>
  );
}

function ReviewStepSkeleton({ animation }: { animation?: SkeletonProps['animation'] }) {
  return (
    <div className="space-y-6">
      {/* Shipping Address Review */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">
            <Skeleton
              variant="text"
              height="1.25rem"
              width="120px"
              animation={animation}
            />
          </h3>
          <Skeleton
            variant="rectangular"
            height="2rem"
            width="80px"
            animation={animation}
          />
        </div>
        <div className="space-y-2">
          <Skeleton
            variant="text"
            height="1rem"
            width="100px"
            animation={animation}
          />
          <Skeleton
            variant="text"
            height="1rem"
            width="180px"
            animation={animation}
          />
          <Skeleton
            variant="text"
            height="1rem"
            width="150px"
            animation={animation}
          />
        </div>
      </div>

      {/* Shipping Method Review */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">
            <Skeleton
              variant="text"
              height="1.25rem"
              width="120px"
              animation={animation}
            />
          </h3>
          <Skeleton
            variant="rectangular"
            height="2rem"
            width="80px"
            animation={animation}
          />
        </div>
        <div className="space-y-2">
          <Skeleton
            variant="text"
            height="1rem"
            width="140px"
            animation={animation}
          />
          <Skeleton
            variant="text"
            height="1rem"
            width="160px"
            animation={animation}
          />
        </div>
      </div>

      {/* Payment Method Review */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">
            <Skeleton
              variant="text"
              height="1.25rem"
              width="120px"
              animation={animation}
            />
          </h3>
          <Skeleton
            variant="rectangular"
            height="2rem"
            width="80px"
            animation={animation}
          />
        </div>
        <div className="space-y-2">
          <Skeleton
            variant="text"
            height="1rem"
            width="100px"
            animation={animation}
          />
          <Skeleton
            variant="text"
            height="1rem"
            width="120px"
            animation={animation}
          />
        </div>
      </div>

      {/* Terms and Conditions */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-start space-x-2">
          <Skeleton
            variant="rectangular"
            width="16px"
            height="16px"
            animation={animation}
          />
          <div className="flex-1">
            <Skeleton
              variant="text"
              height="1rem"
              width="200px"
              animation={animation}
            />
            <Skeleton
              variant="text"
              height="1rem"
              width="300px"
              className="mt-1"
              animation={animation}
            />
          </div>
        </div>
      </div>
    </div>
  );
}