'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/product/ProductCard';
import { Product } from '@/lib/types/domain';

// Mock data - would come from API
const mockFeaturedProducts: Product[] = [
  {
    id: '3',
    slug: 'samsung-galaxy-s24',
    title: 'Samsung Galaxy S24 Ultra',
    brand: 'Samsung',
    category: 'smartphones',
    attributes: {},
    media: [{ url: '/placeholder-product.jpg', alt: 'Galaxy S24' }],
    rating: 4.7,
    reviewCount: 203,
    price: {
      list: { currency: 'VND', amount: 32990000 },
      sale: { currency: 'VND', amount: 29990000 },
      percentOff: 9
    },
    badges: ['new', 'bestseller'],
    variants: [{
      id: '3-1',
      sku: 'S24U256',
      attributes: { color: 'Phantom Black', storage: '256GB' },
      stock: { status: 'in-stock', qty: 18 }
    }]
  },
  {
    id: '4',
    slug: 'ipad-pro-m2',
    title: 'iPad Pro 12.9" M2',
    brand: 'Apple',
    category: 'tablets',
    attributes: {},
    media: [{ url: '/placeholder-product.jpg', alt: 'iPad Pro' }],
    rating: 4.9,
    reviewCount: 156,
    price: {
      list: { currency: 'VND', amount: 28990000 },
      sale: { currency: 'VND', amount: 25990000 },
      percentOff: 10
    },
    badges: ['bestseller'],
    variants: [{
      id: '4-1',
      sku: 'IPADPRO129M2',
      attributes: { color: 'Space Gray', storage: '256GB', wifi: 'WiFi' },
      stock: { status: 'in-stock', qty: 8 }
    }]
  },
  {
    id: '5',
    slug: 'sony-wh1000xm5',
    title: 'Sony WH-1000XM5',
    brand: 'Sony',
    category: 'headphones',
    attributes: {},
    media: [{ url: '/placeholder-product.jpg', alt: 'Sony Headphones' }],
    rating: 4.8,
    reviewCount: 412,
    price: {
      list: { currency: 'VND', amount: 8990000 },
      sale: { currency: 'VND', amount: 7490000 },
      percentOff: 17
    },
    badges: ['bestseller'],
    variants: [{
      id: '5-1',
      sku: 'SONYXM5BK',
      attributes: { color: 'Black' },
      stock: { status: 'in-stock', qty: 25 }
    }]
  },
  {
    id: '6',
    slug: 'nintendo-switch',
    title: 'Nintendo Switch OLED',
    brand: 'Nintendo',
    category: 'gaming',
    attributes: {},
    media: [{ url: '/placeholder-product.jpg', alt: 'Nintendo Switch' }],
    rating: 4.6,
    reviewCount: 289,
    price: {
      list: { currency: 'VND', amount: 11990000 },
      sale: { currency: 'VND', amount: 10990000 },
      percentOff: 8
    },
    badges: ['new'],
    variants: [{
      id: '6-1',
      sku: 'NSWOLED',
      attributes: { color: 'White', storage: '64GB' },
      stock: { status: 'low-stock', qty: 3 }
    }]
  },
  {
    id: '7',
    slug: 'xiaomi-14-pro',
    title: 'Xiaomi 14 Pro',
    brand: 'Xiaomi',
    category: 'smartphones',
    attributes: {},
    media: [{ url: '/placeholder-product.jpg', alt: 'Xiaomi 14 Pro' }],
    rating: 4.5,
    reviewCount: 178,
    price: {
      list: { currency: 'VND', amount: 22990000 },
      sale: { currency: 'VND', amount: 19990000 },
      percentOff: 13
    },
    badges: ['new'],
    variants: [{
      id: '7-1',
      sku: 'MI14P256',
      attributes: { color: 'Black', storage: '256GB' },
      stock: { status: 'in-stock', qty: 12 }
    }]
  }
];

export function FeaturedProducts() {
  const t = useTranslations('common');

  return (
    <section className="container mx-auto px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold mb-2">Sản Phẩm Nổi Bật</h2>
          <p className="text-muted-foreground">Những sản phẩm được yêu thích nhất tuần qua</p>
        </div>

        <div className="flex space-x-4">
          <Button variant="outline" size="sm">
            Điện thoại
          </Button>
          <Button variant="outline" size="sm">
            Laptop
          </Button>
          <Button variant="outline" size="sm">
            Phụ kiện
          </Button>
          <Button size="sm">
            Xem tất cả
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {mockFeaturedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}