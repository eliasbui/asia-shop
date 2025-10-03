import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AccountState, AccountActions, Address, Order, WishlistItem, AccountStats, AccountPreferences, AddressFormData, ProfileUpdateData } from '@/lib/types/account';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const mockAddresses: Address[] = [
  {
    id: '1',
    userId: '1',
    type: 'shipping',
    isDefault: true,
    firstName: 'John',
    lastName: 'Doe',
    address: '123 Main Street',
    apartment: 'Apt 4B',
    city: 'New York',
    state: 'NY',
    postalCode: '10001',
    country: 'United States',
    phone: '+1 234 567 8900',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-2024-001',
    userId: '1',
    status: 'delivered',
    paymentStatus: 'paid',
    paymentMethod: 'Credit Card',
    shippingAddress: mockAddresses[0],
    billingAddress: mockAddresses[0],
    items: [
      {
        id: '1',
        productId: '1',
        name: 'Wireless Headphones',
        sku: 'WH-001',
        image: '/products/headphones.jpg',
        quantity: 1,
        price: 99.99,
        total: 99.99,
      },
    ],
    subtotal: 99.99,
    shipping: 5.99,
    tax: 8.40,
    discount: 0,
    total: 114.38,
    currency: 'USD',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z',
    shippedAt: '2024-01-16T00:00:00Z',
    deliveredAt: '2024-01-20T00:00:00Z',
    trackingNumber: 'TRACK123456789',
  },
  {
    id: '2',
    orderNumber: 'ORD-2024-002',
    userId: '1',
    status: 'processing',
    paymentStatus: 'paid',
    paymentMethod: 'PayPal',
    shippingAddress: mockAddresses[0],
    billingAddress: mockAddresses[0],
    items: [
      {
        id: '2',
        productId: '2',
        name: 'Smart Watch',
        sku: 'SW-001',
        image: '/products/watch.jpg',
        quantity: 1,
        price: 299.99,
        total: 299.99,
      },
    ],
    subtotal: 299.99,
    shipping: 0,
    tax: 24.00,
    discount: 30.00,
    total: 293.99,
    currency: 'USD',
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-02-01T00:00:00Z',
  },
];

const mockWishlist: WishlistItem[] = [
  {
    id: '1',
    userId: '1',
    productId: '3',
    product: {
      id: '3',
      name: 'Laptop Stand',
      slug: 'laptop-stand',
      price: 49.99,
      originalPrice: 69.99,
      image: '/products/laptop-stand.jpg',
      inStock: true,
      rating: 4.5,
      reviewCount: 234,
    },
    addedAt: '2024-01-10T00:00:00Z',
  },
];

const mockStats: AccountStats = {
  totalOrders: 12,
  totalSpent: 1458.67,
  averageOrderValue: 121.56,
  wishlistCount: 3,
  savedAddresses: 2,
  memberSince: '2023-06-15T00:00:00Z',
  lastOrderDate: '2024-02-01T00:00:00Z',
  loyaltyPoints: 1250,
  tier: 'silver',
};

interface AccountStore extends AccountState, AccountActions {}

export const useAccountStore = create<AccountStore>()(
  persist(
    (set, get) => ({
      // Initial state
      addresses: [],
      orders: [],
      wishlist: [],
      stats: null,
      preferences: {
        emailNotifications: true,
        smsNotifications: false,
        newsletter: true,
        marketingEmails: false,
        orderUpdates: true,
        promotions: true,
        newProducts: false,
        language: 'en',
        currency: 'USD',
      },
      isLoading: false,
      error: null,

      // Address actions
      fetchAddresses: async () => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call with mock data
          await new Promise(resolve => setTimeout(resolve, 500));
          set({ addresses: mockAddresses, isLoading: false });
        } catch (error) {
          set({ error: 'Failed to fetch addresses', isLoading: false });
        }
      },

      addAddress: async (data: AddressFormData) => {
        set({ isLoading: true, error: null });
        try {
          const newAddress: Address = {
            id: Date.now().toString(),
            userId: '1',
            ...data,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          const addresses = get().addresses;
          if (data.isDefault) {
            const updatedAddresses = addresses.map(addr => ({ ...addr, isDefault: false }));
            set({ addresses: [...updatedAddresses, newAddress], isLoading: false });
          } else {
            set({ addresses: [...addresses, newAddress], isLoading: false });
          }
        } catch (error) {
          set({ error: 'Failed to add address', isLoading: false });
        }
      },

      updateAddress: async (id: string, data: Partial<AddressFormData>) => {
        set({ isLoading: true, error: null });
        try {
          const addresses = get().addresses;
          const updatedAddresses = addresses.map(addr => {
            if (addr.id === id) {
              const updatedAddr = { ...addr, ...data, updatedAt: new Date().toISOString() };
              return updatedAddr;
            }
            if (data.isDefault) {
              return { ...addr, isDefault: false };
            }
            return addr;
          });
          set({ addresses: updatedAddresses, isLoading: false });
        } catch (error) {
          set({ error: 'Failed to update address', isLoading: false });
        }
      },

      deleteAddress: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          const addresses = get().addresses;
          const filteredAddresses = addresses.filter(addr => addr.id !== id);
          set({ addresses: filteredAddresses, isLoading: false });
        } catch (error) {
          set({ error: 'Failed to delete address', isLoading: false });
        }
      },

      setDefaultAddress: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          const addresses = get().addresses;
          const updatedAddresses = addresses.map(addr => ({
            ...addr,
            isDefault: addr.id === id,
          }));
          set({ addresses: updatedAddresses, isLoading: false });
        } catch (error) {
          set({ error: 'Failed to set default address', isLoading: false });
        }
      },

      // Order actions
      fetchOrders: async () => {
        set({ isLoading: true, error: null });
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          set({ orders: mockOrders, isLoading: false });
        } catch (error) {
          set({ error: 'Failed to fetch orders', isLoading: false });
        }
      },

      fetchOrderDetails: async (orderId: string) => {
        const order = mockOrders.find(o => o.id === orderId);
        if (!order) {
          throw new Error('Order not found');
        }
        return order;
      },

      // Wishlist actions
      fetchWishlist: async () => {
        set({ isLoading: true, error: null });
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          set({ wishlist: mockWishlist, isLoading: false });
        } catch (error) {
          set({ error: 'Failed to fetch wishlist', isLoading: false });
        }
      },

      addToWishlist: async (productId: string, variantId?: string) => {
        set({ isLoading: true, error: null });
        try {
          const newItem: WishlistItem = {
            id: Date.now().toString(),
            userId: '1',
            productId,
            variantId,
            product: {
              id: productId,
              name: 'New Product',
              slug: 'new-product',
              price: 99.99,
              image: '/products/default.jpg',
              inStock: true,
            },
            addedAt: new Date().toISOString(),
          };

          const wishlist = get().wishlist;
          const exists = wishlist.some(item => item.productId === productId);

          if (!exists) {
            set({ wishlist: [...wishlist, newItem], isLoading: false });
          } else {
            set({ isLoading: false });
          }
        } catch (error) {
          set({ error: 'Failed to add to wishlist', isLoading: false });
        }
      },

      removeFromWishlist: async (itemId: string) => {
        set({ isLoading: true, error: null });
        try {
          const wishlist = get().wishlist;
          const filteredWishlist = wishlist.filter(item => item.id !== itemId);
          set({ wishlist: filteredWishlist, isLoading: false });
        } catch (error) {
          set({ error: 'Failed to remove from wishlist', isLoading: false });
        }
      },

      moveToCart: async (itemId: string) => {
        set({ isLoading: true, error: null });
        try {
          const wishlist = get().wishlist;
          const filteredWishlist = wishlist.filter(item => item.id !== itemId);
          set({ wishlist: filteredWishlist, isLoading: false });
          // Here you would also add the item to the cart
        } catch (error) {
          set({ error: 'Failed to move to cart', isLoading: false });
        }
      },

      // Profile actions
      updateProfile: async (data: ProfileUpdateData) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          set({ isLoading: false });
        } catch (error) {
          set({ error: 'Failed to update profile', isLoading: false });
        }
      },

      updatePreferences: async (preferences: Partial<AccountPreferences>) => {
        set({ isLoading: true, error: null });
        try {
          const currentPreferences = get().preferences;
          const updatedPreferences = { ...currentPreferences, ...preferences };
          set({ preferences: updatedPreferences, isLoading: false });
        } catch (error) {
          set({ error: 'Failed to update preferences', isLoading: false });
        }
      },

      // Stats actions
      fetchStats: async () => {
        set({ isLoading: true, error: null });
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          set({ stats: mockStats, isLoading: false });
        } catch (error) {
          set({ error: 'Failed to fetch stats', isLoading: false });
        }
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'account-storage',
      partialize: (state) => ({
        preferences: state.preferences,
      }),
    }
  )
);