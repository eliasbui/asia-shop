"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/common/button";
import { useCartStore } from "@/lib/state";
import { mockProducts } from "@/lib/api/mock-data";
import { Check } from "lucide-react";
import { formatMoney } from "@/lib/utils/format";

// Helper to format VND currency
const formatVND = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

type CheckoutStep = "address" | "shipping" | "payment" | "review";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, coupon, clearCart } = useCartStore();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("address");
  const [formData, setFormData] = useState({
    // Address
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    district: "",
    ward: "",
    // Shipping
    shippingMethod: "standard",
    // Payment
    paymentMethod: "cod",
  });

  // Calculate subtotal (simplified)
  const subtotal = items.reduce((sum, item) => {
    const mockPrice = 1000000; // 1M VND per item
    return sum + mockPrice * item.quantity;
  }, 0);
  const discount = coupon?.percentOff
    ? subtotal * (coupon.percentOff / 100)
    : 0;
  const shippingCost = formData.shippingMethod === "express" ? 50000 : 30000;
  const total = subtotal - discount + shippingCost;

  const steps: { id: CheckoutStep; label: string }[] = [
    { id: "address", label: "Shipping Address" },
    { id: "shipping", label: "Shipping Method" },
    { id: "payment", label: "Payment" },
    { id: "review", label: "Review Order" },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

  const handleNext = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex].id);
    }
  };

  const handleBack = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex].id);
    }
  };

  const handlePlaceOrder = () => {
    // Mock order placement
    alert("Order placed successfully! (Mock)");
    clearCart();
    router.push("/");
  };

  useEffect(() => {
    if (items.length === 0) {
      router.push("/cart");
    }
  }, [items.length, router]);

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                    index <= currentStepIndex
                      ? "bg-primary border-primary text-primary-foreground"
                      : "border-muted-foreground text-muted-foreground"
                  }`}
                >
                  {index < currentStepIndex ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span className="text-xs mt-2 text-center">{step.label}</span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`h-0.5 flex-1 ${
                    index < currentStepIndex ? "bg-primary" : "bg-muted"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          {/* Address Step */}
          {currentStep === "address" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Full Name *"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  className="h-10 px-3 rounded-md border border-input bg-background"
                  required
                />
                <input
                  type="email"
                  placeholder="Email *"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="h-10 px-3 rounded-md border border-input bg-background"
                  required
                />
                <input
                  type="tel"
                  placeholder="Phone *"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="h-10 px-3 rounded-md border border-input bg-background"
                  required
                />
                <input
                  type="text"
                  placeholder="City *"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  className="h-10 px-3 rounded-md border border-input bg-background"
                  required
                />
                <input
                  type="text"
                  placeholder="District *"
                  value={formData.district}
                  onChange={(e) =>
                    setFormData({ ...formData, district: e.target.value })
                  }
                  className="h-10 px-3 rounded-md border border-input bg-background"
                  required
                />
                <input
                  type="text"
                  placeholder="Ward *"
                  value={formData.ward}
                  onChange={(e) =>
                    setFormData({ ...formData, ward: e.target.value })
                  }
                  className="h-10 px-3 rounded-md border border-input bg-background"
                  required
                />
              </div>
              <textarea
                placeholder="Address *"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className="w-full h-24 px-3 py-2 rounded-md border border-input bg-background"
                required
              />
            </div>
          )}

          {/* Shipping Step */}
          {currentStep === "shipping" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold mb-4">Shipping Method</h2>
              <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-accent">
                <input
                  type="radio"
                  name="shipping"
                  value="standard"
                  checked={formData.shippingMethod === "standard"}
                  onChange={(e) =>
                    setFormData({ ...formData, shippingMethod: e.target.value })
                  }
                  className="w-4 h-4"
                />
                <div className="flex-1">
                  <p className="font-medium">Standard Delivery</p>
                  <p className="text-sm text-muted-foreground">
                    3-5 business days
                  </p>
                </div>
                <span className="font-medium">{formatVND(30000)}</span>
              </label>
              <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-accent">
                <input
                  type="radio"
                  name="shipping"
                  value="express"
                  checked={formData.shippingMethod === "express"}
                  onChange={(e) =>
                    setFormData({ ...formData, shippingMethod: e.target.value })
                  }
                  className="w-4 h-4"
                />
                <div className="flex-1">
                  <p className="font-medium">Express Delivery</p>
                  <p className="text-sm text-muted-foreground">
                    1-2 business days
                  </p>
                </div>
                <span className="font-medium">
                  {formatMoney({ amount: 50000, currency: "VND" })}
                </span>
              </label>
            </div>
          )}

          {/* Payment Step */}
          {currentStep === "payment" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold mb-4">Payment Method</h2>
              <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-accent">
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={formData.paymentMethod === "cod"}
                  onChange={(e) =>
                    setFormData({ ...formData, paymentMethod: e.target.value })
                  }
                  className="w-4 h-4"
                />
                <div className="flex-1">
                  <p className="font-medium">Cash on Delivery</p>
                  <p className="text-sm text-muted-foreground">
                    Pay when you receive your order
                  </p>
                </div>
              </label>
              <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-accent opacity-50">
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  disabled
                  className="w-4 h-4"
                />
                <div className="flex-1">
                  <p className="font-medium">Credit/Debit Card</p>
                  <p className="text-sm text-muted-foreground">Coming soon</p>
                </div>
              </label>
            </div>
          )}

          {/* Review Step */}
          {currentStep === "review" && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold">Review Your Order</h2>

              <div>
                <h3 className="font-medium mb-2">Shipping Address</h3>
                <p className="text-sm text-muted-foreground">
                  {formData.fullName}
                  <br />
                  {formData.address}, {formData.ward}, {formData.district},{" "}
                  {formData.city}
                  <br />
                  {formData.phone} | {formData.email}
                </p>
              </div>

              <div>
                <h3 className="font-medium mb-2">Shipping Method</h3>
                <p className="text-sm text-muted-foreground">
                  {formData.shippingMethod === "express"
                    ? "Express Delivery (1-2 days)"
                    : "Standard Delivery (3-5 days)"}
                </p>
              </div>

              <div>
                <h3 className="font-medium mb-2">Payment Method</h3>
                <p className="text-sm text-muted-foreground">
                  Cash on Delivery
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-8">
            {currentStepIndex > 0 && (
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
            )}
            {currentStepIndex < steps.length - 1 ? (
              <Button onClick={handleNext} className="flex-1">
                Continue
              </Button>
            ) : (
              <Button onClick={handlePlaceOrder} className="flex-1">
                Place Order
              </Button>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="border rounded-lg p-6 sticky top-20">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-3 mb-4">
              {items.map((item) => {
                const product = mockProducts.find(
                  (p) => p.id === item.productId
                );
                if (!product) return null;
                return (
                  <div
                    key={`${item.productId}-${item.variantId}`}
                    className="flex justify-between text-sm"
                  >
                    <span>
                      {product.title} x{item.quantity}
                    </span>
                    <span>
                      {formatMoney({
                        amount:
                          (product.price.sale?.amount ||
                            product.price.list.amount) * item.quantity,
                        currency: "VND",
                      })}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="space-y-2 pt-4 border-t">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>
                  {formatMoney({ amount: subtotal, currency: "VND" })}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount</span>
                  <span>
                    -{formatMoney({ amount: discount, currency: "VND" })}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                <span>
                  {formatMoney({ amount: shippingCost, currency: "VND" })}
                </span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total</span>
                <span className="text-primary">
                  {formatMoney({ amount: total, currency: "VND" })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
