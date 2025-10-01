import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, Product } from "@/types";

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, quantity?: number, variant?: CartItem["variant"]) => void;
  removeItem: (productId: string, variant?: CartItem["variant"]) => void;
  updateQuantity: (productId: string, quantity: number, variant?: CartItem["variant"]) => void;
  toggleSelect: (productId: string, variant?: CartItem["variant"]) => void;
  selectAll: () => void;
  deselectAll: () => void;
  clearSelected: () => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getSelectedTotal: () => number;
  getSelectedItems: () => CartItem[];
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity = 1, variant) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (item) =>
              item.productId === product.id &&
              JSON.stringify(item.variant) === JSON.stringify(variant)
          );

          if (existingItemIndex >= 0) {
            const newItems = [...state.items];
            newItems[existingItemIndex].quantity += quantity;
            return { items: newItems };
          }

          return {
            items: [
              ...state.items,
              {
                productId: product.id,
                quantity,
                variant,
                selected: true,
              },
            ],
          };
        });
      },

      removeItem: (productId, variant) => {
        set((state) => ({
          items: state.items.filter(
            (item) =>
              !(
                item.productId === productId &&
                JSON.stringify(item.variant) === JSON.stringify(variant)
              )
          ),
        }));
      },

      updateQuantity: (productId, quantity, variant) => {
        if (quantity <= 0) return;

        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId &&
            JSON.stringify(item.variant) === JSON.stringify(variant)
              ? { ...item, quantity }
              : item
          ),
        }));
      },

      toggleSelect: (productId, variant) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId &&
            JSON.stringify(item.variant) === JSON.stringify(variant)
              ? { ...item, selected: !item.selected }
              : item
          ),
        }));
      },

      selectAll: () => {
        set((state) => ({
          items: state.items.map((item) => ({ ...item, selected: true })),
        }));
      },

      deselectAll: () => {
        set((state) => ({
          items: state.items.map((item) => ({ ...item, selected: false })),
        }));
      },

      clearSelected: () => {
        set((state) => ({
          items: state.items.filter((item) => !item.selected),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getSelectedTotal: () => {
        return get()
          .items.filter((item) => item.selected)
          .reduce((total, item) => total + item.quantity, 0);
      },

      getSelectedItems: () => {
        return get().items.filter((item) => item.selected);
      },
    }),
    {
      name: "cart-storage",
    }
  )
);