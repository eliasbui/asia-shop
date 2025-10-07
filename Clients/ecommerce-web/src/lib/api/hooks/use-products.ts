import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Product, Paginated } from "@/types/models";
import { ProductService } from "@/lib/api/services/product-service";
import { api } from "@/lib/api/fetch-wrapper";
import { ProductSchema, PaginatedSchema } from "@/types/models";
import { z } from "zod";

const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK_API === "true";

// Product list hook
export function useProducts(params?: {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: string;
  categoryId?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
}) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: async () => {
      if (USE_MOCK_API) {
        // Use mock API
        const queryParams = new URLSearchParams();
        if (params) {
          Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined) {
              queryParams.append(key, String(value));
            }
          });
        }
        
        const response = await api.get<Paginated<Product>>(`/products?${queryParams}`, {
          schema: PaginatedSchema(ProductSchema),
        });
        return response;
      } else {
        // Use real API
        return ProductService.getProducts(params);
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Single product hook
export function useProduct(slugOrId: string, byId: boolean = false) {
  return useQuery({
    queryKey: ["product", slugOrId, byId],
    queryFn: async () => {
      if (USE_MOCK_API) {
        // Use mock API
        const endpoint = byId ? `/products/${slugOrId}` : `/products/${slugOrId}`;
        const response = await api.get<Product>(endpoint, {
          schema: ProductSchema,
        });
        return response;
      } else {
        // Use real API
        return byId 
          ? ProductService.getProductById(slugOrId)
          : ProductService.getProductBySlug(slugOrId);
      }
    },
    enabled: !!slugOrId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Product search hook
export function useProductSearch(query: string, params?: {
  page?: number;
  size?: number;
  minPrice?: number;
  maxPrice?: number;
  categoryId?: string;
  brand?: string;
}) {
  return useQuery({
    queryKey: ["products", "search", query, params],
    queryFn: async () => {
      if (USE_MOCK_API) {
        // Use mock API
        const queryParams = new URLSearchParams({
          q: query,
          ...params,
        } as any);
        
        const response = await api.get<Paginated<Product>>(`/products?${queryParams}`, {
          schema: PaginatedSchema(ProductSchema),
        });
        return response;
      } else {
        // Use real API
        return ProductService.searchProducts(query, params);
      }
    },
    enabled: !!query && query.length >= 2,
    staleTime: 5 * 60 * 1000,
  });
}

// Product suggestions hook
export function useProductSuggestions(query: string) {
  return useQuery({
    queryKey: ["products", "suggestions", query],
    queryFn: async () => {
      if (USE_MOCK_API) {
        // Use mock API
        const response = await api.get("/suggest", {
          params: { q: query, limit: 10 },
        });
        return response;
      } else {
        // Use real API
        return ProductService.getSuggestedProducts(query);
      }
    },
    enabled: !!query && query.length >= 2,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

// Related products hook
export function useRelatedProducts(productId: string, limit: number = 4) {
  return useQuery({
    queryKey: ["products", "related", productId, limit],
    queryFn: async () => {
      if (USE_MOCK_API) {
        // Use mock API - get products from same category
        const product = await api.get<Product>(`/products/${productId}`, {
          schema: ProductSchema,
        });
        
        const related = await api.get<Paginated<Product>>("/products", {
          params: {
            category: product.category,
            size: limit + 1,
          },
          schema: PaginatedSchema(ProductSchema),
        });
        
        return related.items.filter(p => p.id !== productId).slice(0, limit);
      } else {
        // Use real API
        return ProductService.getRelatedProducts(productId, limit);
      }
    },
    enabled: !!productId,
    staleTime: 10 * 60 * 1000,
  });
}

// Products by category hook
export function useProductsByCategory(categoryId: string, page: number = 0, size: number = 20) {
  return useQuery({
    queryKey: ["products", "category", categoryId, page, size],
    queryFn: async () => {
      if (USE_MOCK_API) {
        // Use mock API
        const response = await api.get<Paginated<Product>>("/products", {
          params: {
            category: categoryId,
            page,
            size,
          },
          schema: PaginatedSchema(ProductSchema),
        });
        return response;
      } else {
        // Use real API
        return ProductService.getProductsByCategory(categoryId, page, size);
      }
    },
    enabled: !!categoryId,
    staleTime: 5 * 60 * 1000,
  });
}

// Featured products hook
export function useFeaturedProducts(limit: number = 8) {
  return useQuery({
    queryKey: ["products", "featured", limit],
    queryFn: async () => {
      if (USE_MOCK_API) {
        // Use mock API
        const response = await api.get<Paginated<Product>>("/products", {
          params: {
            page: 1,
            size: limit,
            sort: "rating:desc",
          },
          schema: PaginatedSchema(ProductSchema),
        });
        return response.items;
      } else {
        // Use real API - get featured products
        const response = await ProductService.getProducts({
          page: 0,
          size: limit,
          sortBy: "featured",
          sortDirection: "desc",
        });
        return response.items;
      }
    },
    staleTime: 10 * 60 * 1000,
  });
}
