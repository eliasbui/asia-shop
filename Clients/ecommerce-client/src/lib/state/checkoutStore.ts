import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from './cartStore';

export interface AddressData {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  postalCode: string;
}

export interface BillingAddressData {
  sameAsShipping: boolean;
  fullName?: string;
  phone?: string;
  address?: string;
  city?: string;
  district?: string;
  postalCode?: string;
}

export interface ShippingData {
  method: string;
  cost: number;
  estimatedDays: number;
}

export interface PaymentData {
  method: string;
  cardNumber?: string;
  cardHolder?: string;
  expiryDate?: string;
  cvv?: string;
}

export interface CheckoutData {
  shippingAddress: AddressData;
  billingAddress: BillingAddressData;
  shipping: ShippingData;
  payment: PaymentData;
}

interface CheckoutStore {
  // Current step and data
  currentStep: number;
  data: CheckoutData;

  // Navigation
  nextStep: () => void;
  previousStep: () => void;
  goToStep: (step: number) => void;

  // Data updates
  updateData: (newData: Partial<CheckoutData>) => void;
  updateShippingAddress: (address: AddressData) => void;
  updateBillingAddress: (billing: BillingAddressData) => void;
  updateShipping: (shipping: ShippingData) => void;
  updatePayment: (payment: PaymentData) => void;

  // Validation
  validateCurrentStep: () => boolean;
  isStepValid: (step: number) => boolean;

  // Reset
  resetCheckout: () => void;

  // Navigation helpers
  getStepPath: (step: number) => string;
  canGoNext: () => boolean;
  canGoPrevious: () => boolean;
}

// Default empty data structure
const defaultCheckoutData: CheckoutData = {
  shippingAddress: {
    fullName: '',
    phone: '',
    address: '',
    city: '',
    district: '',
    postalCode: ''
  },
  billingAddress: {
    sameAsShipping: true
  },
  shipping: {
    method: 'standard',
    cost: 30000,
    estimatedDays: 3
  },
  payment: {
    method: 'cod'
  }
};

export const useCheckoutStore = create<CheckoutStore>()(
  persist(
    (set, get) => ({
      currentStep: 0,
      data: defaultCheckoutData,

      // Navigation
      nextStep: () => {
        const { currentStep, validateCurrentStep } = get();
        if (validateCurrentStep() && currentStep < 3) {
          set({ currentStep: currentStep + 1 });
        }
      },

      previousStep: () => {
        const { currentStep } = get();
        if (currentStep > 0) {
          set({ currentStep: currentStep - 1 });
        }
      },

      goToStep: (step) => {
        if (step >= 0 && step <= 3) {
          set({ currentStep: step });
        }
      },

      // Data updates
      updateData: (newData) => {
        set((state) => ({
          data: { ...state.data, ...newData }
        }));
      },

      updateShippingAddress: (address) => {
        set((state) => ({
          data: {
            ...state.data,
            shippingAddress: address
          }
        }));
      },

      updateBillingAddress: (billing) => {
        set((state) => ({
          data: {
            ...state.data,
            billingAddress: billing
          }
        }));
      },

      updateShipping: (shipping) => {
        set((state) => ({
          data: {
            ...state.data,
            shipping: shipping
          }
        }));
      },

      updatePayment: (payment) => {
        set((state) => ({
          data: {
            ...state.data,
            payment: payment
          }
        }));
      },

      // Validation
      validateCurrentStep: () => {
        return get().isStepValid(get().currentStep);
      },

      isStepValid: (step) => {
        const { data } = get();

        switch (step) {
          case 0: // Address step
            const { shippingAddress } = data;
            return !!(
              shippingAddress.fullName.trim() &&
              shippingAddress.phone.trim() &&
              shippingAddress.address.trim() &&
              shippingAddress.city.trim() &&
              shippingAddress.district.trim()
            );

          case 1: // Shipping step
            return !!data.shipping.method;

          case 2: // Payment step
            const { payment } = data;
            if (!payment.method) return false;

            // Additional validation for card payments
            if (payment.method === 'card') {
              return !!(
                payment.cardNumber?.trim() &&
                payment.cardHolder?.trim() &&
                payment.expiryDate?.trim() &&
                payment.cvv?.trim()
              );
            }
            return true;

          case 3: // Review step - always valid
            return true;

          default:
            return false;
        }
      },

      // Reset
      resetCheckout: () => {
        set({
          currentStep: 0,
          data: defaultCheckoutData
        });
      },

      // Navigation helpers
      getStepPath: (step) => {
        const paths = ['/checkout/address', '/checkout/shipping', '/checkout/payment', '/checkout/review'];
        return paths[step] || '/checkout/address';
      },

      canGoNext: () => {
        const { currentStep, validateCurrentStep } = get();
        return validateCurrentStep() && currentStep < 3;
      },

      canGoPrevious: () => {
        return get().currentStep > 0;
      }
    }),
    {
      name: 'checkout-storage',
      partialize: (state) => ({
        currentStep: state.currentStep,
        data: state.data
      })
    }
  )
);

// Hook for checkout navigation
export const useCheckoutNavigation = () => {
  const {
    currentStep,
    nextStep,
    previousStep,
    goToStep,
    canGoNext,
    canGoPrevious,
    getStepPath
  } = useCheckoutStore();

  return {
    currentStep,
    nextStep,
    previousStep,
    goToStep,
    canGoNext,
    canGoPrevious,
    getStepPath,
    isAddressStep: currentStep === 0,
    isShippingStep: currentStep === 1,
    isPaymentStep: currentStep === 2,
    isReviewStep: currentStep === 3
  };
};

// Hook for checkout data
export const useCheckoutData = () => {
  const {
    data,
    updateData,
    updateShippingAddress,
    updateBillingAddress,
    updateShipping,
    updatePayment,
    validateCurrentStep,
    isStepValid
  } = useCheckoutStore();

  return {
    data,
    updateData,
    updateShippingAddress,
    updateBillingAddress,
    updateShipping,
    updatePayment,
    validateCurrentStep,
    isStepValid
  };
};