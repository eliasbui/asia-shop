import { redirect } from 'next/navigation';

export default function Checkout() {
  // Redirect to the first step of checkout
  redirect('/checkout/address');
}