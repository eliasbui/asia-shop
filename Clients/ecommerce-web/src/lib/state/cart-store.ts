import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Product, Variant, Money, Cart, CartItem } from "@/types/models";

interface CartState {
  items: CartItem[];
  appliedCoupon: string | null;
  
  // Actions
  addItem: (product: Product, variant?: Variant, quantity?: number) => void;
  updateQuantity: (productId: string, variantId: string | undefined, quantity: number) => void;
  removeItem: (productId: string, variantId?: string) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => void;
  removeCoupon: () => void;
  
  // Computed values
  getItemCount: () => number;
  getSubtotal: () => Money;
  getCart: () => Cart;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      appliedCoupon: null,
      
      addItem: (product, variant, quantity = 1) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (item) =>
              item.productId === product.id &&
              item.variantId === variant?.id
          );
          
          if (existingItemIndex !== -1) {
            // Update quantity if item exists
            const newItems = [...state.items];
            newItems[existingItemIndex].quantity += quantity;
            return { items: newItems };
          }
          
          // Add new item
          const newItem: CartItem = {
            productId: product.id,
            variantId: variant?.id,
            quantity,
            product,
            variant,
          };
          
          return { items: [...state.items, newItem] };
        });
      },
      
      updateQuantity: (productId, variantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId, variantId);
          return;
        }
        
        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId && item.variantId === variantId
              ? { ...item, quantity }
              : item
          ),
        }));
      },
      
      removeItem: (productId, variantId) => {
        set((state) => ({
          items: state.items.filter(
            (item) =>
              !(item.productId === productId && item.variantId === variantId)
          ),
        }));
      },
      
      clearCart: () => {
        set({ items: [], appliedCoupon: null });
      },
      
      applyCoupon: (code) => {
        set({ appliedCoupon: code });
      },
      
      removeCoupon: () => {
        set({ appliedCoupon: null });
      },
      
      getItemCount: () => {
        const state = get();
        return state.items.reduce((total, item) => total + item.quantity, 0);
      },
      
      getSubtotal: () => {
        const state = get();
        const amount = state.items.reduce((total, item) => {
          const price = item.variant?.price || item.product.price;
          const unitPrice = price.sale?.amount || price.list.amount;
          return total + unitPrice * item.quantity;
        }, 0);
        
        return {
          currency: "VND",
          amount,
        };
      },
      
      getCart: () => {
        const state = get();
        const subtotal = state.getSubtotal();
        
        // Mock shipping calculation
        const shipping: Money = {
          currency: "VND",
          amount: state.items.length > 0 ? 30000 : 0,
        };
        
        // Mock discount calculation
        const discount: Money | undefined = state.appliedCoupon
          ? {
              currency: "VND",
              amount: Math.floor(subtotal.amount * 0.1), // 10% discount
            }
          : undefined;
        
        const total: Money = {
          currency: "VND",
          amount:
            subtotal.amount + shipping.amount - (discount?.amount || 0),
        };
        
        return {
          items: state.items,
          subtotal,
          shipping,
          discount,
          total,
          appliedCoupon: state.appliedCoupon || undefined,
        };
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        appliedCoupon: state.appliedCoupon,
      }),
    }
  )
);
