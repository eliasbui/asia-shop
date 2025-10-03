'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Smartphone, Laptop, Headphones, Camera, Watch, Gamepad2, Home, Car } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: React.ReactNode;
  image: string;
  productCount: number;
}

const categories: Category[] = [
  {
    id: '1',
    name: 'Điện thoại',
    slug: 'smartphones',
    icon: <Smartphone className="h-8 w-8" />,
    image: '/category-phone.jpg',
    productCount: 1250
  },
  {
    id: '2',
    name: 'Laptop',
    slug: 'laptops',
    icon: <Laptop className="h-8 w-8" />,
    image: '/category-laptop.jpg',
    productCount: 480
  },
  {
    id: '3',
    name: 'Tai nghe',
    slug: 'headphones',
    icon: <Headphones className="h-8 w-8" />,
    image: '/category-headphones.jpg',
    productCount: 320
  },
  {
    id: '4',
    name: 'Máy ảnh',
    slug: 'cameras',
    icon: <Camera className="h-8 w-8" />,
    image: '/category-camera.jpg',
    productCount: 156
  },
  {
    id: '5',
    name: 'Đồng hồ',
    slug: 'watches',
    icon: <Watch className="h-8 w-8" />,
    image: '/category-watch.jpg',
    productCount: 89
  },
  {
    id: '6',
    name: 'Gaming',
    slug: 'gaming',
    icon: <Gamepad2 className="h-8 w-8" />,
    image: '/category-gaming.jpg',
    productCount: 234
  },
  {
    id: '7',
    name: 'Nhà cửa',
    slug: 'home',
    icon: <Home className="h-8 w-8" />,
    image: '/category-home.jpg',
    productCount: 567
  },
  {
    id: '8',
    name: 'Ô tô',
    slug: 'automotive',
    icon: <Car className="h-8 w-8" />,
    image: '/category-automotive.jpg',
    productCount: 145
  }
];

export function CategoriesSection() {
  return (
    <section className="container mx-auto px-4">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Danh Mục Nổi Bật</h2>
        <p className="text-muted-foreground">Khám phá các danh mục sản phẩm được yêu thích nhất</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/c/${category.slug}`}
            className="group text-center space-y-3 p-4 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="relative mx-auto w-16 h-16">
              <div className="absolute inset-0 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                {category.icon}
              </div>
            </div>

            <h3 className="font-medium text-sm group-hover:text-blue-600 transition-colors">
              {category.name}
            </h3>

            <p className="text-xs text-muted-foreground">
              {category.productCount} sản phẩm
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}