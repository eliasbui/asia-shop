import { NextRequest, NextResponse } from 'next/server'
import { mockProducts, getProductsByCategory, getProductsByBrand, searchProducts } from '@/lib/mock-data'
import { SearchFilters } from '@/types'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    
    // Parse filters from query params
    const filters: SearchFilters = {
      query: searchParams.get('q') || undefined,
      category: searchParams.get('category') || undefined,
      brand: searchParams.get('brand') || undefined,
      priceMin: searchParams.get('priceMin') ? Number(searchParams.get('priceMin')) : undefined,
      priceMax: searchParams.get('priceMax') ? Number(searchParams.get('priceMax')) : undefined,
      rating: searchParams.get('rating') ? Number(searchParams.get('rating')) : undefined,
      inStock: searchParams.get('inStock') === 'true',
      sortBy: searchParams.get('sortBy') as SearchFilters['sortBy'] || 'newest',
      page: Number(searchParams.get('page')) || 1,
      limit: Number(searchParams.get('limit')) || 12,
    }

    let filteredProducts = [...mockProducts]

    // Apply search query
    if (filters.query) {
      filteredProducts = searchProducts(filters.query)
    }

    // Apply category filter
    if (filters.category) {
      filteredProducts = filteredProducts.filter(p => p.category.id === filters.category)
    }

    // Apply brand filter
    if (filters.brand) {
      filteredProducts = filteredProducts.filter(p => p.brand?.id === filters.brand)
    }

    // Apply price range filter
    if (filters.priceMin !== undefined) {
      filteredProducts = filteredProducts.filter(p => p.price >= filters.priceMin!)
    }
    if (filters.priceMax !== undefined) {
      filteredProducts = filteredProducts.filter(p => p.price <= filters.priceMax!)
    }

    // Apply rating filter
    if (filters.rating !== undefined) {
      filteredProducts = filteredProducts.filter(p => p.rating >= filters.rating!)
    }

    // Apply stock filter
    if (filters.inStock) {
      filteredProducts = filteredProducts.filter(p => p.inventory > 0)
    }

    // Apply sorting
    switch (filters.sortBy) {
      case 'price_asc':
        filteredProducts.sort((a, b) => a.price - b.price)
        break
      case 'price_desc':
        filteredProducts.sort((a, b) => b.price - a.price)
        break
      case 'name_asc':
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'name_desc':
        filteredProducts.sort((a, b) => b.name.localeCompare(a.name))
        break
      case 'rating':
        filteredProducts.sort((a, b) => b.rating - a.rating)
        break
      case 'newest':
      default:
        filteredProducts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        break
    }

    // Apply pagination
    const totalItems = filteredProducts.length
    const totalPages = Math.ceil(totalItems / filters.limit!)
    const startIndex = (filters.page! - 1) * filters.limit!
    const endIndex = startIndex + filters.limit!
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex)

    return NextResponse.json({
      success: true,
      data: paginatedProducts,
      pagination: {
        page: filters.page!,
        limit: filters.limit!,
        totalPages,
        totalItems,
        hasNextPage: filters.page! < totalPages,
        hasPrevPage: filters.page! > 1,
      },
      filters: {
        applied: filters,
        available: {
          categories: Array.from(new Set(mockProducts.map(p => p.category))),
          brands: Array.from(new Set(mockProducts.map(p => p.brand).filter(Boolean))),
          priceRange: {
            min: Math.min(...mockProducts.map(p => p.price)),
            max: Math.max(...mockProducts.map(p => p.price)),
          },
        },
      },
    })

  } catch (error) {
    console.error('Products fetch error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}