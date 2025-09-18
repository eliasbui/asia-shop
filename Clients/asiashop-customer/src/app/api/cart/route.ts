import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authConfig } from '@/lib/auth/config'
import { CartItemWithProduct, Cart } from '@/types'
import { getProductById } from '@/lib/mock-data'

// Mock cart storage (in production, this would be stored in database)
const mockCarts = new Map<string, CartItemWithProduct[]>()

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authConfig)
    const userId = session?.user?.id || 'guest'
    
    const cartItems = mockCarts.get(userId) || []
    
    // Calculate cart totals
    const subtotal = cartItems.reduce((total, item) => {
      const price = item.variant?.price || item.product.price
      return total + (price * item.quantity)
    }, 0)
    
    const taxRate = 0.08 // 8% tax
    const taxAmount = subtotal * taxRate
    const shippingAmount = subtotal > 100 ? 0 : 10 // Free shipping over $100
    const discountAmount = 0 // No discount applied
    const totalAmount = subtotal + taxAmount + shippingAmount - discountAmount
    const itemCount = cartItems.reduce((count, item) => count + item.quantity, 0)
    
    const cart: Cart = {
      items: cartItems,
      subtotal,
      taxAmount,
      shippingAmount,
      discountAmount,
      totalAmount,
      itemCount,
    }
    
    return NextResponse.json({
      success: true,
      data: cart
    })
    
  } catch (error) {
    console.error('Cart fetch error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch cart' },
      { status: 500 }
    )
  }
}