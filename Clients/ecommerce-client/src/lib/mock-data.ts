import { Product, Category, Brand, Review, User, Address } from "@/types";

export const categories: Category[] = [
  { id: "1", name: "Điện thoại", slug: "dien-thoai", icon: "Smartphone", image: "/categories/phones.jpg", productCount: 156 },
  { id: "2", name: "Laptop", slug: "laptop", icon: "Laptop", image: "/categories/laptops.jpg", productCount: 89 },
  { id: "3", name: "Máy tính bảng", slug: "may-tinh-bang", icon: "Tablet", image: "/categories/tablets.jpg", productCount: 67 },
  { id: "4", name: "Đồng hồ thông minh", slug: "dong-ho-thong-minh", icon: "Watch", image: "/categories/smartwatches.jpg", productCount: 124 },
  { id: "5", name: "Tai nghe", slug: "tai-nghe", icon: "Headphones", image: "/categories/headphones.jpg", productCount: 203 },
  { id: "6", name: "Loa", slug: "loa", icon: "Speaker", image: "/categories/speakers.jpg", productCount: 78 },
  { id: "7", name: "Sạc dự phòng", slug: "sac-du-phong", icon: "Battery", image: "/categories/powerbanks.jpg", productCount: 145 },
  { id: "8", name: "Ốp lưng", slug: "op-lung", icon: "Package", image: "/categories/cases.jpg", productCount: 412 },
  { id: "9", name: "Cáp sạc", slug: "cap-sac", icon: "Cable", image: "/categories/cables.jpg", productCount: 189 },
  { id: "10", name: "Chuột máy tính", slug: "chuot-may-tinh", icon: "Mouse", image: "/categories/mice.jpg", productCount: 97 },
  { id: "11", name: "Bàn phím", slug: "ban-phim", icon: "Keyboard", image: "/categories/keyboards.jpg", productCount: 134 },
  { id: "12", name: "Màn hình", slug: "man-hinh", icon: "Monitor", image: "/categories/monitors.jpg", productCount: 56 }
];

export const brands: Brand[] = [
  { id: "1", name: "Apple", slug: "apple", logo: "/brands/apple.png", description: "Thương hiệu công nghệ Mỹ" },
  { id: "2", name: "Samsung", slug: "samsung", logo: "/brands/samsung.png", description: "Thương hiệu công nghệ Hàn Quốc" },
  { id: "3", name: "Xiaomi", slug: "xiaomi", logo: "/brands/xiaomi.png", description: "Thương hiệu công nghệ Trung Quốc" },
  { id: "4", name: "Oppo", slug: "oppo", logo: "/brands/oppo.png", description: "Thương hiệu điện thoại Trung Quốc" },
  { id: "5", name: "Vivo", slug: "vivo", logo: "/brands/vivo.png", description: "Thương hiệu điện thoại Trung Quốc" },
  { id: "6", name: "Realme", slug: "realme", logo: "/brands/realme.png", description: "Thương hiệu điện thoại Trung Quốc" },
  { id: "7", name: "OnePlus", slug: "oneplus", logo: "/brands/oneplus.png", description: "Thương hiệu điện thoại Trung Quốc" },
  { id: "8", name: "Sony", slug: "sony", logo: "/brands/sony.png", description: "Thương hiệu điện tử Nhật Bản" },
  { id: "9", name: "JBL", slug: "jbl", logo: "/brands/jbl.png", description: "Thương hiệu âm thanh Mỹ" },
  { id: "10", name: "Anker", slug: "anker", logo: "/brands/anker.png", description: "Thương hiệu phụ kiện Trung Quốc" }
];

const generateProducts = (): Product[] => {
  const products: Product[] = [];
  const productNames = [
    "iPhone 15 Pro Max", "iPhone 15 Pro", "iPhone 15", "iPhone 14 Pro Max", "iPhone 14",
    "Samsung Galaxy S24 Ultra", "Samsung Galaxy S24+", "Samsung Galaxy S24", "Samsung Galaxy A54",
    "Xiaomi 14 Pro", "Xiaomi 14", "Xiaomi 13 Ultra", "Redmi Note 13 Pro+",
    "OPPO Find X7 Ultra", "OPPO Reno11 Pro", "OPPO A79",
    "Vivo X100 Pro", "Vivo X100", "Vivo V29 Pro",
    "MacBook Pro 16\"", "MacBook Air M3", "MacBook Pro 14\"",
    "Dell XPS 15", "Dell Inspiron 14", "Lenovo ThinkPad X1",
    "iPad Pro 12.9\"", "iPad Air", "iPad 10", "Samsung Galaxy Tab S9 Ultra",
    "Apple Watch Series 9", "Samsung Galaxy Watch 6", "Xiaomi Watch S3",
    "AirPods Pro 2", "AirPods 3", "Sony WH-1000XM5", "JBL Tune 760NC",
    "Anker PowerCore 20000", "Xiaomi Power Bank 20000mAh", "Samsung 25W PD Charger"
  ];

  for (let i = 0; i < productNames.length; i++) {
    const name = productNames[i];
    const basePrice = Math.floor(Math.random() * 20000000) + 1000000;
    const hasDiscount = Math.random() > 0.6;
    const discount = hasDiscount ? Math.floor(Math.random() * 50) + 10 : undefined;
    const originalPrice = discount ? Math.floor(basePrice / (1 - discount / 100)) : undefined;

    const categoryIndex = Math.floor(Math.random() * categories.length);
    const brandIndex = Math.floor(Math.random() * brands.length);

    products.push({
      id: `product-${i + 1}`,
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      description: `Sản phẩm cao cấp với thiết kế hiện đại và tính năng vượt trội. Phù hợp cho mọi nhu cầu sử dụng hàng ngày.`,
      price: basePrice,
      originalPrice,
      discount,
      rating: Math.round((Math.random() * 2 + 3) * 10) / 10,
      reviewCount: Math.floor(Math.random() * 500) + 10,
      sold: Math.floor(Math.random() * 1000) + 5,
      stock: Math.floor(Math.random() * 100) + 1,
      images: Array.from({ length: 4 }, (_, index) =>
        `https://picsum.photos/400/400?random=${i * 10 + index}`
      ),
      thumbnail: `https://picsum.photos/200/200?random=${i * 10}`,
      category: categories[categoryIndex].name,
      categoryId: categories[categoryIndex].id,
      brand: brands[brandIndex].name,
      brandId: brands[brandIndex].id,
      variants: {
        sizes: ["128GB", "256GB", "512GB", "1TB"].slice(0, Math.floor(Math.random() * 4) + 1),
        colors: [
          { name: "Đen", hex: "#000000" },
          { name: "Trắng", hex: "#FFFFFF" },
          { name: "Xanh", hex: "#007AFF" },
          { name: "Tím", hex: "#5856D6" }
        ].slice(0, Math.floor(Math.random() * 4) + 1)
      },
      specifications: [
        { label: "Màn hình", value: "6.7 inches Super Retina XDR" },
        { label: "Chip", value: "A17 Pro" },
        { label: "RAM", value: "8GB" },
        { label: "Camera sau", value: "48MP + 12MP + 12MP" },
        { label: "Camera trước", value: "12MP" },
        { label: "Pin", value: "4422mAh" }
      ],
      tags: ["hot", "bestseller", "new", "sale"],
      isFeatured: Math.random() > 0.7,
      isNewArrival: Math.random() > 0.8,
      isBestSeller: Math.random() > 0.6,
      freeShipping: Math.random() > 0.5,
      createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString()
    });
  }

  return products;
};

export const products = generateProducts();

export const reviews: Review[] = Array.from({ length: 150 }, (_, i) => ({
  id: `review-${i + 1}`,
  productId: products[Math.floor(Math.random() * products.length)].id,
  userId: `user-${Math.floor(Math.random() * 50) + 1}`,
  userName: `Người dùng ${Math.floor(Math.random() * 50) + 1}`,
  userAvatar: `https://picsum.photos/40/40?random=${i}`,
  rating: Math.floor(Math.random() * 3) + 3,
  title: ["Rất hài lòng", "Tốt", "Bình thường", "Không như mong đợi"][Math.floor(Math.random() * 4)],
  comment: "Sản phẩm chất lượng tốt, giao hàng nhanh, đóng gói cẩn thận. Sẽ tiếp tục ủng hộ shop.",
  images: Math.random() > 0.7 ? [`https://picsum.photos/100/100?random=${i * 100}`] : undefined,
  variant: "256GB, Đen",
  helpful: Math.floor(Math.random() * 50),
  verified: Math.random() > 0.3,
  createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
}));

export const mockUser: User = {
  id: "user-1",
  name: "Nguyễn Văn A",
  email: "nguyenvana@email.com",
  phone: "0912345678",
  avatar: "https://picsum.photos/100/100?random=avatar",
  createdAt: new Date().toISOString()
};

export const mockAddresses: Address[] = [
  {
    id: "address-1",
    name: "Nguyễn Văn A",
    phone: "0912345678",
    address: "123 Đường ABC",
    city: "Hà Nội",
    district: "Cầu Giấy",
    ward: "Dịch Vọng Hậu",
    type: "home",
    isDefault: true
  },
  {
    id: "address-2",
    name: "Nguyễn Văn A",
    phone: "0912345678",
    address: "456 Đường XYZ",
    city: "TP. Hồ Chí Minh",
    district: "Quận 1",
    ward: "Bến Nghé",
    type: "office",
    isDefault: false
  }
];

export const searchSuggestions = [
  ...products.slice(0, 5).map(p => ({
    id: p.id,
    type: "product" as const,
    name: p.name,
    image: p.thumbnail,
    slug: p.slug
  })),
  ...categories.slice(0, 3).map(c => ({
    id: c.id,
    type: "category" as const,
    name: c.name,
    slug: c.slug
  })),
  ...brands.slice(0, 2).map(b => ({
    id: b.id,
    type: "brand" as const,
    name: b.name,
    slug: b.slug
  }))
];