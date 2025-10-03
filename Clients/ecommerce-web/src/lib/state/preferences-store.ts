/**
 * User preferences state management with Zustand
 * Persisted to localStorage
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PreferencesState {
  analyticsConsent: boolean | null;
  wishlist: string[]; // Product IDs
  recentlyViewed: string[]; // Product IDs
  compareList: string[]; // Product IDs for comparison
  theme: "light" | "dark" | "system";
}

interface PreferencesActions {
  setAnalyticsConsent: (consent: boolean) => void;
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  addToRecentlyViewed: (productId: string) => void;
  clearRecentlyViewed: () => void;
  addToCompare: (productId: string) => void;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
  setTheme: (theme: "light" | "dark" | "system") => void;
}

type PreferencesStore = PreferencesState & PreferencesActions;

const MAX_RECENTLY_VIEWED = 20;
const MAX_COMPARE = 4;

export const usePreferencesStore = create<PreferencesStore>()(
  persist(
    (set, get) => ({
      analyticsConsent: null,
      wishlist: [],
      recentlyViewed: [],
      compareList: [],
      theme: "system",

      setAnalyticsConsent: (consent) => {
        set({ analyticsConsent: consent });
      },

      addToWishlist: (productId) => {
        const wishlist = get().wishlist;
        if (!wishlist.includes(productId)) {
          set({ wishlist: [...wishlist, productId] });
        }
      },

      removeFromWishlist: (productId) => {
        set({
          wishlist: get().wishlist.filter((id) => id !== productId),
        });
      },

      toggleWishlist: (productId) => {
        const isInWishlist = get().isInWishlist(productId);
        if (isInWishlist) {
          get().removeFromWishlist(productId);
        } else {
          get().addToWishlist(productId);
        }
      },

      isInWishlist: (productId) => {
        return get().wishlist.includes(productId);
      },

      addToRecentlyViewed: (productId) => {
        const recentlyViewed = get().recentlyViewed;
        const filtered = recentlyViewed.filter((id) => id !== productId);
        const updated = [productId, ...filtered].slice(0, MAX_RECENTLY_VIEWED);
        set({ recentlyViewed: updated });
      },

      clearRecentlyViewed: () => {
        set({ recentlyViewed: [] });
      },

      addToCompare: (productId) => {
        const compareList = get().compareList;
        if (
          !compareList.includes(productId) &&
          compareList.length < MAX_COMPARE
        ) {
          set({ compareList: [...compareList, productId] });
        }
      },

      removeFromCompare: (productId) => {
        set({
          compareList: get().compareList.filter((id) => id !== productId),
        });
      },

      clearCompare: () => {
        set({ compareList: [] });
      },

      setTheme: (theme) => {
        set({ theme });
      },
    }),
    {
      name: "preferences-storage",
    }
  )
);
