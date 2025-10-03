'use client';

import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CollectionHeroProps } from '@/lib/types/collections';
import { formatCurrency } from '@/lib/utils/format';

export function CollectionHero({
  collection,
  productCount = 0
}: CollectionHeroProps) {
  const {
    title,
    description,
    shortDesc,
    banner,
    theme,
    metadata
  } = collection;

  return (
    <div
      className="relative w-full h-96 md:h-[500px] overflow-hidden"
      style={{
        backgroundColor: theme.backgroundColor || '#f9fafb'
      }}
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <Image
          src={banner.image}
          alt={banner.alt}
          fill
          className="object-cover"
          priority
        />
        {banner.overlayColor && (
          <div
            className="absolute inset-0"
            style={{ backgroundColor: banner.overlayColor }}
          />
        )}
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            {/* Breadcrumb and Meta */}
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {metadata.featured && (
                <Badge
                  style={{ backgroundColor: theme.primaryColor }}
                  className="text-white"
                >
                  Featured Collection
                </Badge>
              )}
              {metadata.season && (
                <Badge variant="outline" className="bg-white/90">
                  {metadata.season.charAt(0).toUpperCase() + metadata.season.slice(1)} Collection
                </Badge>
              )}
              <div className="text-sm text-white bg-black/20 backdrop-blur-sm px-3 py-1 rounded-full">
                {productCount} Products
              </div>
            </div>

            {/* Title */}
            <h1
              className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg"
              style={{
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
              }}
            >
              {title}
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-white mb-6 max-w-2xl drop-shadow-md">
              {shortDesc}
            </p>

            {/* Full Description for larger screens */}
            <p className="text-white/90 mb-8 max-w-2xl hidden md:block drop-shadow">
              {description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {metadata.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-sm rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Call to Action */}
            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                className="text-white border-white hover:bg-white hover:text-black transition-colors"
                variant="outline"
                style={{
                  borderColor: theme.secondaryColor,
                  color: theme.secondaryColor
                }}
              >
                Shop Collection
              </Button>
              <Button
                size="lg"
                style={{
                  backgroundColor: theme.primaryColor,
                  color: 'white'
                }}
                className="hover:opacity-90 transition-opacity"
              >
                View Lookbook
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Gradient Fade at Bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none" />
    </div>
  );
}