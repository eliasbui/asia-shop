export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  reviewCount: number;
  sold: number;
  stock: number;
  images: string[];
  thumbnail: string;
  category: string;
  categoryId: string;
  brand: string;
  brandId: string;
  variants?: {
    sizes?: string[];
    colors?: { name: string; hex: string }[];
  };
  specifications: { label: string; value: string }[];
  tags: string[];
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  freeShipping: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  image: string;
  parentId?: string;
  subcategories?: Category[];
  productCount: number;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo: string;
  description: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
  variant?: string;
  helpful: number;
  verified: boolean;
  createdAt: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
  variant?: {
    size?: string;
    color?: string;
  };
  selected: boolean;
}

export interface Address {
  id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  ward: string;
  type: "home" | "office";
  isDefault: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  items: {
    productId: string;
    quantity: number;
    variant?: { size?: string; color?: string };
    price: number;
  }[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentMethod: string;
  shippingAddress: Address;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  createdAt: string;
}

export interface FilterOptions {
  categories: string[];
  brands: string[];
  priceRange: [number, number];
  rating: number;
  freeShipping: boolean;
}

export interface SortOption {
  value: string;
  label: string;
}

export type ViewMode = "grid" | "list";

export interface SearchSuggestion {
  id: string;
  type: "product" | "category" | "brand";
  name: string;
  image?: string;
  slug: string;
}