'use client';

import { useState } from 'react';
import { Star, ThumbsUp, ThumbsDown, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Review {
  id: string;
  user: {
    name: string;
    avatar?: string;
    verified: boolean;
  };
  rating: number;
  title: string;
  content: string;
  images?: string[];
  helpful: number;
  notHelpful: number;
  verifiedPurchase: boolean;
  date: string;
  variant?: string;
}

interface ProductReviewsProps {
  productId: string;
}

// Mock data
const mockReviews: Review[] = [
  {
    id: '1',
    user: { name: 'Nguyễn Văn A', verified: true },
    rating: 5,
    title: 'Rất hài lòng với sản phẩm',
    content: 'Sản phẩm chất lượng tuyệt vời, đúng như mô tả. Camera chụp ảnh đẹp, hiệu năng mạnh mẽ. Giao hàng nhanh, đóng gói cẩn thận.',
    helpful: 23,
    notHelpful: 1,
    verifiedPurchase: true,
    date: '2024-01-15',
    variant: 'Titanium Blue, 256GB'
  },
  {
    id: '2',
    user: { name: 'Trần Thị B', verified: false },
    rating: 4,
    title: 'Tốt nhưng có thể tốt hơn',
    content: 'Sản phẩm dùng tốt, pin dùng được 1 ngày. Chỉ có điểm chưa hài lòng là giá hơi cao so với cấu hình.',
    helpful: 15,
    notHelpful: 3,
    verifiedPurchase: true,
    date: '2024-01-12',
    variant: 'Titanium Natural, 256GB'
  },
  {
    id: '3',
    user: { name: 'Lê Văn C', verified: true },
    rating: 5,
    title: 'Xứng đáng 5 sao',
    content: 'Máy chạy mượt mà, không bị giật lag. Màn hình sắc nét, loa nghe hay. Rất đáng để đầu tư.',
    helpful: 8,
    notHelpful: 0,
    verifiedPurchase: true,
    date: '2024-01-10',
    variant: 'Titanium White, 256GB'
  }
];

const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
  rating,
  count: mockReviews.filter(r => r.rating === rating).length,
  percentage: (mockReviews.filter(r => r.rating === rating).length / mockReviews.length) * 100
}));

export function ProductReviews({ productId }: ProductReviewsProps) {
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState('most-relevant');

  const averageRating = mockReviews.reduce((sum, review) => sum + review.rating, 0) / mockReviews.length;

  const filteredReviews = selectedRating
    ? mockReviews.filter(review => review.rating === selectedRating)
    : mockReviews;

  const renderStars = (rating: number, size = 'w-4 h-4') => {
    return (
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`${size} ${
              i < rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <Card className="p-6">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="text-center">
            <div className="text-5xl font-bold mb-2">{averageRating.toFixed(1)}</div>
            {renderStars(Math.round(averageRating), 'w-8 h-8')}
            <p className="text-muted-foreground mt-2">
              Dựa trên {mockReviews.length} đánh giá
            </p>
          </div>

          <div className="space-y-2">
            {ratingDistribution.map(({ rating, count, percentage }) => (
              <div key={rating} className="flex items-center space-x-3">
                <span className="text-sm w-3">{rating}</span>
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-muted-foreground w-8 text-right">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Filters and Sort */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedRating === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedRating(null)}
          >
            Tất cả
          </Button>
          {[5, 4, 3, 2, 1].map(rating => (
            <Button
              key={rating}
              variant={selectedRating === rating ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedRating(rating)}
              className="flex items-center space-x-1"
            >
              <Star className="w-3 h-3" />
              <span>{rating}</span>
            </Button>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border rounded-lg px-3 py-1 text-sm"
          >
            <option value="most-relevant">Phù hợp nhất</option>
            <option value="newest">Mới nhất</option>
            <option value="highest-rating">Đánh giá cao nhất</option>
            <option value="lowest-rating">Đánh giá thấp nhất</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <Card key={review.id} className="p-6">
            <div className="space-y-4">
              {/* Review Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    {review.user.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{review.user.name}</span>
                      {review.user.verified && (
                        <Badge variant="secondary" className="text-xs">
                          Đã xác minh
                        </Badge>
                      )}
                      {review.verifiedPurchase && (
                        <Badge variant="outline" className="text-xs">
                          Đã mua hàng
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      {renderStars(review.rating)}
                      <span className="text-sm text-muted-foreground">
                        {new Date(review.date).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Review Content */}
              <div>
                <h4 className="font-medium mb-2">{review.title}</h4>
                <p className="text-muted-foreground">{review.content}</p>
                {review.variant && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Phân loại: {review.variant}
                  </p>
                )}
              </div>

              {/* Review Actions */}
              <div className="flex items-center space-x-4 pt-2 border-t">
                <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                  <ThumbsUp className="w-4 h-4" />
                  <span>Hữu ích ({review.helpful})</span>
                </Button>
                <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                  <ThumbsDown className="w-4 h-4" />
                  <span>Không hữu ích ({review.notHelpful})</span>
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center">
        <Button variant="outline">
          Xem thêm đánh giá
        </Button>
      </div>
    </div>
  );
}