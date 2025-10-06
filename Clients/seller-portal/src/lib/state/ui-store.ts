import { create } from 'zustand';

interface UiState {
  sidebarCollapsed: boolean;
  analyticsConsent: boolean | null;
  isFulfillmentOpen: boolean;
  toggleSidebar: () => void;
  setAnalyticsConsent: (consent: boolean) => void;
  openFulfillment: () => void;
  closeFulfillment: () => void;
}

export const uiStore = create<UiState>((set) => ({
  sidebarCollapsed: false,
  analyticsConsent: null,
  isFulfillmentOpen: false,
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setAnalyticsConsent: (consent) => set({ analyticsConsent: consent }),
  openFulfillment: () => set({ isFulfillmentOpen: true }),
  closeFulfillment: () => set({ isFulfillmentOpen: false })
}));
