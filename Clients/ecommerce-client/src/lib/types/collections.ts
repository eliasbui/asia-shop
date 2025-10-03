import { Product } from './domain';

export type Collection = {
  id: string;
  slug: string;
  title: string;
  description: string;
  shortDesc: string;
  banner: {
    image: string;
    alt: string;
    overlayColor?: string;
  };
  theme: {
    primaryColor: string;
    secondaryColor: string;
    backgroundColor?: string;
  };
  metadata: {
    productCount: number;
    featured: boolean;
    tags: string[];
    season?: 'spring' | 'summer' | 'fall' | 'winter' | 'year-round';
    targetAudience?: string[];
  };
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
  filters?: CollectionFilter[];
  curatedProducts?: string[];
  createdAt: string;
  updatedAt: string;
};

export type CollectionFilter = {
  id: string;
  type: 'range' | 'select' | 'checkbox';
  name: string;
  field: string;
  options?: {
    label: string;
    value: string;
    count?: number;
  }[];
  min?: number;
  max?: number;
  step?: number;
};

export type CollectionCardProps = {
  collection: Collection;
  className?: string;
};

export type CollectionHeroProps = {
  collection: Collection;
  productCount?: number;
};

export type CollectionGridProps = {
  products: Product[];
  columns?: number;
  className?: string;
};

export type CollectionFiltersProps = {
  filters: CollectionFilter[];
  activeFilters: Record<string, any>;
  onFilterChange: (filters: Record<string, any>) => void;
  className?: string;
};

export type CollectionWithProducts = Collection & {
  products: Product[];
  pagination: {
    page: number;
    size: number;
    total: number;
    totalPages: number;
  };
};