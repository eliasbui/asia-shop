"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ProductGrid } from "@/components/product/product-grid";
import { FilterSidebar } from "@/components/search/filter-sidebar";
import { SortDropdown } from "@/components/search/sort-dropdown";
import { Pagination } from "@/components/common/pagination";
import { mockProducts } from "@/lib/api/mock-data";
import type { FilterParams } from "@/lib/types";
import { Search } from "lucide-react";

function SearchPageContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const [filters, setFilters] = useState<FilterParams>({
    q: query,
    page: Number(searchParams.get("page")) || 1,
    size: 24,
    sort: searchParams.get("sort") || "relevance",
  });

  useEffect(() => {
    setFilters((prev) => ({ ...prev, q: query, page: 1 }));
  }, [query]);

  // Search products
  let filteredProducts = mockProducts.filter((p) => {
    if (!query) return true;
    const searchLower = query.toLowerCase();
    return (
      p.title.toLowerCase().includes(searchLower) ||
      p.brand.toLowerCase().includes(searchLower) ||
      p.category.toLowerCase().includes(searchLower) ||
      p.shortDesc?.toLowerCase().includes(searchLower)
    );
  });

  // Apply category filter
  if (filters.category) {
    filteredProducts = filteredProducts.filter(
      (p) => p.category === filters.category
    );
  }

  // Apply brand filter
  if (filters.brand && filters.brand.length > 0) {
    filteredProducts = filteredProducts.filter((p) =>
      filters.brand!.includes(p.brand)
    );
  }

  // Apply price filter
  if (filters.priceMin !== undefined) {
    filteredProducts = filteredProducts.filter(
      (p) => (p.price.sale?.amount || p.price.list.amount) >= filters.priceMin!
    );
  }
  if (filters.priceMax !== undefined) {
    filteredProducts = filteredProducts.filter(
      (p) => (p.price.sale?.amount || p.price.list.amount) <= filters.priceMax!
    );
  }

  // Apply rating filter
  if (filters.rating) {
    filteredProducts = filteredProducts.filter(
      (p) => p.rating >= filters.rating!
    );
  }

  // Apply flash sale filter
  if (filters.flashSale) {
    filteredProducts = filteredProducts.filter((p) =>
      p.badges?.includes("flashSale")
    );
  }

  // Apply sorting
  if (filters.sort) {
    switch (filters.sort) {
      case "price:asc":
        filteredProducts.sort(
          (a, b) =>
            (a.price.sale?.amount || a.price.list.amount) -
            (b.price.sale?.amount || b.price.list.amount)
        );
        break;
      case "price:desc":
        filteredProducts.sort(
          (a, b) =>
            (b.price.sale?.amount || b.price.list.amount) -
            (a.price.sale?.amount || a.price.list.amount)
        );
        break;
      case "rating:desc":
        filteredProducts.sort((a, b) => b.rating - a.rating);
        break;
    }
  }

  // Pagination
  const totalProducts = filteredProducts.length;
  const totalPages = Math.ceil(totalProducts / (filters.size || 24));
  const startIndex = ((filters.page || 1) - 1) * (filters.size || 24);
  const endIndex = startIndex + (filters.size || 24);
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  // Get unique brands and categories
  const brands = Array.from(new Set(mockProducts.map((p) => p.brand))).map(
    (brand) => ({
      value: brand,
      label: brand,
      count: mockProducts.filter((p) => p.brand === brand).length,
    })
  );

  const categories = Array.from(
    new Set(mockProducts.map((p) => p.category))
  ).map((cat) => ({
    value: cat,
    label: cat.charAt(0).toUpperCase() + cat.slice(1),
    count: mockProducts.filter((p) => p.category === cat).length,
  }));

  const handleFilterChange = (newFilters: FilterParams) => {
    setFilters(newFilters);
  };

  const handleSortChange = (sort: string) => {
    setFilters({ ...filters, sort, page: 1 });
  };

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Search className="w-6 h-6 text-muted-foreground" />
          <h1 className="text-3xl font-bold">
            {query ? `Search results for "${query}"` : "All Products"}
          </h1>
        </div>
        <p className="text-muted-foreground">{totalProducts} products found</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="lg:w-64 flex-shrink-0">
          <FilterSidebar
            filters={filters}
            onFilterChange={handleFilterChange}
            brands={brands}
            categories={categories}
            priceRange={{ min: 0, max: 100000000 }}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-muted-foreground">
              Showing {startIndex + 1}-{Math.min(endIndex, totalProducts)} of{" "}
              {totalProducts} products
            </p>
            <SortDropdown value={filters.sort} onChange={handleSortChange} />
          </div>

          {/* Products Grid */}
          {paginatedProducts.length > 0 ? (
            <>
              <ProductGrid products={paginatedProducts} />

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8">
                  <Pagination
                    currentPage={filters.page || 1}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <Search className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg text-muted-foreground mb-2">
                {query
                  ? `No products found for "${query}"`
                  : "No products found"}
              </p>
              <p className="text-sm text-muted-foreground">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-gray-200 h-64 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      }
    >
      <SearchPageContent />
    </Suspense>
  );
}
