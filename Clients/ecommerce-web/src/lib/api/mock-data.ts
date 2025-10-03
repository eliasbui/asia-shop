/**
 * Mock data for development and testing
 */
import type { Product } from '@/lib/types';

export const mockProducts: Product[] = [
  {
    id: '1',
    slug: 'iphone-15-pro-max',
    title: 'iPhone 15 Pro Max 256GB',
    brand: 'Apple',
    category: 'smartphones',
    attributes: {
      color: ['Natural Titanium', 'Blue Titanium', 'White Titanium', 'Black Titanium'],
      storage: ['256GB', '512GB', '1TB'],
    },
    media: [
      {
        url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800',
        alt: 'iPhone 15 Pro Max',
        type: 'image',
      },
    ],
    rating: 4.8,
    reviewCount: 1250,
    price: {
      list: { currency: 'VND', amount: 34990000 },
      sale: { currency: 'VND', amount: 32990000 },
      percentOff: 6,
    },
    badges: ['new', 'bestseller'],
    shortDesc: 'The ultimate iPhone with titanium design and A17 Pro chip',
  },
  {
    id: '2',
    slug: 'samsung-galaxy-s24-ultra',
    title: 'Samsung Galaxy S24 Ultra 512GB',
    brand: 'Samsung',
    category: 'smartphones',
    attributes: {
      color: ['Titanium Gray', 'Titanium Black', 'Titanium Violet'],
      storage: ['256GB', '512GB', '1TB'],
    },
    media: [
      {
        url: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800',
        alt: 'Samsung Galaxy S24 Ultra',
        type: 'image',
      },
    ],
    rating: 4.7,
    reviewCount: 890,
    price: {
      list: { currency: 'VND', amount: 33990000 },
      sale: { currency: 'VND', amount: 29990000 },
      percentOff: 12,
      flashSale: {
        endsAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        timezone: 'UTC+7',
      },
    },
    badges: ['flashSale', 'bestseller'],
    shortDesc: 'Flagship Android phone with S Pen and AI features',
  },
  {
    id: '3',
    slug: 'macbook-pro-14-m3',
    title: 'MacBook Pro 14" M3 Pro 18GB 512GB',
    brand: 'Apple',
    category: 'laptops',
    attributes: {
      color: ['Space Black', 'Silver'],
      memory: ['18GB', '36GB'],
      storage: ['512GB', '1TB', '2TB'],
    },
    media: [
      {
        url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800',
        alt: 'MacBook Pro 14',
        type: 'image',
      },
    ],
    rating: 4.9,
    reviewCount: 567,
    price: {
      list: { currency: 'VND', amount: 54990000 },
    },
    badges: ['new'],
    shortDesc: 'Powerful laptop for professionals with M3 Pro chip',
  },
  {
    id: '4',
    slug: 'sony-wh-1000xm5',
    title: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
    brand: 'Sony',
    category: 'audio',
    attributes: {
      color: ['Black', 'Silver'],
    },
    media: [
      {
        url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800',
        alt: 'Sony WH-1000XM5',
        type: 'image',
      },
    ],
    rating: 4.8,
    reviewCount: 2340,
    price: {
      list: { currency: 'VND', amount: 9990000 },
      sale: { currency: 'VND', amount: 7990000 },
      percentOff: 20,
      flashSale: {
        endsAt: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
        timezone: 'UTC+7',
      },
    },
    badges: ['flashSale', 'bestseller'],
    shortDesc: 'Industry-leading noise cancellation headphones',
  },
  {
    id: '5',
    slug: 'airpods-pro-2',
    title: 'AirPods Pro (2nd generation) with MagSafe',
    brand: 'Apple',
    category: 'audio',
    attributes: {},
    media: [
      {
        url: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=800',
        alt: 'AirPods Pro 2',
        type: 'image',
      },
    ],
    rating: 4.7,
    reviewCount: 3450,
    price: {
      list: { currency: 'VND', amount: 6990000 },
      sale: { currency: 'VND', amount: 5990000 },
      percentOff: 14,
    },
    badges: ['bestseller'],
    shortDesc: 'Premium wireless earbuds with active noise cancellation',
  },
  {
    id: '6',
    slug: 'ipad-air-m2',
    title: 'iPad Air 11" M2 128GB WiFi',
    brand: 'Apple',
    category: 'tablets',
    attributes: {
      color: ['Space Gray', 'Starlight', 'Purple', 'Blue'],
      storage: ['128GB', '256GB', '512GB'],
    },
    media: [
      {
        url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800',
        alt: 'iPad Air M2',
        type: 'image',
      },
    ],
    rating: 4.6,
    reviewCount: 890,
    price: {
      list: { currency: 'VND', amount: 16990000 },
    },
    badges: ['new'],
    shortDesc: 'Powerful and versatile tablet with M2 chip',
  },
  {
    id: '7',
    slug: 'dell-xps-15',
    title: 'Dell XPS 15 9530 i7-13700H 16GB 512GB RTX 4050',
    brand: 'Dell',
    category: 'laptops',
    attributes: {
      processor: ['i7-13700H', 'i9-13900H'],
      memory: ['16GB', '32GB', '64GB'],
      storage: ['512GB', '1TB', '2TB'],
    },
    media: [
      {
        url: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800',
        alt: 'Dell XPS 15',
        type: 'image',
      },
    ],
    rating: 4.5,
    reviewCount: 456,
    price: {
      list: { currency: 'VND', amount: 45990000 },
      sale: { currency: 'VND', amount: 39990000 },
      percentOff: 13,
    },
    badges: [],
    shortDesc: 'Premium Windows laptop for creators and professionals',
  },
  {
    id: '8',
    slug: 'apple-watch-series-9',
    title: 'Apple Watch Series 9 GPS 45mm',
    brand: 'Apple',
    category: 'wearables',
    attributes: {
      size: ['41mm', '45mm'],
      color: ['Midnight', 'Starlight', 'Silver', 'Pink', 'Product RED'],
    },
    media: [
      {
        url: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=800',
        alt: 'Apple Watch Series 9',
        type: 'image',
      },
    ],
    rating: 4.8,
    reviewCount: 1890,
    price: {
      list: { currency: 'VND', amount: 11990000 },
      sale: { currency: 'VND', amount: 9990000 },
      percentOff: 17,
      flashSale: {
        endsAt: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
        timezone: 'UTC+7',
      },
    },
    badges: ['flashSale'],
    shortDesc: 'Advanced health and fitness tracking smartwatch',
  },
];

export const mockCategories = [
  {
    slug: 'smartphones',
    name: 'Smartphones',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
    productCount: 245,
  },
  {
    slug: 'laptops',
    name: 'Laptops',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
    productCount: 189,
  },
  {
    slug: 'tablets',
    name: 'Tablets',
    image: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400',
    productCount: 78,
  },
  {
    slug: 'audio',
    name: 'Audio',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    productCount: 312,
  },
  {
    slug: 'wearables',
    name: 'Wearables',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
    productCount: 156,
  },
  {
    slug: 'accessories',
    name: 'Accessories',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400',
    productCount: 567,
  },
];

export const mockBannerSlides = [
  {
    id: '1',
    title: 'New iPhone 15 Pro',
    description: 'Titanium. So strong. So light. So Pro.',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800',
    cta: {
      text: 'Shop Now',
      href: '/p/iphone-15-pro-max',
    },
    backgroundColor: '#f0f0f0',
  },
  {
    id: '2',
    title: 'Galaxy S24 Ultra',
    description: 'Meet Galaxy AI. The new era of mobile.',
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800',
    cta: {
      text: 'Discover',
      href: '/p/samsung-galaxy-s24-ultra',
    },
    backgroundColor: '#e8f4f8',
  },
  {
    id: '3',
    title: 'MacBook Pro M3',
    description: 'Mind-blowing. Head-turning. Performance.',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800',
    cta: {
      text: 'Learn More',
      href: '/p/macbook-pro-14-m3',
    },
    backgroundColor: '#f5f5f5',
  },
];

export const mockTrendingKeywords = [
  'iPhone 15',
  'MacBook Pro',
  'AirPods',
  'Samsung Galaxy',
  'Gaming Laptop',
  'Wireless Earbuds',
  'Smart Watch',
  'iPad',
];

