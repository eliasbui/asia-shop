'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Clock, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/product/ProductCard';
import { Product } from '@/lib/types/domain';

// Mock data - would come from API
const mockFlashSaleProducts: Product[] = [
  {
    id: '1',
    slug: 'iphone-15-pro',
    title: 'iPhone 15 Pro Max 256GB',
    brand: 'Apple',
    category: 'smartphones',
    attributes: {},
    media: [{ url: '/placeholder-product.jpg', alt: 'iPhone 15 Pro' }],
    rating: 4.8,
    reviewCount: 124,
    price: {
      list: { currency: 'VND', amount: 34990000 },
      sale: { currency: 'VND', amount: 29990000 },
      percentOff: 14,
      flashSale: { endsAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), timezone: 'UTC+7' }
    },
    badges: ['flashSale', 'bestseller'],
    variants: [{
      id: '1-1',
      sku: 'IP15PM256',
      attributes: { color: 'Titanium Blue', storage: '256GB' },
      stock: { status: 'low-stock', qty: 5 }
    }]
  },
  {
    id: '2',
    slug: 'macbook-air-m3',
    title: 'MacBook Air M3 13 inch',
    brand: 'Apple',
    category: 'laptops',
    attributes: {},
    media: [{ url: '/placeholder-product.jpg', alt: 'MacBook Air' }],
    rating: 4.9,
    reviewCount: 89,
    price: {
      list: { currency: 'VND', amount: 28990000 },
      sale: { currency: 'VND', amount: 25990000 },
      percentOff: 10,
      flashSale: { endsAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), timezone: 'UTC+7' }
    },
    badges: ['flashSale'],
    variants: [{
      id: '2-1',
      sku: 'MBA13M3',
      attributes: { color: 'Space Gray', ram: '8GB', storage: '256GB' },
      stock: { status: 'in-stock', qty: 12 }
    }]
  }
];

export function FlashSaleSection() {
  const t = useTranslations('common');
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const endTime = new Date(Date.now() + 24 * 60 * 60 * 1000).getTime();
      const distance = endTime - now;

      if (distance > 0) {
        setTimeLeft({
          hours: Math.floor(distance / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="container mx-auto px-4">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-red-600">
            <Zap className="h-6 w-6" />
            <h2 className="text-2xl font-bold">Flash Sale</h2>
          </div>

          <div className="flex items-center space-x-2 bg-red-50 px-4 py-2 rounded-lg">
            <Clock className="h-4 w-4 text-red-600" />
            <span className="text-sm font-medium text-red-600">Kết thúc trong:</span>
            <div className="flex items-center space-x-1">
              <span className="bg-red-600 text-white px-2 py-1 rounded text-sm font-bold">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span className="text-red-600 font-bold">:</span>
              <span className="bg-red-600 text-white px-2 py-1 rounded text-sm font-bold">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span className="text-red-600 font-bold">:</span>
              <span className="bg-red-600 text-white px-2 py-1 rounded text-sm font-bold">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>

        <Button variant="outline">
          Xem Tất Cả
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {mockFlashSaleProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}