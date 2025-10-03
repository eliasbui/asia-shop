'use client';

import { Star } from 'lucide-react';
import { Button } from '@/components/common/button';

interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

interface ProductReviewsProps {
  rating: number;
  reviewCount: number;
  reviews?: Review[];
}

export function ProductReviews({
  rating,
  reviewCount,
  reviews = [],
}: ProductReviewsProps) {
  const ratingDistribution = [
    { stars: 5, count: Math.floor(reviewCount * 0.6) },
    { stars: 4, count: Math.floor(reviewCount * 0.25) },
    { stars: 3, count: Math.floor(reviewCount * 0.1) },
    { stars: 2, count: Math.floor(reviewCount * 0.03) },
    { stars: 1, count: Math.floor(reviewCount * 0.02) },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Customer Reviews</h2>

      {/* Rating Summary */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Overall Rating */}
        <div className="flex flex-col items-center md:items-start">
          <div className="text-5xl font-bold mb-2">{rating.toFixed(1)}</div>
          <div className="flex items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${
                  i < Math.floor(rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            Based on {reviewCount} reviews
          </p>
        </div>

        {/* Rating Distribution */}
        <div className="flex-1 space-y-2">
          {ratingDistribution.map((dist) => (
            <div key={dist.stars} className="flex items-center gap-3">
              <span className="text-sm w-8">{dist.stars}★</span>
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400"
                  style={{
                    width: `${(dist.count / reviewCount) * 100}%`,
                  }}
                />
              </div>
              <span className="text-sm text-muted-foreground w-12 text-right">
                {dist.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Write Review Button */}
      <Button variant="outline" className="w-full md:w-auto">
        Write a Review
      </Button>

      {/* Reviews List */}
      {reviews.length > 0 ? (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b pb-6 last:border-b-0">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{review.author}</span>
                    {review.verified && (
                      <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-2 py-0.5 rounded">
                        Verified Purchase
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">
                  {new Date(review.date).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm">{review.comment}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <p>No reviews yet. Be the first to review this product!</p>
        </div>
      )}
    </div>
  );
}

