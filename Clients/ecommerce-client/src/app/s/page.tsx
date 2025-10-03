import { ProductListing } from '@/components/search/ProductListing';

interface SearchPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  return (
    <ProductListing
      searchParams={searchParams}
    />
  );
}