import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type Theme = "light" | "dark" | "system";
type ViewMode = "grid" | "list";

interface UIState {
  // Theme
  theme: Theme;
  setTheme: (theme: Theme) => void;
  
  // Product view
  productViewMode: ViewMode;
  setProductViewMode: (mode: ViewMode) => void;
  
  // Sidebar & modals
  isMobileMenuOpen: boolean;
  isSearchModalOpen: boolean;
  isCartDrawerOpen: boolean;
  isFiltersOpen: boolean;
  
  toggleMobileMenu: () => void;
  toggleSearchModal: () => void;
  toggleCartDrawer: () => void;
  toggleFilters: () => void;
  
  setMobileMenu: (open: boolean) => void;
  setSearchModal: (open: boolean) => void;
  setCartDrawer: (open: boolean) => void;
  setFilters: (open: boolean) => void;
  
  // Wishlist
  wishlistItems: string[];
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  
  // Recently viewed
  recentlyViewed: string[];
  addToRecentlyViewed: (productId: string) => void;
  clearRecentlyViewed: () => void;
  
  // Search history
  searchHistory: string[];
  addToSearchHistory: (query: string) => void;
  clearSearchHistory: () => void;
  
  // Cookie consent
  cookieConsent: boolean | null;
  setCookieConsent: (consent: boolean) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      // Theme
      theme: "system",
      setTheme: (theme) => {
        set({ theme });
        
        // Apply theme to document
        if (theme === "dark") {
          document.documentElement.classList.add("dark");
        } else if (theme === "light") {
          document.documentElement.classList.remove("dark");
        } else {
          // System preference
          const prefersDark = window.matchMedia(
            "(prefers-color-scheme: dark)"
          ).matches;
          if (prefersDark) {
            document.documentElement.classList.add("dark");
          } else {
            document.documentElement.classList.remove("dark");
          }
        }
      },
      
      // Product view
      productViewMode: "grid",
      setProductViewMode: (mode) => set({ productViewMode: mode }),
      
      // Sidebar & modals
      isMobileMenuOpen: false,
      isSearchModalOpen: false,
      isCartDrawerOpen: false,
      isFiltersOpen: false,
      
      toggleMobileMenu: () =>
        set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
      toggleSearchModal: () =>
        set((state) => ({ isSearchModalOpen: !state.isSearchModalOpen })),
      toggleCartDrawer: () =>
        set((state) => ({ isCartDrawerOpen: !state.isCartDrawerOpen })),
      toggleFilters: () =>
        set((state) => ({ isFiltersOpen: !state.isFiltersOpen })),
      
      setMobileMenu: (open) => set({ isMobileMenuOpen: open }),
      setSearchModal: (open) => set({ isSearchModalOpen: open }),
      setCartDrawer: (open) => set({ isCartDrawerOpen: open }),
      setFilters: (open) => set({ isFiltersOpen: open }),
      
      // Wishlist
      wishlistItems: [],
      addToWishlist: (productId) =>
        set((state) => ({
          wishlistItems: [...new Set([...state.wishlistItems, productId])],
        })),
      removeFromWishlist: (productId) =>
        set((state) => ({
          wishlistItems: state.wishlistItems.filter((id) => id !== productId),
        })),
      isInWishlist: (productId) =>
        get().wishlistItems.includes(productId),
      clearWishlist: () => set({ wishlistItems: [] }),
      
      // Recently viewed
      recentlyViewed: [],
      addToRecentlyViewed: (productId) =>
        set((state) => ({
          recentlyViewed: [
            productId,
            ...state.recentlyViewed.filter((id) => id !== productId),
          ].slice(0, 10), // Keep only last 10
        })),
      clearRecentlyViewed: () => set({ recentlyViewed: [] }),
      
      // Search history
      searchHistory: [],
      addToSearchHistory: (query) =>
        set((state) => ({
          searchHistory: [
            query,
            ...state.searchHistory.filter((q) => q !== query),
          ].slice(0, 10), // Keep only last 10
        })),
      clearSearchHistory: () => set({ searchHistory: [] }),
      
      // Cookie consent
      cookieConsent: null,
      setCookieConsent: (consent) => set({ cookieConsent: consent }),
    }),
    {
      name: "ui-preferences",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        theme: state.theme,
        productViewMode: state.productViewMode,
        wishlistItems: state.wishlistItems,
        recentlyViewed: state.recentlyViewed,
        searchHistory: state.searchHistory,
        cookieConsent: state.cookieConsent,
      }),
    }
  )
);
