import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { CollectionPageClient } from './CollectionPageClient';
import { getCollectionBySlug } from '@/lib/data/collections';

interface CollectionPageProps {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export async function generateMetadata(
  { params }: CollectionPageProps
): Promise<Metadata> {
  const collection = getCollectionBySlug(params.slug);

  if (!collection) {
    return {
      title: 'Collection Not Found | AsiaShop',
      description: 'The collection you\'re looking for doesn\'t exist or has been removed.',
    };
  }

  return {
    title: `${collection.title} | AsiaShop`,
    description: collection.seo.description,
    keywords: collection.seo.keywords,
    openGraph: {
      title: collection.seo.title,
      description: collection.seo.description,
      images: [collection.banner.image],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: collection.seo.title,
      description: collection.seo.description,
      images: [collection.banner.image],
    },
  };
}

export default function CollectionPage({ params }: CollectionPageProps) {
  const collection = getCollectionBySlug(params.slug);

  if (!collection) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Collection Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            The collection you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <a href="/collections">Browse All Collections</a>
          </Button>
        </div>
      </div>
    );
  }

  return <CollectionPageClient collection={collection} />;
}