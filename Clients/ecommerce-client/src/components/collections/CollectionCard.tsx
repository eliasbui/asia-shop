'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { CollectionCardProps } from '@/lib/types/collections';
import { cn } from '@/lib/utils/cn';

export function CollectionCard({
  collection,
  className = ''
}: CollectionCardProps) {
  const {
    slug,
    title,
    shortDesc,
    banner,
    theme,
    metadata
  } = collection;

  return (
    <Link
      href={`/collections/${slug}`}
      className={cn(
        'group relative overflow-hidden rounded-lg border bg-white shadow-sm hover:shadow-xl transition-all duration-300',
        className
      )}
    >
      {/* Image Container */}
      <div className="relative h-64 md:h-72 overflow-hidden">
        <Image
          src={banner.image}
          alt={banner.alt}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Overlay */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `linear-gradient(135deg, ${theme.primaryColor}88 0%, ${theme.secondaryColor}88 100%)`
          }}
        />

        {/* Featured Badge */}
        {metadata.featured && (
          <div className="absolute top-4 left-4">
            <Badge
              style={{ backgroundColor: theme.primaryColor }}
              className="text-white"
            >
              Featured
            </Badge>
          </div>
        )}

        {/* Product Count */}
        <div className="absolute top-4 right-4">
          <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
            {metadata.productCount} items
          </div>
        </div>

        {/* Shop Now Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            variant="secondary"
            className="bg-white text-gray-900 hover:bg-gray-100"
          >
            Shop Now
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary transition-colors">
            {title}
          </h3>
          {metadata.season && (
            <Badge variant="outline" className="text-xs">
              {metadata.season}
            </Badge>
          )}
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {shortDesc}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {metadata.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded"
            >
              #{tag}
            </span>
          ))}
          {metadata.tags.length > 3 && (
            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
              +{metadata.tags.length - 3} more
            </span>
          )}
        </div>

        {/* Color Indicators */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div
              className="w-4 h-4 rounded-full border border-gray-300"
              style={{ backgroundColor: theme.primaryColor }}
            />
            <div
              className="w-4 h-4 rounded-full border border-gray-300"
              style={{ backgroundColor: theme.secondaryColor }}
            />
          </div>
          <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    </Link>
  );
}