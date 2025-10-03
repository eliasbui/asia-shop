/**
 * Product API service functions
 */
import { apiClient } from './client';
import {
  ProductSchema,
  PaginatedSchema,
  SuggestPayloadSchema,
} from '@/lib/schemas';
import type { Product, Paginated, SuggestPayload, FilterParams } from '@/lib/types';

/**
 * Get paginated list of products with filters
 */
export async function getProducts(
  params: FilterParams = {}
): Promise<Paginated<Product>> {
  const response = await apiClient.get<unknown>('/products', params);
  return PaginatedSchema(ProductSchema).parse(response);
}

/**
 * Get product by slug
 */
export async function getProduct(slug: string): Promise<Product> {
  const response = await apiClient.get<unknown>(`/products/${slug}`);
  return ProductSchema.parse(response);
}

/**
 * Get product suggestions for autosuggest
 */
export async function getSuggestions(
  query: string,
  limit: number = 10
): Promise<SuggestPayload> {
  const response = await apiClient.get<unknown>('/suggest', { q: query, limit });
  return SuggestPayloadSchema.parse(response);
}

/**
 * Get products by category
 */
export async function getProductsByCategory(
  categorySlug: string,
  params: FilterParams = {}
): Promise<Paginated<Product>> {
  return getProducts({ ...params, category: categorySlug });
}

/**
 * Search products
 */
export async function searchProducts(
  query: string,
  params: FilterParams = {}
): Promise<Paginated<Product>> {
  return getProducts({ ...params, q: query });
}

