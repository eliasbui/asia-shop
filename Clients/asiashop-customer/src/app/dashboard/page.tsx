'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks/use-auth'
import axios from 'axios'
import { 
  Package, 
  Heart, 
  Star, 
  Bell, 
  ShoppingBag,
  TrendingUp,
  ChevronRight,
  Clock,
  DollarSign
} from 'lucide-react'
import { DashboardStats } from '@/types'

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      const response = await axios.get('/api/dashboard/stats')
      if (response.data.success) {
        setStats(response.data.data)
      }
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.name?.split(' ')[0]}!
        </h1>
        <p className="mt-2 text-gray-600">
          Here's an overview of your account activity
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <Link href="/orders" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalOrders || 0}</p>
            </div>
            <Package className="h-10 w-10 text-blue-600" />
          </div>
        </Link>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Spent</p>
              <p className="text-2xl font-bold text-gray-900">
                ${stats?.totalSpent?.toFixed(2) || '0.00'}
              </p>
            </div>
            <DollarSign className="h-10 w-10 text-green-600" />
          </div>
        </div>

        <Link href="/wishlist" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Wishlist</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.activeWishlistItems || 0}</p>
            </div>
            <Heart className="h-10 w-10 text-red-600" />
          </div>
        </Link>

        <Link href="/reviews" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Reviews</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.pendingReviews || 0}</p>
            </div>
            <Star className="h-10 w-10 text-yellow-600" />
          </div>
        </Link>

        <Link href="/notifications" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Notifications</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.unreadNotifications || 0}</p>
            </div>
            <Bell className="h-10 w-10 text-purple-600" />
          </div>
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
            </div>
            <div className="p-6">
              {stats?.recentOrders && stats.recentOrders.length > 0 ? (
                <div className="space-y-4">
                  {stats.recentOrders.slice(0, 5).map((order) => (
                    <Link 
                      key={order.id} 
                      href={`/orders/${order.id}`}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <ShoppingBag className="h-10 w-10 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900">
                            Order #{order.orderNumber}
                          </p>
                          <p className="text-sm text-gray-600">
                            {new Date(order.createdAt).toLocaleDateString()} • {order.items.length} items
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                          order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'PROCESSING' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status}
                        </span>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">No orders yet</p>
                  <Link href="/products" className="mt-4 inline-block text-blue-600 hover:text-blue-500">
                    Start Shopping →
                  </Link>
                </div>
              )}
              
              {stats?.recentOrders && stats.recentOrders.length > 0 && (
                <div className="mt-4 text-center">
                  <Link href="/orders" className="text-blue-600 hover:text-blue-500 text-sm font-medium">
                    View All Orders →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Link href="/profile" className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
                <span className="text-gray-700">Edit Profile</span>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </Link>
              <Link href="/profile/addresses" className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
                <span className="text-gray-700">Manage Addresses</span>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </Link>
              <Link href="/profile/preferences" className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
                <span className="text-gray-700">Preferences</span>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </Link>
              <Link href="/support" className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
                <span className="text-gray-700">Get Support</span>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </Link>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-sm p-6 text-white">
            <TrendingUp className="h-8 w-8 mb-2" />
            <h3 className="font-semibold mb-1">Special Offers</h3>
            <p className="text-sm opacity-90 mb-3">Get 20% off on your next purchase!</p>
            <Link href="/deals" className="inline-block bg-white text-blue-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-100">
              Shop Now
            </Link>
          </div>
        </div>
      </div>

      {/* Recommended Products */}
      {stats?.recommendedProducts && stats.recommendedProducts.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Recommended for You</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.recommendedProducts.slice(0, 4).map((product) => (
                <Link 
                  key={product.id} 
                  href={`/products/${product.slug}`}
                  className="group"
                >
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-2">
                    {product.images && product.images[0] ? (
                      <img 
                        src={product.images[0]} 
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <h3 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    ${Number(product.price).toFixed(2)}
                  </p>
                </Link>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Link href="/products" className="text-blue-600 hover:text-blue-500 text-sm font-medium">
                View All Products →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}