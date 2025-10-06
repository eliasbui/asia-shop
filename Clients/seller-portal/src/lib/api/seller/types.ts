import { z } from 'zod';

export const productVariantSchema = z.object({
  id: z.string(),
  sku: z.string(),
  title: z.string(),
  price: z.number(),
  available: z.number(),
  reserved: z.number(),
  sold: z.number(),
  defective: z.number()
});

export const productSchema = z.object({
  id: z.string(),
  sku: z.string(),
  slug: z.string(),
  title: z.string(),
  brand: z.string().optional(),
  category: z.string(),
  attributes: z.record(z.string(), z.string().or(z.number())).optional(),
  media: z.array(z.string().url()).optional(),
  price: z.number(),
  discountPrice: z.number().nullable(),
  stock: z.number(),
  variants: z.array(productVariantSchema).optional()
});

export const orderItemSchema = z.object({
  id: z.string(),
  productId: z.string(),
  title: z.string(),
  quantity: z.number(),
  unitPrice: z.number(),
  variant: z.string().nullable()
});

export const orderSchema = z.object({
  id: z.string(),
  orderNumber: z.string(),
  status: z.enum([
    'pending',
    'confirmed',
    'packed',
    'shipped',
    'delivered',
    'returned',
    'cancelled'
  ]),
  customerName: z.string(),
  total: z.number(),
  currency: z.string().default('USD'),
  items: z.array(orderItemSchema),
  createdAt: z.coerce.date(),
  storeId: z.string()
});

export const payoutSchema = z.object({
  id: z.string(),
  amount: z.number(),
  status: z.enum(['pending', 'paid', 'rejected']),
  scheduledFor: z.coerce.date(),
  account: z.string(),
  reference: z.string()
});

export const revenueSnapshotSchema = z.object({
  period: z.string(),
  gross: z.number(),
  net: z.number(),
  fees: z.number()
});

export type Product = z.infer<typeof productSchema>;
export type ProductVariant = z.infer<typeof productVariantSchema>;
export type Order = z.infer<typeof orderSchema>;
export type Payout = z.infer<typeof payoutSchema>;
export type RevenueSnapshot = z.infer<typeof revenueSnapshotSchema>;
