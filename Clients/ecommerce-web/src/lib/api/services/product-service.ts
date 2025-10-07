import { z } from "zod";
import { Product, Paginated, ProductSchema } from "@/types/models";

const PRODUCT_API_URL = process.env.NEXT_PUBLIC_PRODUCT_API_URL || "http://localhost:8080";

// API Response wrapper from Java backend
const ApiResponseSchema = <T extends z.ZodType>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    message: z.string().nullable(),
    data: dataSchema.nullable(),
    timestamp: z.string(),
    errors: z.array(z.any()).optional(),
  });

// Page response from Java backend
const PageResponseSchema = <T extends z.ZodType>(itemSchema: T) =>
  z.object({
    content: z.array(itemSchema),
    totalElements: z.number(),
    totalPages: z.number(),
    size: z.number(),
    number: z.number(),
    first: z.boolean(),
    last: z.boolean(),
    numberOfElements: z.number(),
  });

// Product DTO from Java backend
const ProductResponseDtoSchema = z.object({
  id: z.string(),
  shopId: z.string().optional(),
  categoryId: z.string().optional(),
  name: z.string(),
  slug: z.string(),
  description: z.string().optional(),
  shortDescription: z.string().optional(),
  sku: z.string(),
  barcode: z.string().optional(),
  price: z.number(),
  compareAtPrice: z.number().optional(),
  costPrice: z.number().optional(),
  quantity: z.number(),
  trackQuantity: z.boolean(),
  weight: z.number().optional(),
  weightUnit: z.string().optional(),
  status: z.string(),
  visibility: z.boolean(),
  featured: z.boolean(),
  tags: z.array(z.string()).optional(),
  brand: z.string().optional(),
  vendor: z.string().optional(),
  type: z.string().optional(),
  condition: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoKeywords: z.array(z.string()).optional(),
  images: z.array(z.object({
    id: z.string(),
    url: z.string(),
    alt: z.string().optional(),
    isMain: z.boolean(),
    displayOrder: z.number(),
  })).optional(),
  variants: z.array(z.object({
    id: z.string(),
    sku: z.string(),
    barcode: z.string().optional(),
    price: z.number(),
    compareAtPrice: z.number().optional(),
    costPrice: z.number().optional(),
    quantity: z.number(),
    weight: z.number().optional(),
    status: z.string(),
    attributes: z.record(z.string()),
  })).optional(),
  attributes: z.record(z.any()).optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// Transform Java DTO to our frontend Product model
function transformProductResponse(dto: z.infer<typeof ProductResponseDtoSchema>): Product {
  return {
    id: dto.id,
    slug: dto.slug,
    title: dto.name,
    brand: dto.brand || dto.vendor || "Unknown",
    category: dto.type || "general",
    attributes: dto.attributes || {},
    media: dto.images?.map(img => ({
      url: img.url,
      alt: img.alt || dto.name,
    })) || [],
    rating: 0, // TODO: Get from reviews service
    reviewCount: 0, // TODO: Get from reviews service
    price: {
      list: {
        currency: "VND",
        amount: dto.compareAtPrice || dto.price,
      },
      sale: dto.compareAtPrice && dto.compareAtPrice > dto.price ? {
        currency: "VND",
        amount: dto.price,
      } : undefined,
      percentOff: dto.compareAtPrice && dto.compareAtPrice > dto.price
        ? Math.round((1 - dto.price / dto.compareAtPrice) * 100)
        : undefined,
    },
    badges: [
      ...(dto.featured ? ["bestseller" as const] : []),
      ...(dto.compareAtPrice && dto.compareAtPrice > dto.price ? ["flashSale" as const] : []),
    ],
    specs: dto.attributes as Record<string, string> | undefined,
    shortDesc: dto.shortDescription,
    longDesc: dto.description,
    variants: dto.variants?.map(v => ({
      id: v.id,
      sku: v.sku,
      attributes: v.attributes,
      price: v.price !== dto.price ? {
        list: {
          currency: "VND",
          amount: v.compareAtPrice || v.price,
        },
        sale: v.compareAtPrice && v.compareAtPrice > v.price ? {
          currency: "VND",
          amount: v.price,
        } : undefined,
      } : undefined,
      stock: {
        status: v.quantity === 0 ? "out-of-stock" : v.quantity < 10 ? "low-stock" : "in-stock",
        qty: v.quantity,
      },
      media: undefined, // Variant-specific media not yet supported
    })),
  };
}

export class ProductService {
  private static async fetchFromAPI<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const response = await fetch(`${PRODUCT_API_URL}/api/v1${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }

  static async getProducts(params?: {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDirection?: string;
    locale?: string;
    categoryId?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    brand?: string;
  }): Promise<Paginated<Product>> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }

    const endpoint = params?.search 
      ? `/products/search?${queryParams}`
      : params?.categoryId 
      ? `/products/by-category/${params.categoryId}?${queryParams}`
      : `/products?${queryParams}`;

    const response = await this.fetchFromAPI<any>(endpoint);
    
    // Parse and validate response
    const apiResponse = ApiResponseSchema(PageResponseSchema(ProductResponseDtoSchema)).parse(response);
    
    if (!apiResponse.success || !apiResponse.data) {
      throw new Error(apiResponse.message || "Failed to fetch products");
    }

    // Transform to our format
    return {
      page: apiResponse.data.number + 1, // Java uses 0-based pagination
      size: apiResponse.data.size,
      total: apiResponse.data.totalElements,
      items: apiResponse.data.content.map(transformProductResponse),
    };
  }

  static async getProductBySlug(slug: string, locale?: string): Promise<Product> {
    // First try to get by slug (might need custom endpoint)
    // Fallback to search by slug
    const searchResponse = await this.fetchFromAPI<any>(
      `/products/search?name=${slug}&size=1`
    );

    const apiResponse = ApiResponseSchema(PageResponseSchema(ProductResponseDtoSchema)).parse(searchResponse);
    
    if (!apiResponse.success || !apiResponse.data || apiResponse.data.content.length === 0) {
      throw new Error("Product not found");
    }

    return transformProductResponse(apiResponse.data.content[0]);
  }

  static async getProductById(id: string, locale?: string): Promise<Product> {
    const response = await this.fetchFromAPI<any>(
      `/products/${id}${locale ? `?locale=${locale}` : ""}`
    );

    const apiResponse = ApiResponseSchema(ProductResponseDtoSchema).parse(response);
    
    if (!apiResponse.success || !apiResponse.data) {
      throw new Error(apiResponse.message || "Product not found");
    }

    return transformProductResponse(apiResponse.data);
  }

  static async searchProducts(query: string, params?: {
    page?: number;
    size?: number;
    minPrice?: number;
    maxPrice?: number;
    categoryId?: string;
    brand?: string;
    sortBy?: string;
    sortDirection?: string;
  }): Promise<Paginated<Product>> {
    return this.getProducts({
      ...params,
      search: query,
    });
  }

  static async getProductsByCategory(
    categoryId: string,
    page: number = 0,
    size: number = 20,
    locale?: string
  ): Promise<Paginated<Product>> {
    return this.getProducts({
      categoryId,
      page,
      size,
      locale,
    });
  }

  static async getSuggestedProducts(query: string): Promise<{
    suggestedQueries: string[];
    topCategories: Array<{ slug: string; name: string }>;
    topProducts: Array<Pick<Product, "id" | "slug" | "title" | "media" | "price">>;
  }> {
    // This would need a dedicated suggest endpoint on the backend
    // For now, use search with limited fields
    const products = await this.searchProducts(query, { size: 5 });
    
    return {
      suggestedQueries: [
        `${query} giá rẻ`,
        `${query} chính hãng`,
        `${query} mới nhất`,
      ],
      topCategories: [], // TODO: Implement category suggestions
      topProducts: products.items.slice(0, 5).map(p => ({
        id: p.id,
        slug: p.slug,
        title: p.title,
        media: p.media,
        price: p.price,
      })),
    };
  }

  static async getRelatedProducts(productId: string, limit: number = 4): Promise<Product[]> {
    // Get the product to find its category
    const product = await this.getProductById(productId);
    
    // Get products from same category
    const related = await this.getProductsByCategory(product.category, 0, limit + 1);
    
    // Filter out the current product
    return related.items.filter(p => p.id !== productId).slice(0, limit);
  }
}
