import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CartItemWithProduct, ProductWithDetails, ProductVariant } from '@/types'
import axios from 'axios'

interface CartState {
  items: CartItemWithProduct[]
  isLoading: boolean
  
  // Actions
  addItem: (product: ProductWithDetails, quantity: number, variant?: ProductVariant) => Promise<void>
  removeItem: (productId: string, variantId?: string) => Promise<void>
  updateQuantity: (productId: string, quantity: number, variantId?: string) => Promise<void>
  clearCart: () => Promise<void>
  fetchCart: () => Promise<void>
  
  // Computed values
  getItemCount: () => number
  getSubtotal: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,

      addItem: async (product, quantity, variant) => {
        set({ isLoading: true })
        try {
          const response = await axios.post('/api/cart/add', {
            productId: product.id,
            variantId: variant?.id,
            quantity
          })
          
          if (response.data.success) {
            await get().fetchCart()
          }
        } catch (error) {
          console.error('Failed to add item to cart:', error)
        } finally {
          set({ isLoading: false })
        }
      },

      removeItem: async (productId, variantId) => {
        set({ isLoading: true })
        try {
          const response = await axios.delete('/api/cart/remove', {
            data: { productId, variantId }
          })
          
          if (response.data.success) {
            set(state => ({
              items: state.items.filter(item => 
                !(item.productId === productId && item.variantId === variantId)
              )
            }))
          }
        } catch (error) {
          console.error('Failed to remove item from cart:', error)
        } finally {
          set({ isLoading: false })
        }
      },

      updateQuantity: async (productId, quantity, variantId) => {
        if (quantity <= 0) {
          await get().removeItem(productId, variantId)
          return
        }

        set({ isLoading: true })
        try {
          const response = await axios.put('/api/cart/update', {
            productId,
            variantId,
            quantity
          })
          
          if (response.data.success) {
            set(state => ({
              items: state.items.map(item => 
                item.productId === productId && item.variantId === variantId
                  ? { ...item, quantity }
                  : item
              )
            }))
          }
        } catch (error) {
          console.error('Failed to update cart quantity:', error)
        } finally {
          set({ isLoading: false })
        }
      },

      clearCart: async () => {
        set({ isLoading: true })
        try {
          const response = await axios.delete('/api/cart/clear')
          
          if (response.data.success) {
            set({ items: [] })
          }
        } catch (error) {
          console.error('Failed to clear cart:', error)
        } finally {
          set({ isLoading: false })
        }
      },

      fetchCart: async () => {
        set({ isLoading: true })
        try {
          const response = await axios.get('/api/cart')
          
          if (response.data.success) {
            set({ items: response.data.data.items })
          }
        } catch (error) {
          console.error('Failed to fetch cart:', error)
        } finally {
          set({ isLoading: false })
        }
      },

      getItemCount: () => {
        const { items } = get()
        return items.reduce((total, item) => total + item.quantity, 0)
      },

      getSubtotal: () => {
        const { items } = get()
        return items.reduce((total, item) => {
          const price = item.variant?.price || item.product.price
          return total + (Number(price) * item.quantity)
        }, 0)
      }
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ items: state.items })
    }
  )
)