import { CheckoutSuccess } from '@/components/checkout/CheckoutSuccess';
import { useEffect } from 'react';
import { useCheckoutStore } from '@/lib/state/checkoutStore';
import { useCartStore } from '@/lib/state/cartStore';

export default function CheckoutSuccessPage() {
  const { resetCheckout } = useCheckoutStore();
  const { clearCart } = useCartStore();

  // Clear checkout data and cart when order is successful
  useEffect(() => {
    resetCheckout();
    clearCart();
  }, [resetCheckout, clearCart]);

  return <CheckoutSuccess />;
}