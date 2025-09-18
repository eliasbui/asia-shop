'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { Cart, CartItemWithProduct } from '@/types'
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight,
  ShoppingCart,
  Tag,
  Truck
} from 'lucide-react'

export default function CartPage() {
  const router = useRouter()
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)
  const [couponCode, setCouponCode] = useState('')

  useEffect(() => {
    fetchCart()
  }, [])

  const fetchCart = async () => {
    try {
      const response = await axios.get('/api/cart')
      if (response.data.success) {
        setCart(response.data.data)
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (item: CartItemWithProduct, newQuantity: number) => {
    if (newQuantity < 1) {
      await removeItem(item)
      return
    }

    setUpdating(item.id)
    try {
      const response = await axios.put('/api/cart/update', {
        productId: item.productId,
        variantId: item.variantId,
        quantity: newQuantity
      })

      if (response.data.success) {
        await fetchCart()
      }
    } catch (error) {
      console.error('Failed to update quantity:', error)
    } finally {
      setUpdating(null)
    }
  }

  const removeItem = async (item: CartItemWithProduct) => {
    setUpdating(item.id)
    try {
      const response = await axios.delete('/api/cart/remove', {
        data: {
          productId: item.productId,
          variantId: item.variantId
        }
      })

      if (response.data.success) {
        await fetchCart()
      }
    } catch (error) {
      console.error('Failed to remove item:', error)
    } finally {
      setUpdating(null)
    }
  }

  const applyCoupon = async () => {
    if (!couponCode.trim()) return

    try {
      const response = await axios.post('/api/cart/apply-coupon', {
        couponCode
      })

      if (response.data.success) {
        await fetchCart()
        setCouponCode('')
      }
    } catch (error) {
      console.error('Failed to apply coupon:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
          <h2 className="mt-2 text-lg font-medium text-gray-900">Your cart is empty</h2>
          <p className="mt-1 text-sm text-gray-500">Start shopping to add items to your cart</p>
          <div className="mt-6">
            <Link
              href="/products"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

      <div className="lg:grid lg:grid-cols-12 lg:gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">
                  Cart Items ({cart.itemCount})
                </h2>
                <button
                  onClick={() => router.push('/products')}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Continue Shopping
                </button>
              </div>
            </div>

            <div className="divide-y">
              {cart.items.map((item) => (
                <div key={item.id} className="p-6">
                  <div className="flex items-start space-x-4">
                    {/* Product Image */}
                    <Link href={`/products/${item.product.slug}`} className="flex-shrink-0">
                      <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
                        {item.product.images?.[0] ? (
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingBag className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                    </Link>

                    {/* Product Details */}
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div>
                          <Link
                            href={`/products/${item.product.slug}`}
                            className="text-lg font-medium text-gray-900 hover:text-blue-600"
                          >
                            {item.product.name}
                          </Link>
                          {item.variant && (
                            <div className="mt-1 text-sm text-gray-500">
                              {Object.entries(item.variant.options).map(([key, value]) => (
                                <span key={key} className="mr-2">
                                  {key}: {value}
                                </span>
                              ))}
                            </div>
                          )}
                          <div className="mt-1 text-sm text-gray-500">
                            {item.product.inventory <= item.product.lowStockThreshold && (
                              <span className="text-orange-600">
                                Only {item.product.inventory} left in stock
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <p className="text-lg font-medium text-gray-900">
                            ${((item.variant?.price || item.product.price) * item.quantity).toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-500">
                            ${(item.variant?.price || item.product.price).toFixed(2)} each
                          </p>
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item, item.quantity - 1)}
                            disabled={updating === item.id}
                            className="p-1 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item, parseInt(e.target.value) || 1)}
                            disabled={updating === item.id}
                            className="w-16 text-center border border-gray-300 rounded-md px-2 py-1"
                            min="1"
                            max={item.product.inventory}
                          />
                          <button
                            onClick={() => updateQuantity(item, item.quantity + 1)}
                            disabled={updating === item.id || item.quantity >= item.product.inventory}
                            className="p-1 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item)}
                          disabled={updating === item.id}
                          className="text-red-600 hover:text-red-700 disabled:opacity-50"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-4 mt-8 lg:mt-0">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>

            {/* Coupon Code */}
            <div className="mb-4">
              <label htmlFor="coupon" className="block text-sm font-medium text-gray-700 mb-1">
                Coupon Code
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  id="coupon"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Enter code"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  onClick={applyCoupon}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Apply
                </button>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-2 border-t pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900">${cart.subtotal.toFixed(2)}</span>
              </div>
              
              {cart.discountAmount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 flex items-center">
                    <Tag className="h-4 w-4 mr-1" />
                    Discount
                  </span>
                  <span className="text-green-600">-${cart.discountAmount.toFixed(2)}</span>
                </div>
              )}
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax</span>
                <span className="text-gray-900">${cart.taxAmount.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 flex items-center">
                  <Truck className="h-4 w-4 mr-1" />
                  Shipping
                </span>
                <span className="text-gray-900">
                  {cart.shippingAmount === 0 ? (
                    <span className="text-green-600">FREE</span>
                  ) : (
                    `$${cart.shippingAmount.toFixed(2)}`
                  )}
                </span>
              </div>
              
              {cart.subtotal < 100 && (
                <p className="text-xs text-gray-500 mt-2">
                  Add ${(100 - cart.subtotal).toFixed(2)} more for free shipping!
                </p>
              )}
            </div>

            {/* Total */}
            <div className="border-t mt-4 pt-4">
              <div className="flex justify-between">
                <span className="text-base font-medium text-gray-900">Total</span>
                <span className="text-xl font-semibold text-gray-900">
                  ${cart.totalAmount.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Checkout Button */}
            <Link
              href="/checkout"
              className="mt-6 w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Proceed to Checkout
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>

            {/* Security Note */}
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                🔒 Secure checkout powered by Stripe
              </p>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-6 bg-blue-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-900 mb-2">
              Shopping Benefits
            </h3>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>✓ Free shipping on orders over $100</li>
              <li>✓ 30-day return policy</li>
              <li>✓ Secure payment processing</li>
              <li>✓ Order tracking available</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}