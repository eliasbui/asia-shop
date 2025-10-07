import { z } from "zod";

// Base schemas
export const MoneySchema = z.object({
  currency: z.string(),
  amount: z.number(),
});

export const PriceSchema = z.object({
  list: MoneySchema,
  sale: MoneySchema.optional(),
  percentOff: z.number().optional(),
  flashSale: z
    .object({
      endsAt: z.string(),
      timezone: z.literal("UTC+7"),
    })
    .optional(),
});

export const MediaSchema = z.object({
  url: z.string().url(),
  alt: z.string(),
  type: z.enum(["image", "video"]).optional(),
});

export const VariantSchema = z.object({
  id: z.string(),
  sku: z.string(),
  attributes: z.record(z.string()),
  price: PriceSchema.optional(),
  stock: z.object({
    status: z.enum(["in-stock", "low-stock", "out-of-stock"]),
    qty: z.number().optional(),
  }),
  media: z.array(MediaSchema).optional(),
});

export const ProductSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  brand: z.string(),
  category: z.string(),
  attributes: z.record(z.union([z.string(), z.array(z.string())])),
  media: z.array(MediaSchema),
  rating: z.number().min(0).max(5),
  reviewCount: z.number(),
  price: PriceSchema,
  badges: z.array(z.enum(["flashSale", "new", "bestseller"])).optional(),
  specs: z.record(z.string()).optional(),
  shortDesc: z.string().optional(),
  longDesc: z.string().optional(),
  variants: z.array(VariantSchema).optional(),
});

export const PaginatedSchema = <T extends z.ZodType>(itemSchema: T) =>
  z.object({
    page: z.number(),
    size: z.number(),
    total: z.number(),
    items: z.array(itemSchema),
  });

export const SuggestPayloadSchema = z.object({
  suggestedQueries: z.array(z.string()),
  topCategories: z.array(
    z.object({
      slug: z.string(),
      name: z.string(),
    })
  ),
  topProducts: z.array(
    ProductSchema.pick({
      id: true,
      slug: true,
      title: true,
      media: true,
      price: true,
    })
  ),
});

// Cart schemas
export const CartItemSchema = z.object({
  productId: z.string(),
  variantId: z.string().optional(),
  quantity: z.number().min(1),
  product: ProductSchema,
  variant: VariantSchema.optional(),
});

export const CartSchema = z.object({
  items: z.array(CartItemSchema),
  subtotal: MoneySchema,
  shipping: MoneySchema.optional(),
  discount: MoneySchema.optional(),
  total: MoneySchema,
  appliedCoupon: z.string().optional(),
});

// Auth schemas
export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  name: z.string(),
  avatar: z.string().url().optional(),
  createdAt: z.string(),
});

export const AuthResponseSchema = z.object({
  accessToken: z.string(),
  user: UserSchema,
});

// Address schemas
export const AddressSchema = z.object({
  id: z.string(),
  name: z.string(),
  phone: z.string(),
  street: z.string(),
  ward: z.string(),
  district: z.string(),
  city: z.string(),
  postalCode: z.string().optional(),
  isDefault: z.boolean(),
});

// Shipping schemas
export const ShippingQuoteSchema = z.object({
  id: z.string(),
  name: z.string(),
  etaDays: z.number(),
  price: MoneySchema,
  tag: z.string().optional(),
});

// Coupon schemas
export const CouponValidationSchema = z.object({
  valid: z.boolean(),
  discount: MoneySchema.optional(),
  reason: z.string().optional(),
});

// Order schemas
export const OrderItemSchema = z.object({
  productId: z.string(),
  variantId: z.string().optional(),
  quantity: z.number(),
  price: MoneySchema,
  product: ProductSchema,
  variant: VariantSchema.optional(),
});

export const OrderSchema = z.object({
  id: z.string(),
  orderNumber: z.string(),
  status: z.enum([
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ]),
  items: z.array(OrderItemSchema),
  shippingAddress: AddressSchema,
  billingAddress: AddressSchema.optional(),
  subtotal: MoneySchema,
  shipping: MoneySchema,
  discount: MoneySchema.optional(),
  total: MoneySchema,
  paymentMethod: z.string(),
  trackingNumber: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// API Error schemas
export const ApiErrorSchema = z.object({
  code: z.string(),
  message: z.string(),
  details: z.any().optional(),
});

// Type exports
export type Money = z.infer<typeof MoneySchema>;
export type Price = z.infer<typeof PriceSchema>;
export type Media = z.infer<typeof MediaSchema>;
export type Variant = z.infer<typeof VariantSchema>;
export type Product = z.infer<typeof ProductSchema>;
export type Paginated<T> = {
  page: number;
  size: number;
  total: number;
  items: T[];
};
export type SuggestPayload = z.infer<typeof SuggestPayloadSchema>;
export type CartItem = z.infer<typeof CartItemSchema>;
export type Cart = z.infer<typeof CartSchema>;
export type User = z.infer<typeof UserSchema>;
export type AuthResponse = z.infer<typeof AuthResponseSchema>;
export type Address = z.infer<typeof AddressSchema>;
export type ShippingQuote = z.infer<typeof ShippingQuoteSchema>;
export type CouponValidation = z.infer<typeof CouponValidationSchema>;
export type OrderItem = z.infer<typeof OrderItemSchema>;
export type Order = z.infer<typeof OrderSchema>;
export type ApiError = z.infer<typeof ApiErrorSchema>;
