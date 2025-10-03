import Image from 'next/image';
import { Link } from './link';
import { Card } from './card';

interface CategoryCardProps {
  slug: string;
  name: string;
  image: string;
  productCount?: number;
}

export function CategoryCard({ slug, name, image, productCount }: CategoryCardProps) {
  return (
    <Link href={`/c/${slug}`}>
      <Card className="group overflow-hidden hover:shadow-lg transition-shadow">
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover transition-transform group-hover:scale-110"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
        </div>
        <div className="p-4 text-center">
          <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
            {name}
          </h3>
          {productCount !== undefined && (
            <p className="text-sm text-muted-foreground mt-1">
              {productCount} products
            </p>
          )}
        </div>
      </Card>
    </Link>
  );
}

interface CategoriesGridProps {
  categories: Array<{
    slug: string;
    name: string;
    image: string;
    productCount?: number;
  }>;
}

export function CategoriesGrid({ categories }: CategoriesGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {categories.map((category) => (
        <CategoryCard key={category.slug} {...category} />
      ))}
    </div>
  );
}

