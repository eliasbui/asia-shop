import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authConfig } from '@/lib/auth/config'
import { CartItemWithProduct } from '@/types'
import { getProductById } from '@/lib/mock-data'

// Mock cart storage (shared with main cart route)
const mockCarts = new Map<string, CartItemWithProduct[]>()

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authConfig)
    const userId = session?.user?.id || 'guest'
    
    const { productId, variantId, quantity = 1 } = await request.json()
    
    if (!productId) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      )
    }
    
    const product = getProductById(productId)
    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }
    
    // Check stock
    const variant = variantId ? product.variants.find(v => v.id === variantId) : undefined
    const availableStock = variant ? variant.inventory : product.inventory
    
    if (availableStock < quantity) {
      return NextResponse.json(
        { success: false, error: 'Insufficient stock' },
        { status: 400 }
      )
    }
    
    // Get current cart
    const cartItems = mockCarts.get(userId) || []
    
    // Check if item already exists in cart
    const existingItemIndex = cartItems.findIndex(item => 
      item.productId === productId && item.variantId === variantId
    )
    
    if (existingItemIndex > -1) {
      // Update quantity
      const newQuantity = cartItems[existingItemIndex].quantity + quantity
      if (newQuantity > availableStock) {
        return NextResponse.json(
          { success: false, error: 'Cannot add more items than available stock' },
          { status: 400 }
        )
      }
      cartItems[existingItemIndex].quantity = newQuantity
    } else {
      // Add new item
      const newItem: CartItemWithProduct = {
        id: `cart-${Date.now()}`,
        userId,
        productId,
        variantId,
        quantity,
        product,
        variant,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      cartItems.push(newItem)
    }
    
    // Save cart
    mockCarts.set(userId, cartItems)
    
    return NextResponse.json({
      success: true,
      message: 'Item added to cart',
      data: { itemCount: cartItems.length }
    })
    
  } catch (error) {
    console.error('Add to cart error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to add item to cart' },
      { status: 500 }
    )
  }
}