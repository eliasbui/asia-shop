'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function EmptyCart() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center space-y-6 max-w-md mx-auto">
        {/* Empty Cart Icon */}
        <div className="relative w-32 h-32 mx-auto">
          <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center">
            <ShoppingBag className="w-16 h-16 text-gray-400" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold">0</span>
          </div>
        </div>

        {/* Message */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Giỏ hàng trống</h1>
          <p className="text-muted-foreground">
            Chưa có sản phẩm nào trong giỏ hàng của bạn. Hãy khám phá và thêm sản phẩm bạn yêu thích!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link href="/c/all">
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              <ShoppingBag className="w-4 h-4 mr-2" />
              Tiếp tục mua sắm
            </Button>
          </Link>

          <Link href="/">
            <Button variant="outline" className="w-full">
              Về trang chủ
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        {/* Suggestions */}
        <div className="pt-8 border-t">
          <h3 className="font-medium mb-4">Gợi ý cho bạn</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { name: 'Điện thoại', path: '/c/smartphones' },
              { name: 'Laptop', path: '/c/laptops' },
              { name: 'Tai nghe', path: '/c/headphones' },
              { name: 'Đồng hồ', path: '/c/watches' }
            ].map((category) => (
              <Link
                key={category.name}
                href={category.path}
                className="p-3 border rounded-lg hover:bg-gray-50 transition-colors text-center"
              >
                <div className="w-8 h-8 bg-gray-100 rounded-full mx-auto mb-2" />
                <span className="text-sm font-medium">{category.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}