'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';

export function HeroBanner() {
  return (
    <section className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5" />
              <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
                Flash Sale Giảm Sốc
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Siêu Sale
              <br />
              Điện Tử Công Nghệ
            </h1>

            <p className="text-lg md:text-xl text-blue-100">
              Giảm đến 50% cho các sản phẩm công nghệ hot nhất.
              Chỉ còn 24 giờ!
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                Mua Ngay
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                Xem Khuyến Mãi
              </Button>
            </div>

            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span>1000+ sản phẩm</span>
              </div>
              <div className="flex items-center space-x-1">
                <span>🚚</span>
                <span>Miễn phí vận chuyển</span>
              </div>
              <div className="flex items-center space-x-1">
                <span>🔒</span>
                <span>Bảo hành 2 năm</span>
              </div>
            </div>
          </div>

          <div className="relative md:h-96 h-64">
            <Image
              src="/banner-hero.jpg"
              alt="Electronics Flash Sale"
              fill
              className="object-cover rounded-lg"
              priority
            />
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-10 right-10 w-20 h-20 bg-yellow-400 rounded-full opacity-20 animate-pulse" />
      <div className="absolute bottom-20 left-10 w-16 h-16 bg-pink-400 rounded-full opacity-20 animate-pulse delay-75" />
    </section>
  );
}