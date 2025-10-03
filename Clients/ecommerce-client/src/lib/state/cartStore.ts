import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, Variant } from '@/lib/types/domain';

export interface CartItem {
  id: string;
  product: Product;
  variant: Variant;
  quantity: number;
  addedAt: Date;
}

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, variant: Variant, quantity?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => { subtotal: number; total: number };
  getItemById: (itemId: string) => CartItem | undefined;
  isInCart: (productId: string, variantId: string) => boolean;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, variant, quantity = 1) => {
        const existingItemIndex = get().items.findIndex(
          item => item.product.id === product.id && item.variant.id === variant.id
        );

        if (existingItemIndex >= 0) {
          // Update existing item quantity
          set((state) => {
            const newItems = [...state.items];
            newItems[existingItemIndex].quantity += quantity;
            return { items: newItems };
          });
        } else {
          // Add new item
          const newItem: CartItem = {
            id: `${product.id}-${variant.id}-${Date.now()}`,
            product,
            variant,
            quantity,
            addedAt: new Date()
          };
          set((state) => ({ items: [...state.items, newItem] }));
        }
      },

      removeItem: (itemId) => {
        set((state) => ({
          items: state.items.filter(item => item.id !== itemId)
        }));
      },

      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }

        set((state) => ({
          items: state.items.map(item =>
            item.id === itemId ? { ...item, quantity } : item
          )
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        const subtotal = get().items.reduce((total, item) => {
          const price = item.variant.price || item.product.price;
          const unitPrice = price.sale?.amount || price.list.amount;
          return total + (unitPrice * item.quantity);
        }, 0);

        return {
          subtotal,
          total: subtotal // Would include shipping, taxes, etc.
        };
      },

      getItemById: (itemId) => {
        return get().items.find(item => item.id === itemId);
      },

      isInCart: (productId, variantId) => {
        return get().items.some(
          item => item.product.id === productId && item.variant.id === variantId
        );
      }
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ items: state.items })
    }
  )
);