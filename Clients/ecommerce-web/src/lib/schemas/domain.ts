/**
 * Zod schemas for runtime validation of API responses
 */
import { z } from 'zod';

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
      timezone: z.literal('UTC+7'),
    })
    .optional(),
});

export const MediaSchema = z.object({
  url: z.string().url(),
  alt: z.string(),
  type: z.enum(['image', 'video']).optional(),
});

export const VariantSchema = z.object({
  id: z.string(),
  sku: z.string(),
  attributes: z.record(z.string()),
  price: PriceSchema.optional(),
  stock: z.object({
    status: z.enum(['in-stock', 'low-stock', 'out-of-stock']),
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
  reviewCount: z.number().min(0),
  price: PriceSchema,
  badges: z.array(z.enum(['flashSale', 'new', 'bestseller'])).optional(),
  specs: z.record(z.string()).optional(),
  shortDesc: z.string().optional(),
  longDesc: z.string().optional(),
  variants: z.array(VariantSchema).optional(),
});

export const PaginatedSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
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

export const AddressSchema = z.object({
  id: z.string(),
  type: z.enum(['billing', 'shipping']),
  fullName: z.string().min(1),
  phone: z.string().min(1),
  addressLine1: z.string().min(1),
  addressLine2: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(1),
  postalCode: z.string().min(1),
  country: z.string().min(1),
  isDefault: z.boolean().optional(),
});

export const ShippingOptionSchema = z.object({
  id: z.string(),
  name: z.string(),
  etaDays: z.number(),
  price: MoneySchema,
  tag: z.enum(['fastest', 'cheapest', 'recommended']).optional(),
});

export const CouponSchema = z.object({
  code: z.string(),
  valid: z.boolean(),
  discount: MoneySchema.optional(),
  percentOff: z.number().optional(),
  reason: z.string().optional(),
});

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  firstName: z.string(),
  lastName: z.string(),
  avatar: z.string().url().optional(),
  emailVerified: z.boolean(),
  phoneVerified: z.boolean(),
  twoFactorEnabled: z.boolean(),
});

export const AuthResponseSchema = z.object({
  user: UserSchema,
  accessToken: z.string(),
  refreshToken: z.string().optional(),
  expiresIn: z.number(),
});

export const ApiErrorSchema = z.object({
  code: z.string(),
  message: z.string(),
  details: z.record(z.unknown()).optional(),
});

// Form validation schemas

export const LoginFormSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  rememberMe: z.boolean().optional(),
});

export const RegisterFormSchema = z
  .object({
    email: z.string().email('Invalid email address'),
    phone: z.string().min(10, 'Invalid phone number').optional(),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: 'You must accept the terms and conditions',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export const AddressFormSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  phone: z.string().min(10, 'Invalid phone number'),
  addressLine1: z.string().min(1, 'Address is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State/Province is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
  country: z.string().min(1, 'Country is required'),
  isDefault: z.boolean().optional(),
});

export const CheckoutFormSchema = z.object({
  shippingAddressId: z.string().min(1, 'Shipping address is required'),
  billingAddressId: z.string().min(1, 'Billing address is required'),
  shippingOptionId: z.string().min(1, 'Shipping method is required'),
  paymentMethodId: z.string().min(1, 'Payment method is required'),
  couponCode: z.string().optional(),
});

