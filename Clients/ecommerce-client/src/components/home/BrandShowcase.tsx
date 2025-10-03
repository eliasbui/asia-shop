'use client';

import Image from 'next/image';

const brands = [
  { name: 'Apple', logo: '/brand-apple.png' },
  { name: 'Samsung', logo: '/brand-samsung.png' },
  { name: 'Sony', logo: '/brand-sony.png' },
  { name: 'Xiaomi', logo: '/brand-xiaomi.png' },
  { name: 'Dell', logo: '/brand-dell.png' },
  { name: 'Nike', logo: '/brand-nike.png' },
  { name: 'Adidas', logo: '/brand-adidas.png' },
  { name: 'LG', logo: '/brand-lg.png' }
];

export function BrandShowcase() {
  return (
    <section className="container mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Thương Hiệu Uy Tín</h2>
        <p className="text-muted-foreground">Hơn 100 thương hiệu hàng đầu thế giới</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-8">
        {brands.map((brand) => (
          <div
            key={brand.name}
            className="flex items-center justify-center h-16 grayscale hover:grayscale-0 transition-all duration-200 opacity-60 hover:opacity-100"
          >
            <div className="relative w-24 h-12">
              {/* Placeholder for brand logos */}
              <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center text-sm font-medium text-gray-600">
                {brand.name}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}