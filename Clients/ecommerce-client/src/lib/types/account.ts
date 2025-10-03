export interface Address {
  id: string;
  userId: string;
  type: 'shipping' | 'billing';
  isDefault: boolean;
  firstName: string;
  lastName: string;
  company?: string;
  address: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: string;
  shippingAddress: Address;
  billingAddress: Address;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
  shippedAt?: string;
  deliveredAt?: string;
  trackingNumber?: string;
  notes?: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  variantId?: string;
  name: string;
  sku: string;
  image?: string;
  quantity: number;
  price: number;
  total: number;
}

export interface WishlistItem {
  id: string;
  userId: string;
  productId: string;
  variantId?: string;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    originalPrice?: number;
    image: string;
    inStock: boolean;
    rating?: number;
    reviewCount?: number;
  };
  addedAt: string;
}

export interface AccountStats {
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  wishlistCount: number;
  savedAddresses: number;
  memberSince: string;
  lastOrderDate?: string;
  loyaltyPoints?: number;
  tier?: 'bronze' | 'silver' | 'gold' | 'platinum';
}

export interface ProfileUpdateData {
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export interface AddressFormData {
  type: 'shipping' | 'billing';
  isDefault: boolean;
  firstName: string;
  lastName: string;
  company?: string;
  address: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
}

export interface AccountPreferences {
  emailNotifications: boolean;
  smsNotifications: boolean;
  newsletter: boolean;
  marketingEmails: boolean;
  orderUpdates: boolean;
  promotions: boolean;
  newProducts: boolean;
  language: string;
  currency: string;
}

export interface AccountState {
  addresses: Address[];
  orders: Order[];
  wishlist: WishlistItem[];
  stats: AccountStats | null;
  preferences: AccountPreferences;
  isLoading: boolean;
  error: string | null;
}

export interface AccountActions {
  fetchAddresses: () => Promise<void>;
  addAddress: (data: AddressFormData) => Promise<void>;
  updateAddress: (id: string, data: Partial<AddressFormData>) => Promise<void>;
  deleteAddress: (id: string) => Promise<void>;
  setDefaultAddress: (id: string) => Promise<void>;

  fetchOrders: () => Promise<void>;
  fetchOrderDetails: (orderId: string) => Promise<Order>;

  fetchWishlist: () => Promise<void>;
  addToWishlist: (productId: string, variantId?: string) => Promise<void>;
  removeFromWishlist: (itemId: string) => Promise<void>;
  moveToCart: (itemId: string) => Promise<void>;

  updateProfile: (data: ProfileUpdateData) => Promise<void>;
  updatePreferences: (preferences: Partial<AccountPreferences>) => Promise<void>;

  fetchStats: () => Promise<void>;
  clearError: () => void;
}