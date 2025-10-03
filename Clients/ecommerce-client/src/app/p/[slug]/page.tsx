import { notFound } from 'next/navigation';
import { ProductDetail } from '@/components/product/ProductDetail';

interface ProductPageProps {
  params: { slug: string };
}

// Mock data - would come from API
const mockProducts = {
  'iphone-15-pro': {
    id: '1',
    slug: 'iphone-15-pro',
    title: 'iPhone 15 Pro Max 256GB',
    brand: 'Apple',
    category: 'smartphones',
    attributes: {
      'Màn hình': '6.7" Super Retina XDR',
      'Chip': 'A17 Pro',
      'Camera': '48MP Main + 12MP Ultra Wide + 12MP Telephoto',
      'Pin': '4422 mAh',
      'Kết nối': '5G, Wi-Fi 6E, Bluetooth 5.3'
    },
    media: [
      { url: '/placeholder-product.jpg', alt: 'iPhone 15 Pro' },
      { url: '/placeholder-product.jpg', alt: 'iPhone 15 Pro Side View' },
      { url: '/placeholder-product.jpg', alt: 'iPhone 15 Pro Back' }
    ],
    rating: 4.8,
    reviewCount: 124,
    price: {
      list: { currency: 'VND', amount: 34990000 },
      sale: { currency: 'VND', amount: 29990000 },
      percentOff: 14,
      flashSale: { endsAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), timezone: 'UTC+7' as const }
    },
    badges: ['flashSale', 'bestseller'] as ('flashSale' | 'bestseller' | 'new')[],
    shortDesc: 'iPhone 15 Pro Max với chip A17 Pro mạnh mẽ, hệ thống camera chuyên nghiệp và thiết kế Titan.',
    longDesc: 'iPhone 15 Pro Max mang đến cuộc cách mạng về thiết kế với khung titan siêu bền và nhẹ. Chip A17 Pro với hiệu năng đỉnh cao, hệ thống camera 48MP với khả năng quay video ProRes 4K ở 60fps, và màn hình Super Retina XDR 6.7 inch công nghệ ProMotion.',
    specs: {
      'Màn hình': '6.7 inch Super Retina XDR, ProMotion 120Hz',
      'Chip xử lý': 'A17 Pro 6-core CPU với 16-core Neural Engine',
      'Camera sau': '48MP f/1.78, 12MP f/2.2, 12MP f/2.8',
      'Camera trước': '12MP f/1.9',
      'Pin': '4422 mAh, hỗ trợ sạc nhanh 27W',
      'Bộ nhớ': '256GB',
      'Hệ điều hành': 'iOS 17',
      'Khối lượng': '221g'
    },
    variants: [
      {
        id: '1-1',
        sku: 'IP15PM256TB',
        attributes: { color: 'Titanium Blue', storage: '256GB' },
        price: {
          list: { currency: 'VND', amount: 34990000 },
          sale: { currency: 'VND', amount: 29990000 },
          percentOff: 14
        },
        stock: { status: 'low-stock' as const, qty: 5 },
        media: [{ url: '/placeholder-product.jpg', alt: 'iPhone 15 Pro Blue' }]
      },
      {
        id: '1-2',
        sku: 'IP15PM256TN',
        attributes: { color: 'Titanium Natural', storage: '256GB' },
        price: {
          list: { currency: 'VND', amount: 34990000 },
          sale: { currency: 'VND', amount: 29990000 },
          percentOff: 14
        },
        stock: { status: 'in-stock' as const, qty: 12 },
        media: [{ url: '/placeholder-product.jpg', alt: 'iPhone 15 Pro Natural' }]
      },
      {
        id: '1-3',
        sku: 'IP15PM256TW',
        attributes: { color: 'Titanium White', storage: '256GB' },
        price: {
          list: { currency: 'VND', amount: 34990000 },
          sale: { currency: 'VND', amount: 29990000 },
          percentOff: 14
        },
        stock: { status: 'in-stock' as const, qty: 8 },
        media: [{ url: '/placeholder-product.jpg', alt: 'iPhone 15 Pro White' }]
      }
    ]
  }
};

export default function ProductPage({ params }: ProductPageProps) {
  const product = mockProducts[params.slug as keyof typeof mockProducts];

  if (!product) {
    notFound();
  }

  return <ProductDetail product={product} />;
}
