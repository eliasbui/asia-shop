"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/common/button";
import { useCartStore } from "@/lib/state";
import { ShoppingBag } from "lucide-react";

// Helper to format VND currency
const formatVND = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function CartPage() {
  const router = useRouter();
  const { items, clearCart, coupon } = useCartStore();

  // Calculate subtotal from items (simplified)
  const subtotal = items.reduce((sum, item) => {
    const mockPrice = 1000000; // 1M VND per item
    return sum + mockPrice * item.quantity;
  }, 0);

  const discount = coupon?.percentOff
    ? subtotal * (coupon.percentOff / 100)
    : 0;
  const shipping = subtotal > 500000 ? 0 : 30000;
  const total = subtotal - discount + shipping;

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <ShoppingBag className="w-24 h-24 mx-auto text-muted-foreground mb-6" />
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-muted-foreground mb-8">
            Add some products to your cart to see them here.
          </p>
          <Button onClick={() => router.push("/")}>Continue Shopping</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={`${item.productId}-${item.variantId}`}
                className="border rounded-lg p-4"
              >
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-semibold">Product {item.productId}</h3>
                    <p className="text-sm text-muted-foreground">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <div className="font-semibold">
                    {formatVND(1000000 * item.quantity)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-between">
            <Button variant="outline" onClick={clearCart}>
              Clear Cart
            </Button>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="border rounded-lg p-6 sticky top-4">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>{formatVND(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount ({coupon?.percentOff}%)</span>
                  <span>-{formatVND(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                <span>{shipping === 0 ? "Free" : formatVND(shipping)}</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>{formatVND(total)}</span>
              </div>
            </div>

            <Button
              className="w-full"
              size="lg"
              onClick={() => router.push("/checkout")}
            >
              Proceed to Checkout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
