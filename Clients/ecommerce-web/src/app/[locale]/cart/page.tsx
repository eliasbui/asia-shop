"use client";

import Image from "next/image";
import { Link } from "@/components/common/link";
import { Button } from "@/components/common/button";
import { useCartStore } from "@/lib/state";
import { mockProducts } from "@/lib/api/mock-data";
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useState } from "react";
import { formatMoney } from "@/lib/utils/format";

// Helper to format VND currency

export default function CartPage() {
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    applyCoupon,
    removeCoupon,
    coupon,
  } = useCartStore();

  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");

  // Calculate subtotal from items (simplified - in real app would fetch product prices)
  const subtotal = items.reduce((sum, item) => {
    // Mock price calculation - in real app would fetch from API
    const mockPrice = 1000000; // 1M VND per item
    return sum + mockPrice * item.quantity;
  }, 0);

  const discount = coupon?.percentOff
    ? subtotal * (coupon.percentOff / 100)
    : 0;
  const shipping = subtotal > 500000 ? 0 : 30000; // Free shipping over 500k
  const total = subtotal - discount + shipping;

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code");
      return;
    }

    // Mock coupon validation
    if (couponCode.toUpperCase() === "SAVE10") {
      applyCoupon({
        code: "SAVE10",
        valid: true,
        percentOff: 10,
      });
      setCouponCode("");
      setCouponError("");
    } else {
      setCouponError("Invalid coupon code");
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <ShoppingBag className="w-24 h-24 mx-auto text-muted-foreground mb-6" />
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-muted-foreground mb-8">
            Add some products to your cart to get started
          </p>
          <Link href="/">
            <Button size="lg">
              Continue Shopping
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => {
            const product = mockProducts.find((p) => p.id === item.productId);
            if (!product) return null;

            const price =
              product.price.sale?.amount || product.price.list.amount;
            const itemTotal = price * item.quantity;

            return (
              <div
                key={`${item.productId}-${item.variantId}`}
                className="flex gap-4 p-4 border rounded-lg"
              >
                {/* Image */}
                <Link
                  href={`/p/${product.slug}`}
                  className="relative w-24 h-24 flex-shrink-0"
                >
                  <Image
                    src={product.media[0]?.url || ""}
                    alt={product.title}
                    fill
                    className="object-cover rounded-md"
                  />
                </Link>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <Link href={`/p/${product.slug}`}>
                    <h3 className="font-medium hover:text-primary transition-colors line-clamp-2">
                      {product.title}
                    </h3>
                  </Link>
                  <p className="text-sm text-muted-foreground mt-1">
                    {product.brand}
                  </p>
                  {item.variantId !== "default" && (
                    <p className="text-sm text-muted-foreground">
                      Variant: {item.variantId}
                    </p>
                  )}

                  {/* Price and Quantity */}
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          updateQuantity(
                            item.productId,
                            item.variantId,
                            Math.max(1, item.quantity - 1)
                          )
                        }
                      >
                        -
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          updateQuantity(
                            item.productId,
                            item.variantId,
                            item.quantity + 1
                          )
                        }
                      >
                        +
                      </Button>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="font-semibold">
                        {formatMoney({
                          amount: itemTotal,
                          currency: product.price.list.currency,
                        })}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() =>
                          removeItem(item.productId, item.variantId)
                        }
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Clear Cart */}
          <Button
            variant="outline"
            onClick={clearCart}
            className="w-full text-destructive hover:text-destructive"
          >
            Clear Cart
          </Button>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="border rounded-lg p-6 sticky top-20">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>

            {/* Coupon */}
            <div className="mb-6">
              <label className="text-sm font-medium mb-2 block">
                Coupon Code
              </label>
              {coupon ? (
                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950 rounded-md">
                  <span className="text-sm font-medium text-green-700 dark:text-green-300">
                    {coupon.code} applied
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={removeCoupon}
                    className="h-auto p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => {
                        setCouponCode(e.target.value);
                        setCouponError("");
                      }}
                      placeholder="Enter code"
                      className="flex-1 h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    <Button onClick={handleApplyCoupon}>Apply</Button>
                  </div>
                  {couponError && (
                    <p className="text-sm text-destructive mt-1">
                      {couponError}
                    </p>
                  )}
                </>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>
                  {formatMoney({ amount: subtotal, currency: "VND" })}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                  <span>Discount ({coupon?.percentOff}%)</span>
                  <span>
                    -{formatMoney({ amount: discount, currency: "VND" })}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                <span>
                  {shipping === 0 ? (
                    <span className="text-green-600 dark:text-green-400">
                      Free
                    </span>
                  ) : (
                    formatMoney({ amount: shipping, currency: "VND" })
                  )}
                </span>
              </div>
              <div className="border-t pt-3 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-primary">
                  {formatMoney({ amount: total, currency: "VND" })}
                </span>
              </div>
            </div>

            {/* Checkout Button */}
            <Link href="/checkout">
              <Button size="lg" className="w-full">
                Proceed to Checkout
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>

            {/* Continue Shopping */}
            <Link href="/">
              <Button variant="outline" className="w-full mt-3">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
