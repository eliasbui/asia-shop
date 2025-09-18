'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Package, Mail, ArrowRight } from 'lucide-react'

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('order')

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-green-100 p-3">
            <CheckCircle className="h-16 w-16 text-green-600" />
          </div>
        </div>

        {/* Success Message */}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Order Placed Successfully!
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Thank you for your purchase. Your order has been confirmed.
        </p>

        {/* Order Number */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <p className="text-sm text-gray-600 mb-2">Order Number</p>
          <p className="text-2xl font-mono font-semibold text-gray-900">
            #{orderId || '1234567890'}
          </p>
        </div>

        {/* What's Next */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            What Happens Next?
          </h2>
          
          <div className="space-y-6">
            <div className="flex items-start">
              <Mail className="h-6 w-6 text-blue-600 mt-1 mr-4 flex-shrink-0" />
              <div className="text-left">
                <h3 className="font-medium text-gray-900">Order Confirmation Email</h3>
                <p className="text-sm text-gray-600 mt-1">
                  We've sent a confirmation email with your order details and receipt.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <Package className="h-6 w-6 text-blue-600 mt-1 mr-4 flex-shrink-0" />
              <div className="text-left">
                <h3 className="font-medium text-gray-900">Order Processing</h3>
                <p className="text-sm text-gray-600 mt-1">
                  We're preparing your order for shipment. You'll receive a tracking number once it ships.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <ArrowRight className="h-6 w-6 text-blue-600 mt-1 mr-4 flex-shrink-0" />
              <div className="text-left">
                <h3 className="font-medium text-gray-900">Track Your Order</h3>
                <p className="text-sm text-gray-600 mt-1">
                  You can track your order status anytime from your account dashboard.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/orders"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            View Order Details
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Continue Shopping
          </Link>
        </div>

        {/* Customer Support */}
        <div className="mt-12 pt-8 border-t">
          <p className="text-sm text-gray-600">
            Need help with your order? {' '}
            <Link href="/support" className="text-blue-600 hover:text-blue-700 font-medium">
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}