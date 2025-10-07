import { Product, User, Address, ShippingQuote } from "@/types/models";

export const mockProducts: Product[] = [
  {
    id: "1",
    slug: "iphone-15-pro-max",
    title: "iPhone 15 Pro Max",
    brand: "Apple",
    category: "smartphones",
    attributes: {
      color: ["Natural Titanium", "Blue Titanium", "White Titanium", "Black Titanium"],
      storage: ["256GB", "512GB", "1TB"],
      display: "6.7 inch Super Retina XDR",
      processor: "A17 Pro chip",
    },
    media: [
      { url: "https://via.placeholder.com/600x600", alt: "iPhone 15 Pro Max" },
      { url: "https://via.placeholder.com/600x600", alt: "iPhone 15 Pro Max Side" },
    ],
    rating: 4.8,
    reviewCount: 1250,
    price: {
      list: { currency: "VND", amount: 34990000 },
      sale: { currency: "VND", amount: 32990000 },
      percentOff: 6,
      flashSale: {
        endsAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        timezone: "UTC+7",
      },
    },
    badges: ["flashSale", "bestseller"],
    specs: {
      "Screen Size": "6.7 inches",
      "RAM": "8GB",
      "Battery": "4422 mAh",
      "Camera": "48MP + 12MP + 12MP",
    },
    shortDesc: "The most powerful iPhone ever with titanium design",
    longDesc: "iPhone 15 Pro Max. Forged in titanium and featuring the groundbreaking A17 Pro chip, a customizable Action button, and the most powerful iPhone camera system ever.",
    variants: [
      {
        id: "v1",
        sku: "IP15PM-NAT-256",
        attributes: { color: "Natural Titanium", storage: "256GB" },
        stock: { status: "in-stock", qty: 10 },
      },
      {
        id: "v2",
        sku: "IP15PM-NAT-512",
        attributes: { color: "Natural Titanium", storage: "512GB" },
        price: {
          list: { currency: "VND", amount: 40990000 },
          sale: { currency: "VND", amount: 38990000 },
        },
        stock: { status: "low-stock", qty: 3 },
      },
    ],
  },
  {
    id: "2",
    slug: "samsung-galaxy-s24-ultra",
    title: "Samsung Galaxy S24 Ultra",
    brand: "Samsung",
    category: "smartphones",
    attributes: {
      color: ["Titanium Gray", "Titanium Black", "Titanium Violet"],
      storage: ["256GB", "512GB", "1TB"],
      display: "6.8 inch Dynamic AMOLED 2X",
      processor: "Snapdragon 8 Gen 3",
    },
    media: [
      { url: "https://via.placeholder.com/600x600", alt: "Samsung Galaxy S24 Ultra" },
    ],
    rating: 4.7,
    reviewCount: 980,
    price: {
      list: { currency: "VND", amount: 33990000 },
      sale: { currency: "VND", amount: 30990000 },
      percentOff: 9,
    },
    badges: ["new"],
    shortDesc: "Galaxy AI is here. The ultimate smartphone experience.",
  },
  {
    id: "3",
    slug: "macbook-air-m3",
    title: "MacBook Air M3 13-inch",
    brand: "Apple",
    category: "laptops",
    attributes: {
      color: ["Space Gray", "Silver", "Midnight", "Starlight"],
      ram: ["8GB", "16GB", "24GB"],
      storage: ["256GB SSD", "512GB SSD", "1TB SSD"],
      display: "13.6 inch Liquid Retina",
      processor: "Apple M3 chip",
    },
    media: [
      { url: "https://via.placeholder.com/600x600", alt: "MacBook Air M3" },
    ],
    rating: 4.9,
    reviewCount: 650,
    price: {
      list: { currency: "VND", amount: 27990000 },
    },
    badges: ["new", "bestseller"],
    shortDesc: "Lean. Mean. M3 machine.",
  },
];

export const mockCategories = [
  { slug: "smartphones", name: "Smartphones" },
  { slug: "laptops", name: "Laptops" },
  { slug: "tablets", name: "Tablets" },
  { slug: "accessories", name: "Accessories" },
  { slug: "audio", name: "Audio" },
  { slug: "wearables", name: "Wearables" },
];

export const mockUser: User = {
  id: "user-1",
  email: "john.doe@example.com",
  phone: "0912345678",
  name: "John Doe",
  avatar: "https://via.placeholder.com/150",
  createdAt: "2024-01-01T00:00:00Z",
};

export const mockAddresses: Address[] = [
  {
    id: "addr-1",
    name: "John Doe",
    phone: "0912345678",
    street: "123 Nguyen Van Linh",
    ward: "Tan Hung",
    district: "District 7",
    city: "Ho Chi Minh City",
    postalCode: "700000",
    isDefault: true,
  },
  {
    id: "addr-2",
    name: "John Doe",
    phone: "0912345678",
    street: "456 Le Loi",
    ward: "Ben Nghe",
    district: "District 1",
    city: "Ho Chi Minh City",
    postalCode: "700000",
    isDefault: false,
  },
];

export const mockShippingQuotes: ShippingQuote[] = [
  {
    id: "ship-1",
    name: "Standard Shipping",
    etaDays: 3,
    price: { currency: "VND", amount: 30000 },
  },
  {
    id: "ship-2",
    name: "Express Shipping",
    etaDays: 1,
    price: { currency: "VND", amount: 50000 },
    tag: "Recommended",
  },
  {
    id: "ship-3",
    name: "Same Day Delivery",
    etaDays: 0,
    price: { currency: "VND", amount: 100000 },
    tag: "Fastest",
  },
];

// Generate more mock products
function generateMockProducts(count: number): Product[] {
  const brands = ["Apple", "Samsung", "Xiaomi", "OPPO", "Vivo", "Sony", "LG"];
  const categories = ["smartphones", "laptops", "tablets", "accessories"];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `product-${i + 4}`,
    slug: `product-${i + 4}`,
    title: `Product ${i + 4}`,
    brand: brands[Math.floor(Math.random() * brands.length)],
    category: categories[Math.floor(Math.random() * categories.length)],
    attributes: {
      color: ["Black", "White", "Blue"],
      storage: ["128GB", "256GB"],
    },
    media: [
      { url: "https://via.placeholder.com/600x600", alt: `Product ${i + 4}` },
    ],
    rating: Math.random() * 2 + 3,
    reviewCount: Math.floor(Math.random() * 1000),
    price: {
      list: {
        currency: "VND",
        amount: Math.floor(Math.random() * 30000000) + 5000000,
      },
    },
    shortDesc: `Description for product ${i + 4}`,
  }));
}

export const allMockProducts = [...mockProducts, ...generateMockProducts(97)];
