'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Filter, Grid, List, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ProductCard } from '@/components/product/ProductCard';
import { FacetFilter } from '@/components/search/FacetFilter';
import { SortDropdown } from '@/components/search/SortDropdown';
import { Pagination } from '@/components/common/Pagination';
import { Product, Paginated } from '@/lib/types/domain';

interface ProductListingProps {
  categorySlug?: string;
  searchParams?: { [key: string]: string | string[] | undefined };
}

// Mock data - would come from API
const mockProducts: Product[] = Array.from({ length: 24 }, (_, i) => ({
  id: `product-${i + 1}`,
  slug: `product-${i + 1}`,
  title: `Sản phẩm ${i + 1}`,
  brand: ['Apple', 'Samsung', 'Sony', 'Xiaomi', 'Dell'][i % 5],
  category: 'smartphones',
  attributes: {},
  media: [{ url: '/placeholder-product.jpg', alt: `Product ${i + 1}` }],
  rating: 4 + (i % 2) * 0.5,
  reviewCount: 50 + (i * 10),
  price: {
    list: { currency: 'VND', amount: 10000000 + (i * 1000000) },
    sale: i % 3 === 0 ? { currency: 'VND', amount: 9000000 + (i * 900000) } : undefined,
    percentOff: i % 3 === 0 ? 10 : undefined
  },
  badges: i % 4 === 0 ? ['new', 'bestseller'] : i % 3 === 0 ? ['flashSale'] : undefined,
  variants: [{
    id: `variant-${i + 1}`,
    sku: `SKU-${i + 1}`,
    attributes: { color: 'Black', storage: '256GB' },
    stock: { status: i % 10 === 0 ? 'out-of-stock' : 'in-stock', qty: 20 }
  }]
}));

const mockFacets = {
  brand: [
    { value: 'apple', label: 'Apple', count: 145 },
    { value: 'samsung', label: 'Samsung', count: 98 },
    { value: 'sony', label: 'Sony', count: 67 },
    { value: 'xiaomi', label: 'Xiaomi', count: 54 },
    { value: 'dell', label: 'Dell', count: 32 }
  ],
  price: [
    { value: '0-5000000', label: 'Dưới 5 triệu', count: 89 },
    { value: '5000000-10000000', label: '5 - 10 triệu', count: 156 },
    { value: '10000000-20000000', label: '10 - 20 triệu', count: 203 },
    { value: '20000000-50000000', label: '20 - 50 triệu', count: 87 },
    { value: '50000000+', label: 'Trên 50 triệu', count: 45 }
  ],
  rating: [
    { value: '4', label: '4 sao trở lên', count: 324 },
    { value: '3', label: '3 sao trở lên', count: 412 },
    { value: '2', label: '2 sao trở lên', count: 456 }
  ],
  availability: [
    { value: 'in-stock', label: 'Còn hàng', count: 489 },
    { value: 'sale', label: 'Đang giảm giá', count: 156 }
  ]
};

export function ProductListing({ categorySlug, searchParams }: ProductListingProps) {
  const t = useTranslations('common');
  const searchParamsFromUrl = useSearchParams();
  const router = useRouter();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(156);

  const currentPage = Number(searchParamsFromUrl.get('page')) || 1;
  const pageSize = 24;
  const totalPages = Math.ceil(totalCount / pageSize);

  const activeFilters = {
    brand: searchParamsFromUrl.get('brand')?.split(',') || [],
    price: searchParamsFromUrl.get('price')?.split(',') || [],
    rating: searchParamsFromUrl.get('rating')?.split(',') || [],
    availability: searchParamsFromUrl.get('availability')?.split(',') || []
  };

  const updateUrl = (newParams: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParamsFromUrl);

    Object.entries(newParams).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleFilterChange = (facet: string, value: string, checked: boolean) => {
    const currentFilters = activeFilters[facet as keyof typeof activeFilters];
    const newFilters = checked
      ? [...currentFilters, value]
      : currentFilters.filter((f: string) => f !== value);

    updateUrl(facet, newFilters.length > 0 ? newFilters.join(',') : null);
  };

  const handleSortChange = (sort: string) => {
    updateUrl('sort', sort);
  };

  const clearAllFilters = () => {
    updateUrl('brand', null);
    updateUrl('price', null);
    updateUrl('rating', null);
    updateUrl('availability', null);
  };

  const hasActiveFilters = Object.values(activeFilters).some(filters => filters.length > 0);

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
        <a href="/" className="hover:text-foreground">Trang chủ</a>
        <span>/</span>
        {categorySlug ? (
          <>
            <a href="/c/all" className="hover:text-foreground">Sản phẩm</a>
            <span>/</span>
            <span className="text-foreground capitalize">{categorySlug}</span>
          </>
        ) : (
          <span className="text-foreground">Tìm kiếm</span>
        )}
      </div>

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">
            {categorySlug ? `Danh mục: ${categorySlug}` : 'Tìm kiếm sản phẩm'}
          </h1>
          <p className="text-muted-foreground">
            Tìm thấy {totalCount.toLocaleString()} sản phẩm
          </p>
        </div>

        <div className="flex items-center space-x-4 mt-4 lg:mt-0">
          {/* View Mode Toggle */}
          <div className="hidden sm:flex items-center border rounded-lg">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="rounded-r-none"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          {/* Sort Dropdown */}
          <SortDropdown onSortChange={handleSortChange} />

          {/* Mobile Filter Trigger */}
          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="lg:hidden">
                <Filter className="h-4 w-4 mr-2" />
                Bộ lọc
                {hasActiveFilters && (
                  <Badge variant="secondary" className="ml-2">
                    {Object.values(activeFilters).reduce((sum, filters) => sum + filters.length, 0)}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Bộ lọc</h2>
                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                    Xóa tất cả
                  </Button>
                )}
              </div>
              <div className="space-y-6">
                {Object.entries(mockFacets).map(([facet, options]) => (
                  <FacetFilter
                    key={facet}
                    facet={facet}
                    options={options}
                    selectedValues={activeFilters[facet as keyof typeof activeFilters]}
                    onChange={(value, checked) => handleFilterChange(facet, value, checked)}
                  />
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="text-sm text-muted-foreground">Bộ lọc đang áp dụng:</span>
          {Object.entries(activeFilters).map(([facet, values]) =>
            values.map((value: string) => {
              const option = mockFacets[facet as keyof typeof mockFacets]?.find(opt => opt.value === value);
              return option ? (
                <Badge key={`${facet}-${value}`} variant="secondary" className="flex items-center gap-1">
                  {option.label}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => handleFilterChange(facet, value, false)}
                  />
                </Badge>
              ) : null;
            })
          )}
          <Button variant="ghost" size="sm" onClick={clearAllFilters}>
            Xóa tất cả
          </Button>
        </div>
      )}

      <div className="flex gap-6">
        {/* Desktop Filters Sidebar */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Bộ lọc</h2>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                  Xóa tất cả
                </Button>
              )}
            </div>
            <div className="space-y-6">
              {Object.entries(mockFacets).map(([facet, options]) => (
                <FacetFilter
                  key={facet}
                  facet={facet}
                  options={options}
                  selectedValues={activeFilters[facet as keyof typeof activeFilters]}
                  onChange={(value, checked) => handleFilterChange(facet, value, checked)}
                />
              ))}
            </div>
          </Card>
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          <div className={`grid gap-4 ${
            viewMode === 'grid'
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              : 'grid-cols-1'
          }`}>
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                className={viewMode === 'list' ? 'flex flex-row' : ''}
              />
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-8">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => updateUrl('page', page.toString())}
            />
          </div>
        </div>
      </div>
    </div>
  );
}