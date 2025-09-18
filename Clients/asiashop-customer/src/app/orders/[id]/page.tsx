'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { 
  ArrowLeft,
  Package,
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  CreditCard,
  Download,
  Printer,
  Copy,
  ChevronRight,
  AlertCircle,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  FileText,
  MessageSquare,
  RotateCcw,
  XCircle,
  Shield
} from 'lucide-react'
import { getOrderById, getOrderStatusColor, getPaymentMethodIcon } from '@/lib/mock-orders'
import { OrderWithDetails } from '@/types'

interface TimelineEvent {
  id: string
  title: string
  description: string
  date: Date
  status: 'completed' | 'current' | 'pending'
  icon: React.ReactNode
}

export default function OrderDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [order, setOrder] = useState<OrderWithDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [copiedTracking, setCopiedTracking] = useState(false)

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      const orderData = getOrderById(params.id as string)
      if (orderData) {
        setOrder(orderData)
      }
      setLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [params.id])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedTracking(true)
    setTimeout(() => setCopiedTracking(false), 2000)
  }

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatDateTime = (date: Date | string) => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return <CheckCircle className="w-5 h-5" />
      case 'SHIPPED':
        return <Truck className="w-5 h-5" />
      case 'PROCESSING':
        return <Clock className="w-5 h-5" />
      case 'CANCELLED':
        return <XCircle className="w-5 h-5" />
      default:
        return <AlertCircle className="w-5 h-5" />
    }
  }

  const getTimeline = (): TimelineEvent[] => {
    if (!order) return []

    const timeline: TimelineEvent[] = [
      {
        id: 'placed',
        title: 'Order Placed',
        description: `Order ${order.orderNumber} was placed`,
        date: order.createdAt,
        status: 'completed',
        icon: <CheckCircle className="w-5 h-5" />
      }
    ]

    if (order.status === 'CANCELLED') {
      timeline.push({
        id: 'cancelled',
        title: 'Order Cancelled',
        description: 'Your order was cancelled',
        date: order.updatedAt,
        status: 'completed',
        icon: <XCircle className="w-5 h-5" />
      })
      return timeline
    }

    if (order.paymentStatus === 'CAPTURED' || order.paymentStatus === 'AUTHORIZED') {
      timeline.push({
        id: 'payment',
        title: 'Payment Confirmed',
        description: `Payment of $${order.totalAmount.toFixed(2)} confirmed`,
        date: order.payments[0]?.createdAt || order.createdAt,
        status: 'completed',
        icon: <CreditCard className="w-5 h-5" />
      })
    }

    if (order.status === 'PROCESSING' || order.status === 'SHIPPED' || order.status === 'DELIVERED') {
      timeline.push({
        id: 'processing',
        title: 'Processing',
        description: 'Your order is being prepared',
        date: order.createdAt,
        status: 'completed',
        icon: <Clock className="w-5 h-5" />
      })
    }

    if (order.status === 'SHIPPED' || order.status === 'DELIVERED') {
      timeline.push({
        id: 'shipped',
        title: 'Shipped',
        description: order.shipments[0] 
          ? `Shipped via ${order.shipments[0].carrier}`
          : 'Your order has been shipped',
        date: order.shipments[0]?.shippedAt || order.updatedAt,
        status: order.status === 'SHIPPED' ? 'current' : 'completed',
        icon: <Truck className="w-5 h-5" />
      })
    }

    if (order.status === 'DELIVERED') {
      timeline.push({
        id: 'delivered',
        title: 'Delivered',
        description: 'Package delivered successfully',
        date: order.shipments[0]?.deliveredAt || order.updatedAt,
        status: 'completed',
        icon: <CheckCircle className="w-5 h-5" />
      })
    } else if (order.status !== 'CANCELLED') {
      timeline.push({
        id: 'delivery',
        title: 'Out for Delivery',
        description: 'Estimated delivery coming soon',
        date: new Date(),
        status: 'pending',
        icon: <MapPin className="w-5 h-5" />
      })
    }

    return timeline
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white p-6 rounded-lg shadow">
                    <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Order not found</h3>
            <p className="text-gray-600 mb-6">
              The order you're looking for doesn't exist or has been removed.
            </p>
            <Link
              href="/orders"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Orders
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Orders
          </button>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Order {order.orderNumber}
              </h1>
              <div className="flex items-center gap-4">
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getOrderStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                  {order.status.replace('_', ' ')}
                </span>
                <span className="text-sm text-gray-600">
                  Placed on {formatDate(order.createdAt)}
                </span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                <Download className="w-5 h-5 mr-2" />
                Invoice
              </button>
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                <Printer className="w-5 h-5 mr-2" />
                Print
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Order Items</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {order.items.map((item) => (
                  <div key={item.id} className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        {item.product.images && item.product.images[0] ? (
                          <Image
                            src={item.product.images[0].url}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-gray-400">
                            <Package className="w-10 h-10" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 mb-1">
                          {item.product.name}
                        </h3>
                        {item.variant && (
                          <p className="text-sm text-gray-600 mb-2">
                            Variant: {item.variant.name}
                          </p>
                        )}
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>SKU: {item.product.sku}</span>
                          <span>Qty: {item.quantity}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">
                          ${item.totalAmount.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-600">
                          ${item.price.toFixed(2)} each
                        </p>
                      </div>
                    </div>
                    
                    {order.status === 'DELIVERED' && (
                      <div className="mt-4 flex gap-2">
                        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                          Write a Review
                        </button>
                        <span className="text-gray-300">•</span>
                        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                          Buy Again
                        </button>
                        <span className="text-gray-300">•</span>
                        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                          Return Item
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Information */}
            {order.shipments && order.shipments.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Shipping Information</h2>
                </div>
                <div className="p-6">
                  {order.shipments.map((shipment) => (
                    <div key={shipment.id} className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-gray-900 mb-1">
                            {shipment.carrier} - {shipment.status.replace('_', ' ')}
                          </p>
                          <p className="text-sm text-gray-600">
                            Tracking: {shipment.trackingNumber}
                          </p>
                          {shipment.shippedAt && (
                            <p className="text-sm text-gray-600 mt-1">
                              Shipped: {formatDateTime(shipment.shippedAt)}
                            </p>
                          )}
                          {shipment.deliveredAt && (
                            <p className="text-sm text-gray-600">
                              Delivered: {formatDateTime(shipment.deliveredAt)}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => copyToClipboard(shipment.trackingNumber)}
                            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                            title="Copy tracking number"
                          >
                            {copiedTracking ? (
                              <CheckCircle className="w-5 h-5 text-green-500" />
                            ) : (
                              <Copy className="w-5 h-5" />
                            )}
                          </button>
                          <button className="inline-flex items-center px-3 py-1 border border-blue-600 rounded-lg text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors">
                            Track Package
                          </button>
                        </div>
                      </div>
                      
                      <div className="border-t border-gray-200 pt-4">
                        <p className="font-medium text-gray-900 mb-2">Delivery Address</p>
                        <div className="text-sm text-gray-600">
                          <p>{order.shippingAddress?.firstName} {order.shippingAddress?.lastName}</p>
                          {order.shippingAddress?.company && (
                            <p>{order.shippingAddress.company}</p>
                          )}
                          <p>{order.shippingAddress?.address1}</p>
                          {order.shippingAddress?.address2 && (
                            <p>{order.shippingAddress.address2}</p>
                          )}
                          <p>
                            {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode}
                          </p>
                          <p>{order.shippingAddress?.country}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Order Timeline */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Order Timeline</h2>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  {getTimeline().map((event, index) => (
                    <div key={event.id} className="flex gap-4">
                      <div className="relative flex flex-col items-center">
                        <div className={`
                          w-10 h-10 rounded-full flex items-center justify-center
                          ${event.status === 'completed' ? 'bg-green-100 text-green-600' :
                            event.status === 'current' ? 'bg-blue-100 text-blue-600' :
                            'bg-gray-100 text-gray-400'}
                        `}>
                          {event.icon}
                        </div>
                        {index < getTimeline().length - 1 && (
                          <div className={`
                            absolute top-10 w-0.5 h-16
                            ${event.status === 'completed' ? 'bg-green-200' : 'bg-gray-200'}
                          `} />
                        )}
                      </div>
                      <div className="flex-1 pb-8">
                        <h3 className={`
                          font-medium mb-1
                          ${event.status === 'pending' ? 'text-gray-500' : 'text-gray-900'}
                        `}>
                          {event.title}
                        </h3>
                        <p className="text-sm text-gray-600">{event.description}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDateTime(event.date)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
              </div>
              <div className="p-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${order.subtotal.toFixed(2)}</span>
                </div>
                {order.discountAmount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Discount</span>
                    <span className="font-medium text-green-600">
                      -${order.discountAmount.toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {order.shippingAmount === 0 ? 'FREE' : `$${order.shippingAmount.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">${order.taxAmount.toFixed(2)}</span>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <div className="flex justify-between">
                    <span className="text-base font-medium">Total</span>
                    <span className="text-base font-semibold text-gray-900">
                      ${order.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Payment Information</h2>
              </div>
              <div className="p-6 space-y-4">
                {order.payments.map((payment) => (
                  <div key={payment.id}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">
                        {getPaymentMethodIcon(payment.method)}
                      </span>
                      <span className="font-medium text-gray-900">
                        {payment.method.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>Amount: ${payment.amount.toFixed(2)}</p>
                      <p>Status: {payment.status}</p>
                      <p>Transaction: {payment.transactionId}</p>
                    </div>
                  </div>
                ))}
                
                <div className="pt-4 border-t border-gray-200">
                  <p className="font-medium text-gray-900 mb-2">Billing Address</p>
                  <div className="text-sm text-gray-600">
                    <p>{order.billingAddress?.firstName} {order.billingAddress?.lastName}</p>
                    {order.billingAddress?.company && (
                      <p>{order.billingAddress.company}</p>
                    )}
                    <p>{order.billingAddress?.address1}</p>
                    {order.billingAddress?.address2 && (
                      <p>{order.billingAddress.address2}</p>
                    )}
                    <p>
                      {order.billingAddress?.city}, {order.billingAddress?.state} {order.billingAddress?.postalCode}
                    </p>
                    <p>{order.billingAddress?.country}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Support */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Need Help?</h2>
              </div>
              <div className="p-6 space-y-3">
                <a href="#" className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition-colors">
                  <MessageSquare className="w-5 h-5" />
                  <span className="text-sm font-medium">Contact Support</span>
                </a>
                <a href="#" className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition-colors">
                  <Phone className="w-5 h-5" />
                  <span className="text-sm font-medium">1-800-ASIASHOP</span>
                </a>
                <a href="#" className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition-colors">
                  <Mail className="w-5 h-5" />
                  <span className="text-sm font-medium">support@asiashop.com</span>
                </a>
                {order.status === 'DELIVERED' && (
                  <a href="#" className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition-colors">
                    <RotateCcw className="w-5 h-5" />
                    <span className="text-sm font-medium">Return or Replace Items</span>
                  </a>
                )}
              </div>
            </div>

            {/* Order Actions */}
            {order.status === 'PROCESSING' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">
                      Order can still be modified
                    </p>
                    <p className="text-sm text-yellow-700 mt-1">
                      You can cancel this order or update shipping details until it's shipped.
                    </p>
                    <button className="mt-3 text-sm font-medium text-yellow-800 hover:text-yellow-900">
                      Cancel Order →
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}