export type Money = { currency: string; amount: number };

export type Price = {
  list: Money;
  sale?: Money;
  percentOff?: number;
  flashSale?: { endsAt: string; timezone: 'UTC+7' };
};

export type Media = { url: string; alt: string; type?: 'image'|'video' };

export type Variant = {
  id: string;
  sku: string;
  attributes: Record<string, string>;
  price?: Price;
  stock: { status: 'in-stock'|'low-stock'|'out-of-stock'; qty?: number };
  media?: Media[];
};

export type Product = {
  id: string;
  slug: string;
  title: string;
  brand: string;
  category: string;
  attributes: Record<string, string | string[]>;
  media: Media[];
  rating: number;
  reviewCount: number;
  price: Price;
  badges?: ('flashSale'|'new'|'bestseller')[];
  specs?: Record<string, string>;
  shortDesc?: string;
  longDesc?: string;
  variants?: Variant[];
  collections?: string[]; // Collection slugs this product belongs to
};

export type Paginated<T> = { page: number; size: number; total: number; items: T[]; };

export type SuggestPayload = {
  suggestedQueries: string[];
  topCategories: { slug: string; name: string }[];
  topProducts: Pick<Product,'id'|'slug'|'title'|'media'|'price'>[];
};