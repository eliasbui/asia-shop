import type { User, Product, Order, CartItem, Address, Review, WishlistItem, Notification, SupportTicket } from '@prisma/client'

// User types
export interface UserProfile extends User {
  addresses: Address[]
  preferences: UserPreference | null
}

export interface UserPreference {
  id: string
  userId: string
  emailNotifications: boolean
  smsNotifications: boolean
  pushNotifications: boolean
  marketingEmails: boolean
  orderUpdates: boolean
  productRecommendations: boolean
  priceAlerts: boolean
  newsletter: boolean
  currency: string
  timezone: string
}

// Category and Brand types
export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  parentId?: string | null
  isActive: boolean
  sortOrder: number
  createdAt?: Date
  updatedAt?: Date
}

export interface Brand {
  id: string
  name: string
  slug: string
  description?: string
  logo?: string
  website?: string
  isActive: boolean
  createdAt?: Date
  updatedAt?: Date
}

// Product types
export interface ProductWithDetails {
  id: string
  name: string
  slug: string
  description?: string
  shortDescription?: string
  sku: string
  price: number
  comparePrice?: number
  cost?: number
  weight?: number
  dimensions?: any
  images: string[]
  inventory: number
  lowStockThreshold: number
  trackInventory: boolean
  allowBackorder: boolean
  isActive: boolean
  isFeatured: boolean
  metaTitle?: string
  metaDescription?: string
  tags?: string[]
  rating: number
  reviewCount: number
  createdAt: Date
  updatedAt: Date
  category: Category
  brand?: Brand
  variants: ProductVariant[]
  reviews: ReviewWithUser[]
}

export interface ProductVariant {
  id: string
  productId: string
  name: string
  sku: string
  price: number
  inventory: number
  options: Record<string, string>
  image?: string
  isActive: boolean
}

export interface ProductFilter {
  category?: string
  brand?: string
  priceMin?: number
  priceMax?: number
  rating?: number
  inStock?: boolean
  tags?: string[]
}

export interface SearchFilters extends ProductFilter {
  query?: string
  sortBy?: 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | 'rating' | 'newest'
  page?: number
  limit?: number
}

// Cart types
export interface CartItemWithProduct extends CartItem {
  product: ProductWithDetails
  variant?: ProductVariant
}

export interface Cart {
  items: CartItemWithProduct[]
  subtotal: number
  taxAmount: number
  shippingAmount: number
  discountAmount: number
  totalAmount: number
  itemCount: number
}

// Order types
export interface OrderWithDetails extends Order {
  items: OrderItemWithProduct[]
  billingAddress: Address
  shippingAddress?: Address
  payments: Payment[]
  shipments: Shipment[]
}

export interface OrderItemWithProduct {
  id: string
  orderId: string
  productId: string
  variantId?: string
  quantity: number
  price: number
  totalAmount: number
  product: ProductWithDetails
  variant?: ProductVariant
}

export interface Payment {
  id: string
  orderId: string
  amount: number
  currency: string
  method: string
  status: string
  transactionId?: string
  createdAt: Date
}

export interface Shipment {
  id: string
  orderId: string
  trackingNumber?: string
  carrier?: string
  status: string
  shippedAt?: Date
  deliveredAt?: Date
}

// Review types
export interface ReviewWithUser extends Review {
  user: {
    id: string
    firstName: string
    lastName: string
    avatar?: string
  }
}

// Wishlist types
export interface WishlistItemWithProduct extends WishlistItem {
  product: ProductWithDetails
}

// Notification types
export interface NotificationWithActions extends Notification {
  actions?: NotificationAction[]
}

export interface NotificationAction {
  label: string
  action: string
  variant?: 'default' | 'destructive' | 'outline' | 'secondary'
}

// Support types
export interface SupportTicketWithMessages extends SupportTicket {
  messages: TicketMessage[]
  user?: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
}

export interface TicketMessage {
  id: string
  ticketId: string
  message: string
  isStaff: boolean
  createdAt: Date
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T = any> {
  data: T[]
  pagination: {
    page: number
    limit: number
    totalPages: number
    totalItems: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

// Form types
export interface FormError {
  field: string
  message: string
}

export interface FormState {
  isLoading: boolean
  errors: FormError[]
  success?: boolean
  message?: string
}

// Dashboard types
export interface DashboardStats {
  totalOrders: number
  totalSpent: number
  activeWishlistItems: number
  pendingReviews: number
  unreadNotifications: number
  recentOrders: OrderWithDetails[]
  recommendedProducts: ProductWithDetails[]
}

// Search types
export interface SearchSuggestion {
  type: 'product' | 'category' | 'brand'
  value: string
  label: string
  count?: number
}

export interface SearchResult {
  products: ProductWithDetails[]
  categories: Array<{ id: string; name: string; slug: string; count: number }>
  brands: Array<{ id: string; name: string; slug: string; count: number }>
  suggestions: SearchSuggestion[]
  totalProducts: number
}

// AI/Recommendation types
export interface RecommendationRequest {
  userId?: string
  productIds?: string[]
  categoryId?: string
  type: 'similar' | 'complementary' | 'trending' | 'personalized'
  limit?: number
}

export interface RecommendationResponse {
  products: ProductWithDetails[]
  reason: string
  confidence: number
}

// Chat/Support types
export interface ChatMessage {
  id: string
  content: string
  role: 'user' | 'assistant' | 'system'
  timestamp: Date
  attachments?: string[]
}

export interface ChatSession {
  id: string
  userId?: string
  messages: ChatMessage[]
  status: 'active' | 'resolved' | 'transferred'
  createdAt: Date
  updatedAt: Date
}

// Utility types
export type Theme = 'light' | 'dark' | 'system'

export interface AppConfig {
  name: string
  version: string
  supportedCurrencies: string[]
  supportedLanguages: string[]
  features: {
    socialLogin: boolean
    phoneVerification: boolean
    twoFactorAuth: boolean
    aiRecommendations: boolean
    livechat: boolean
    reviews: boolean
    wishlist: boolean
  }
}