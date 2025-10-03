'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { Media } from '@/lib/types';

interface ProductImageGalleryProps {
  media: Media[];
  productTitle: string;
}

export function ProductImageGallery({
  media,
  productTitle,
}: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (media.length === 0) {
    return (
      <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
        <span className="text-muted-foreground">No image available</span>
      </div>
    );
  }

  const selectedMedia = media[selectedIndex];

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="aspect-square relative rounded-lg overflow-hidden bg-muted">
        <Image
          src={selectedMedia.url}
          alt={selectedMedia.alt || productTitle}
          fill
          className="object-contain"
          priority
        />
      </div>

      {/* Thumbnails */}
      {media.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {media.map((item, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`
                aspect-square relative rounded-md overflow-hidden border-2 transition-colors
                ${
                  index === selectedIndex
                    ? 'border-primary'
                    : 'border-transparent hover:border-muted-foreground/50'
                }
              `}
            >
              <Image
                src={item.url}
                alt={item.alt || `${productTitle} ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

