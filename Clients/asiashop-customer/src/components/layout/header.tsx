'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { useAuth } from '@/hooks/use-auth'
import { useCartStore } from '@/store/cart'
import { 
  Search, 
  ShoppingCart, 
  User, 
  Heart, 
  Menu,
  LogOut,
  Package,
  Settings,
  HelpCircle
} from 'lucide-react'
import { useState } from 'react'

export function Header() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const cartItemCount = useCartStore(state => state.getItemCount())
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut({ redirect: false })
    router.push('/')
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Main Nav */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-blue-600">AsiaShop</h1>
            </Link>
            
            <nav className="hidden md:ml-10 md:flex space-x-8">
              <Link href="/products" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                Products
              </Link>
              <Link href="/categories" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                Categories
              </Link>
              <Link href="/deals" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                Deals
              </Link>
              <Link href="/new-arrivals" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                New Arrivals
              </Link>
            </nav>
          </div>

          {/* Search Bar */}
          <div className="hidden md:block flex-1 max-w-md mx-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link href="/wishlist" className="p-2 text-gray-600 hover:text-blue-600">
                  <Heart className="h-6 w-6" />
                </Link>
                
                <Link href="/cart" className="p-2 text-gray-600 hover:text-blue-600 relative">
                  <ShoppingCart className="h-6 w-6" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">
                      {cartItemCount}
                    </span>
                  )}
                </Link>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="p-2 text-gray-600 hover:text-blue-600"
                  >
                    <User className="h-6 w-6" />
                  </button>
                  
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                      <div className="px-4 py-2 border-b">
                        <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                      <Link
                        href="/dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Settings className="inline h-4 w-4 mr-2" />
                        Profile Settings
                      </Link>
                      <Link
                        href="/orders"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Package className="inline h-4 w-4 mr-2" />
                        My Orders
                      </Link>
                      <Link
                        href="/support"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <HelpCircle className="inline h-4 w-4 mr-2" />
                        Support
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-t"
                      >
                        <LogOut className="inline h-4 w-4 mr-2" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                  Sign In
                </Link>
                <Link href="/auth/register" className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium">
                  Sign Up
                </Link>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-blue-600"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link href="/products" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600">
              Products
            </Link>
            <Link href="/categories" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600">
              Categories
            </Link>
            <Link href="/deals" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600">
              Deals
            </Link>
            <Link href="/new-arrivals" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600">
              New Arrivals
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}