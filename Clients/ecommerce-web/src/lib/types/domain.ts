/**
 * Core domain models for the e-commerce application
 * Based on requirements section 11
 */

export type Money = {
  currency: string;
  amount: number;
};

export type Price = {
  list: Money;
  sale?: Money;
  percentOff?: number;
  flashSale?: {
    endsAt: string;
    timezone: "UTC+7";
  };
};

export type Media = {
  url: string;
  alt: string;
  type?: "image" | "video";
};

export type StockStatus = "in-stock" | "low-stock" | "out-of-stock";

export type Variant = {
  id: string;
  sku: string;
  attributes: Record<string, string>;
  price?: Price;
  stock: {
    status: StockStatus;
    qty?: number;
  };
  media?: Media[];
};

export type ProductBadge = "flashSale" | "new" | "bestseller";

export type Product = {
  id: string;
  slug: string;
  title: string;
  brand: string;
  category: string;
  attributes: Record<string, string | string[]>;
  media: Media[];
  rating: number;
  reviewCount: number;
  price: Price;
  badges?: ProductBadge[];
  specs?: Record<string, string>;
  shortDesc?: string;
  longDesc?: string;
  variants?: Variant[];
};

export type Paginated<T> = {
  page: number;
  size: number;
  total: number;
  items: T[];
};

export type SuggestPayload = {
  suggestedQueries: string[];
  topCategories: { slug: string; name: string }[];
  topProducts: Pick<Product, "id" | "slug" | "title" | "media" | "price">[];
};

// Additional types for cart and checkout

export type CartItem = {
  productId: string;
  variantId: string;
  quantity: number;
  addedAt: string;
};

export type Cart = {
  items: CartItem[];
  subtotal: Money;
  discount?: Money;
  shipping?: Money;
  total: Money;
  couponCode?: string;
};

export type Address = {
  id: string;
  type: "billing" | "shipping";
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
};

export type ShippingOption = {
  id: string;
  name: string;
  etaDays: number;
  price: Money;
  tag?: "fastest" | "cheapest" | "recommended";
};

export type PaymentMethod = {
  id: string;
  type: "credit-card" | "debit-card" | "bank-transfer" | "e-wallet" | "cod";
  name: string;
  icon?: string;
};

export type Coupon = {
  code: string;
  valid: boolean;
  discount?: Money;
  percentOff?: number;
  reason?: string;
};

// User and authentication types

export type User = {
  id: string;
  email: string;
  phone?: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  twoFactorEnabled: boolean;
};

export type AuthTokens = {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
};

export type AuthResponse = {
  user: User;
  tokens: AuthTokens;
};

// Order types (for account section)

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export type Order = {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  items: CartItem[];
  subtotal: Money;
  discount?: Money;
  shipping: Money;
  total: Money;
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: PaymentMethod;
  createdAt: string;
  updatedAt: string;
};

// Facet and filter types

export type FacetValue = {
  value: string;
  label: string;
  count: number;
};

export type Facet = {
  key: string;
  label: string;
  type: "checkbox" | "range" | "radio";
  values?: FacetValue[];
  min?: number;
  max?: number;
};

export type FilterParams = {
  page?: number;
  size?: number;
  sort?: string;
  category?: string;
  brand?: string[];
  priceMin?: number;
  priceMax?: number;
  rating?: number;
  inStock?: boolean;
  flashSale?: boolean;
  q?: string;
};

// API error type

export type ApiError = {
  code: string;
  message: string;
  details?: Record<string, unknown>;
};
