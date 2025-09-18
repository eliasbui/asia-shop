'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ProductWithDetails } from '@/types'
import { Star, ShoppingCart, Heart } from 'lucide-react'
import { useCartStore } from '@/store/cart'

interface ProductCardProps {
  product: ProductWithDetails
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore(state => state.addItem)
  
  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    await addItem(product, 1)
  }

  const discountPercentage = product.comparePrice 
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0

  return (
    <Link href={`/products/${product.slug}`} className="group">
      <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
        {/* Image Container */}
        <div className="relative aspect-square bg-gray-100">
          {product.images && product.images[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ShoppingCart className="h-12 w-12 text-gray-300" />
            </div>
          )}
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-2">
            {product.isFeatured && (
              <span className="bg-blue-600 text-white px-2 py-1 text-xs rounded">
                Featured
              </span>
            )}
            {discountPercentage > 0 && (
              <span className="bg-red-600 text-white px-2 py-1 text-xs rounded">
                -{discountPercentage}%
              </span>
            )}
            {product.inventory <= product.lowStockThreshold && product.inventory > 0 && (
              <span className="bg-yellow-600 text-white px-2 py-1 text-xs rounded">
                Low Stock
              </span>
            )}
            {product.inventory === 0 && (
              <span className="bg-gray-600 text-white px-2 py-1 text-xs rounded">
                Out of Stock
              </span>
            )}
          </div>

          {/* Quick Actions */}
          <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
              onClick={(e) => {
                e.preventDefault()
                // Add to wishlist logic
              }}
            >
              <Heart className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Category & Brand */}
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
            <span>{product.category.name}</span>
            {product.brand && (
              <>
                <span>•</span>
                <span>{product.brand.name}</span>
              </>
            )}
          </div>

          {/* Product Name */}
          <h3 className="font-medium text-gray-900 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          {product.reviewCount > 0 && (
            <div className="flex items-center gap-1 mb-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500">
                ({product.reviewCount})
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-lg font-bold text-gray-900">
                ${product.price.toFixed(2)}
              </span>
              {product.comparePrice && (
                <span className="ml-2 text-sm text-gray-500 line-through">
                  ${product.comparePrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={product.inventory === 0}
              className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              aria-label="Add to cart"
            >
              <ShoppingCart className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}