"use client"

import { ReviewStep } from '@/components/checkout/steps/ReviewStep';
import { useCheckoutData, useCheckoutNavigation } from '@/lib/state/checkoutStore';
import { useCartStore } from '@/lib/state/cartStore';
import { useRouter } from 'next/navigation';

export default function ReviewPage() {
  const { data } = useCheckoutData();
  const { previousStep } = useCheckoutNavigation();
  const { items, getTotalPrice } = useCartStore();
  const router = useRouter();

  const { subtotal, total } = getTotalPrice();

  const handleConfirm = () => {
    // Handle order confirmation
    // You could add order processing logic here
    console.log('Order confirmed:', { data, items, total });

    // Redirect to order confirmation page
    router.push('/checkout/success');
  };

  return (
    <ReviewStep
      data={data}
      items={items}
      subtotal={subtotal}
      total={total + (data.shipping?.cost || 0)}
      onPrevious={previousStep}
      onConfirm={handleConfirm}
    />
  );
}
