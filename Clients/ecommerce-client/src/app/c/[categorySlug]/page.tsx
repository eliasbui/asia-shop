import { ProductListing } from '@/components/search/ProductListing';

interface CategoryPageProps {
  params: { categorySlug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function CategoryPage({ params, searchParams }: CategoryPageProps) {
  return (
    <ProductListing
      categorySlug={params.categorySlug}
      searchParams={searchParams}
    />
  );
}