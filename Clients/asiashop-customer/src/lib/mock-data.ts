import { ProductWithDetails, Category, Brand } from '@/types'

// Mock Categories
export const mockCategories: Category[] = [
  { id: '1', name: 'Electronics', slug: 'electronics', description: 'Electronic devices and accessories', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661', isActive: true, sortOrder: 1 },
  { id: '2', name: 'Clothing', slug: 'clothing', description: 'Fashion and apparel', image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f', isActive: true, sortOrder: 2 },
  { id: '3', name: 'Home & Garden', slug: 'home-garden', description: 'Home improvement and garden supplies', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136', isActive: true, sortOrder: 3 },
  { id: '4', name: 'Sports & Outdoors', slug: 'sports-outdoors', description: 'Sports equipment and outdoor gear', image: 'https://images.unsplash.com/photo-1528543606781-2f6e6857f318', isActive: true, sortOrder: 4 },
  { id: '5', name: 'Books & Media', slug: 'books-media', description: 'Books, movies, and digital media', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d', isActive: true, sortOrder: 5 },
  { id: '6', name: 'Beauty & Health', slug: 'beauty-health', description: 'Beauty products and health supplies', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348', isActive: true, sortOrder: 6 },
]

// Mock Brands
export const mockBrands: Brand[] = [
  { id: '1', name: 'TechPro', slug: 'techpro', logo: 'https://via.placeholder.com/150', website: 'https://techpro.com', isActive: true },
  { id: '2', name: 'FashionHub', slug: 'fashionhub', logo: 'https://via.placeholder.com/150', website: 'https://fashionhub.com', isActive: true },
  { id: '3', name: 'HomeStyle', slug: 'homestyle', logo: 'https://via.placeholder.com/150', website: 'https://homestyle.com', isActive: true },
  { id: '4', name: 'SportGear', slug: 'sportgear', logo: 'https://via.placeholder.com/150', website: 'https://sportgear.com', isActive: true },
  { id: '5', name: 'BookWorld', slug: 'bookworld', logo: 'https://via.placeholder.com/150', website: 'https://bookworld.com', isActive: true },
  { id: '6', name: 'BeautyPlus', slug: 'beautyplus', logo: 'https://via.placeholder.com/150', website: 'https://beautyplus.com', isActive: true },
]

// Mock Products
export const mockProducts: ProductWithDetails[] = [
  // Electronics
  {
    id: '1',
    name: 'Wireless Bluetooth Headphones',
    slug: 'wireless-bluetooth-headphones',
    description: 'Premium noise-cancelling wireless headphones with 30-hour battery life',
    shortDescription: 'Premium wireless headphones',
    sku: 'WBH-001',
    price: 299.99,
    comparePrice: 399.99,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944',
    ],
    inventory: 50,
    isActive: true,
    isFeatured: true,
    rating: 4.5,
    reviewCount: 128,
    category: mockCategories[0],
    brand: mockBrands[0],
    variants: [
      { id: 'v1', productId: '1', name: 'Black', sku: 'WBH-001-BLK', price: 299.99, inventory: 20, options: { color: 'Black' }, isActive: true },
      { id: 'v2', productId: '1', name: 'White', sku: 'WBH-001-WHT', price: 299.99, inventory: 15, options: { color: 'White' }, isActive: true },
      { id: 'v3', productId: '1', name: 'Blue', sku: 'WBH-001-BLU', price: 299.99, inventory: 15, options: { color: 'Blue' }, isActive: true },
    ],
    reviews: [],
    tags: ['wireless', 'bluetooth', 'noise-cancelling', 'headphones'],
    weight: 0.5,
    dimensions: { length: 20, width: 18, height: 8 },
    lowStockThreshold: 10,
    trackInventory: true,
    allowBackorder: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    name: 'Smart Watch Pro 2024',
    slug: 'smart-watch-pro-2024',
    description: 'Advanced fitness tracking smartwatch with GPS and heart rate monitoring',
    shortDescription: 'Advanced fitness smartwatch',
    sku: 'SWP-002',
    price: 449.99,
    comparePrice: 549.99,
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12',
    ],
    inventory: 30,
    isActive: true,
    isFeatured: true,
    rating: 4.8,
    reviewCount: 89,
    category: mockCategories[0],
    brand: mockBrands[0],
    variants: [
      { id: 'v4', productId: '2', name: '42mm Black', sku: 'SWP-002-42B', price: 449.99, inventory: 10, options: { size: '42mm', color: 'Black' }, isActive: true },
      { id: 'v5', productId: '2', name: '42mm Silver', sku: 'SWP-002-42S', price: 449.99, inventory: 10, options: { size: '42mm', color: 'Silver' }, isActive: true },
      { id: 'v6', productId: '2', name: '46mm Black', sku: 'SWP-002-46B', price: 499.99, inventory: 10, options: { size: '46mm', color: 'Black' }, isActive: true },
    ],
    reviews: [],
    tags: ['smartwatch', 'fitness', 'GPS', 'heart-rate'],
    weight: 0.2,
    dimensions: { length: 10, width: 10, height: 5 },
    lowStockThreshold: 5,
    trackInventory: true,
    allowBackorder: false,
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02'),
  },
  {
    id: '3',
    name: '4K Webcam with Ring Light',
    slug: '4k-webcam-ring-light',
    description: 'Professional 4K webcam with built-in ring light for video calls and streaming',
    shortDescription: 'Professional 4K webcam',
    sku: 'WC-003',
    price: 129.99,
    comparePrice: 179.99,
    images: [
      'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd',
      'https://images.unsplash.com/photo-1587826080692-f439cd0b70da',
    ],
    inventory: 75,
    isActive: true,
    isFeatured: false,
    rating: 4.3,
    reviewCount: 45,
    category: mockCategories[0],
    brand: mockBrands[0],
    variants: [],
    reviews: [],
    tags: ['webcam', '4K', 'streaming', 'video-call'],
    weight: 0.3,
    dimensions: { length: 15, width: 10, height: 10 },
    lowStockThreshold: 15,
    trackInventory: true,
    allowBackorder: true,
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-03'),
  },

  // Clothing
  {
    id: '4',
    name: 'Premium Cotton T-Shirt',
    slug: 'premium-cotton-tshirt',
    description: '100% organic cotton t-shirt with modern fit and superior comfort',
    shortDescription: 'Comfortable cotton t-shirt',
    sku: 'TS-004',
    price: 29.99,
    comparePrice: 39.99,
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a',
    ],
    inventory: 200,
    isActive: true,
    isFeatured: false,
    rating: 4.6,
    reviewCount: 234,
    category: mockCategories[1],
    brand: mockBrands[1],
    variants: [
      { id: 'v7', productId: '4', name: 'Small White', sku: 'TS-004-SW', price: 29.99, inventory: 40, options: { size: 'S', color: 'White' }, isActive: true },
      { id: 'v8', productId: '4', name: 'Medium White', sku: 'TS-004-MW', price: 29.99, inventory: 40, options: { size: 'M', color: 'White' }, isActive: true },
      { id: 'v9', productId: '4', name: 'Large White', sku: 'TS-004-LW', price: 29.99, inventory: 40, options: { size: 'L', color: 'White' }, isActive: true },
      { id: 'v10', productId: '4', name: 'Small Black', sku: 'TS-004-SB', price: 29.99, inventory: 40, options: { size: 'S', color: 'Black' }, isActive: true },
      { id: 'v11', productId: '4', name: 'Medium Black', sku: 'TS-004-MB', price: 29.99, inventory: 40, options: { size: 'M', color: 'Black' }, isActive: true },
    ],
    reviews: [],
    tags: ['cotton', 't-shirt', 'organic', 'casual'],
    weight: 0.2,
    dimensions: { length: 30, width: 25, height: 2 },
    lowStockThreshold: 20,
    trackInventory: true,
    allowBackorder: true,
    createdAt: new Date('2024-01-04'),
    updatedAt: new Date('2024-01-04'),
  },
  {
    id: '5',
    name: 'Denim Jeans Classic Fit',
    slug: 'denim-jeans-classic',
    description: 'Classic fit denim jeans with stretch fabric for all-day comfort',
    shortDescription: 'Classic denim jeans',
    sku: 'DJ-005',
    price: 79.99,
    comparePrice: 99.99,
    images: [
      'https://images.unsplash.com/photo-1542272604-787c3835535d',
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246',
    ],
    inventory: 150,
    isActive: true,
    isFeatured: true,
    rating: 4.4,
    reviewCount: 167,
    category: mockCategories[1],
    brand: mockBrands[1],
    variants: [
      { id: 'v12', productId: '5', name: '30x30', sku: 'DJ-005-3030', price: 79.99, inventory: 30, options: { waist: '30', length: '30' }, isActive: true },
      { id: 'v13', productId: '5', name: '32x32', sku: 'DJ-005-3232', price: 79.99, inventory: 30, options: { waist: '32', length: '32' }, isActive: true },
      { id: 'v14', productId: '5', name: '34x32', sku: 'DJ-005-3432', price: 79.99, inventory: 30, options: { waist: '34', length: '32' }, isActive: true },
    ],
    reviews: [],
    tags: ['denim', 'jeans', 'casual', 'stretch'],
    weight: 0.5,
    dimensions: { length: 40, width: 30, height: 3 },
    lowStockThreshold: 15,
    trackInventory: true,
    allowBackorder: false,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05'),
  },

  // Home & Garden
  {
    id: '6',
    name: 'Smart LED Desk Lamp',
    slug: 'smart-led-desk-lamp',
    description: 'Adjustable LED desk lamp with touch control and wireless charging base',
    shortDescription: 'Smart desk lamp with charging',
    sku: 'DL-006',
    price: 89.99,
    comparePrice: 119.99,
    images: [
      'https://images.unsplash.com/photo-1565636192335-a9e5d4f0c49e',
      'https://images.unsplash.com/photo-1540932239986-30128078f3c5',
    ],
    inventory: 60,
    isActive: true,
    isFeatured: false,
    rating: 4.7,
    reviewCount: 92,
    category: mockCategories[2],
    brand: mockBrands[2],
    variants: [
      { id: 'v15', productId: '6', name: 'Black', sku: 'DL-006-BLK', price: 89.99, inventory: 30, options: { color: 'Black' }, isActive: true },
      { id: 'v16', productId: '6', name: 'White', sku: 'DL-006-WHT', price: 89.99, inventory: 30, options: { color: 'White' }, isActive: true },
    ],
    reviews: [],
    tags: ['lamp', 'LED', 'smart', 'wireless-charging'],
    weight: 1.2,
    dimensions: { length: 25, width: 20, height: 45 },
    lowStockThreshold: 10,
    trackInventory: true,
    allowBackorder: false,
    createdAt: new Date('2024-01-06'),
    updatedAt: new Date('2024-01-06'),
  },

  // Sports & Outdoors
  {
    id: '7',
    name: 'Yoga Mat Premium',
    slug: 'yoga-mat-premium',
    description: 'Non-slip premium yoga mat with alignment lines and carrying strap',
    shortDescription: 'Premium non-slip yoga mat',
    sku: 'YM-007',
    price: 49.99,
    comparePrice: 69.99,
    images: [
      'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f',
      'https://images.unsplash.com/photo-1592432678016-e910b452f9a5',
    ],
    inventory: 100,
    isActive: true,
    isFeatured: false,
    rating: 4.8,
    reviewCount: 312,
    category: mockCategories[3],
    brand: mockBrands[3],
    variants: [
      { id: 'v17', productId: '7', name: 'Purple', sku: 'YM-007-PUR', price: 49.99, inventory: 25, options: { color: 'Purple' }, isActive: true },
      { id: 'v18', productId: '7', name: 'Blue', sku: 'YM-007-BLU', price: 49.99, inventory: 25, options: { color: 'Blue' }, isActive: true },
      { id: 'v19', productId: '7', name: 'Green', sku: 'YM-007-GRN', price: 49.99, inventory: 25, options: { color: 'Green' }, isActive: true },
      { id: 'v20', productId: '7', name: 'Black', sku: 'YM-007-BLK', price: 49.99, inventory: 25, options: { color: 'Black' }, isActive: true },
    ],
    reviews: [],
    tags: ['yoga', 'mat', 'fitness', 'non-slip'],
    weight: 1.5,
    dimensions: { length: 180, width: 60, height: 0.6 },
    lowStockThreshold: 10,
    trackInventory: true,
    allowBackorder: true,
    createdAt: new Date('2024-01-07'),
    updatedAt: new Date('2024-01-07'),
  },

  // Books & Media
  {
    id: '8',
    name: 'The Art of Programming',
    slug: 'art-of-programming',
    description: 'Comprehensive guide to modern programming practices and design patterns',
    shortDescription: 'Programming best practices guide',
    sku: 'BK-008',
    price: 39.99,
    comparePrice: 49.99,
    images: [
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f',
      'https://images.unsplash.com/photo-1512820790803-83ca734da794',
    ],
    inventory: 200,
    isActive: true,
    isFeatured: true,
    rating: 4.9,
    reviewCount: 456,
    category: mockCategories[4],
    brand: mockBrands[4],
    variants: [
      { id: 'v21', productId: '8', name: 'Paperback', sku: 'BK-008-PB', price: 39.99, inventory: 150, options: { format: 'Paperback' }, isActive: true },
      { id: 'v22', productId: '8', name: 'Hardcover', sku: 'BK-008-HC', price: 59.99, inventory: 50, options: { format: 'Hardcover' }, isActive: true },
    ],
    reviews: [],
    tags: ['book', 'programming', 'technology', 'education'],
    weight: 0.8,
    dimensions: { length: 23, width: 15, height: 3 },
    lowStockThreshold: 20,
    trackInventory: true,
    allowBackorder: true,
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-08'),
  },

  // Beauty & Health
  {
    id: '9',
    name: 'Vitamin C Serum',
    slug: 'vitamin-c-serum',
    description: 'Anti-aging vitamin C serum with hyaluronic acid for radiant skin',
    shortDescription: 'Anti-aging vitamin C serum',
    sku: 'BS-009',
    price: 24.99,
    comparePrice: 34.99,
    images: [
      'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b',
      'https://images.unsplash.com/photo-1556228720-195a672e8a03',
    ],
    inventory: 150,
    isActive: true,
    isFeatured: false,
    rating: 4.6,
    reviewCount: 789,
    category: mockCategories[5],
    brand: mockBrands[5],
    variants: [
      { id: 'v23', productId: '9', name: '30ml', sku: 'BS-009-30', price: 24.99, inventory: 100, options: { size: '30ml' }, isActive: true },
      { id: 'v24', productId: '9', name: '50ml', sku: 'BS-009-50', price: 39.99, inventory: 50, options: { size: '50ml' }, isActive: true },
    ],
    reviews: [],
    tags: ['skincare', 'serum', 'vitamin-c', 'anti-aging'],
    weight: 0.1,
    dimensions: { length: 10, width: 5, height: 5 },
    lowStockThreshold: 20,
    trackInventory: true,
    allowBackorder: false,
    createdAt: new Date('2024-01-09'),
    updatedAt: new Date('2024-01-09'),
  },

  // More Electronics
  {
    id: '10',
    name: 'Portable Bluetooth Speaker',
    slug: 'portable-bluetooth-speaker',
    description: 'Waterproof portable speaker with 360° sound and 20-hour battery',
    shortDescription: 'Waterproof portable speaker',
    sku: 'SP-010',
    price: 79.99,
    comparePrice: 99.99,
    images: [
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1',
      'https://images.unsplash.com/photo-1545454675-3531b543be5d',
    ],
    inventory: 80,
    isActive: true,
    isFeatured: true,
    rating: 4.4,
    reviewCount: 203,
    category: mockCategories[0],
    brand: mockBrands[0],
    variants: [
      { id: 'v25', productId: '10', name: 'Black', sku: 'SP-010-BLK', price: 79.99, inventory: 40, options: { color: 'Black' }, isActive: true },
      { id: 'v26', productId: '10', name: 'Blue', sku: 'SP-010-BLU', price: 79.99, inventory: 40, options: { color: 'Blue' }, isActive: true },
    ],
    reviews: [],
    tags: ['speaker', 'bluetooth', 'waterproof', 'portable'],
    weight: 0.6,
    dimensions: { length: 15, width: 15, height: 8 },
    lowStockThreshold: 10,
    trackInventory: true,
    allowBackorder: false,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
  },
]

// Helper functions for mock data
export function getProductsByCategory(categoryId: string): ProductWithDetails[] {
  return mockProducts.filter(p => p.category.id === categoryId)
}

export function getProductsByBrand(brandId: string): ProductWithDetails[] {
  return mockProducts.filter(p => p.brand?.id === brandId)
}

export function searchProducts(query: string): ProductWithDetails[] {
  const lowerQuery = query.toLowerCase()
  return mockProducts.filter(p => 
    p.name.toLowerCase().includes(lowerQuery) ||
    p.description?.toLowerCase().includes(lowerQuery) ||
    p.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
  )
}

export function getProductBySlug(slug: string): ProductWithDetails | undefined {
  return mockProducts.find(p => p.slug === slug)
}

export function getProductById(id: string): ProductWithDetails | undefined {
  return mockProducts.find(p => p.id === id)
}

export function getFeaturedProducts(): ProductWithDetails[] {
  return mockProducts.filter(p => p.isFeatured)
}

export function getRelatedProducts(productId: string, limit: number = 4): ProductWithDetails[] {
  const product = getProductById(productId)
  if (!product) return []
  
  return mockProducts
    .filter(p => p.id !== productId && p.category.id === product.category.id)
    .slice(0, limit)
}