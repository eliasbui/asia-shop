'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import {
  Star,
  ThumbsUp,
  ThumbsDown,
  Filter,
  Search,
  Camera,
  Flag,
  Reply,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  Verified,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';

interface ReviewMedia {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
  alt?: string;
}

interface ReviewReply {
  id: string;
  user: {
    name: string;
    avatar?: string;
    role: 'seller' | 'manufacturer';
    verified: boolean;
  };
  content: string;
  date: string;
  helpful: number;
}

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
  media?: ReviewMedia[];
  helpful: number;
  notHelpful: number;
  verifiedPurchase: boolean;
  date: string;
  variant?: string;
  pros?: string[];
  cons?: string[];
  verifiedBuyer?: boolean;
  location?: string;
  helpfulVotes: {
    positive: number;
    negative: number;
  };
  replies?: ReviewReply[];
  isRecommended?: boolean;
}

interface ReviewFilters {
  rating: number | null;
  verifiedPurchase: boolean;
  withImages: boolean;
  withVideo: boolean;
  recommended: boolean;
  sortBy: 'most-relevant' | 'newest' | 'highest-rating' | 'lowest-rating' | 'most-helpful';
}

interface ProductReviewsEnhancedProps {
  productId: string;
  className?: string;
}

// Enhanced mock data
const mockEnhancedReviews: Review[] = [
  {
    id: '1',
    user: { name: 'Nguyễn Văn A', verified: true },
    rating: 5,
    title: 'Rất hài lòng với sản phẩm',
    content: 'Sản phẩm chất lượng tuyệt vời, đúng như mô tả. Camera chụp ảnh đẹp, hiệu năng mạnh mẽ. Giao hàng nhanh, đóng gói cẩn thận.',
    helpful: 23,
    notHelpful: 1,
    verifiedPurchase: true,
    verifiedBuyer: true,
    date: '2024-01-15',
    variant: 'Titanium Blue, 256GB',
    location: 'Hà Nội',
    isRecommended: true,
    pros: ['Chất lượng sản phẩm', 'Giao hàng nhanh', 'Đóng gói tốt'],
    cons: ['Giá hơi cao'],
    helpfulVotes: { positive: 23, negative: 1 },
    media: [
      {
        id: '1',
        type: 'image',
        url: '/review-image-1.jpg',
        alt: 'Product photo'
      }
    ],
    replies: [
      {
        id: '1',
        user: {
          name: 'Shop Chính Hãng',
          role: 'seller',
          verified: true
        },
        content: 'Cảm ơn bạn đã đánh giá sản phẩm của chúng tôi. Chúng tôi rất vui khi bạn hài lòng với sản phẩm!',
        date: '2024-01-16',
        helpful: 5
      }
    ]
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
    verifiedBuyer: true,
    date: '2024-01-12',
    variant: 'Titanium Natural, 256GB',
    location: 'TP. Hồ Chí Minh',
    isRecommended: true,
    pros: ['Hiệu năng tốt', 'Thiết kế đẹp'],
    cons: ['Giá cao', 'Pin không quá lâu'],
    helpfulVotes: { positive: 15, negative: 3 },
    media: [
      {
        id: '2',
        type: 'video',
        url: '/review-video-1.mp4',
        thumbnail: '/review-video-thumb-1.jpg',
        alt: 'Product video review'
      }
    ]
  }
];

export function ProductReviewsEnhanced({ productId, className = '' }: ProductReviewsEnhancedProps) {
  const t = useTranslations('product.reviews');
  const [filters, setFilters] = useState<ReviewFilters>({
    rating: null,
    verifiedPurchase: false,
    withImages: false,
    withVideo: false,
    recommended: false,
    sortBy: 'most-relevant'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedReviews, setExpandedReviews] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);

  const averageRating = mockEnhancedReviews.reduce((sum, review) => sum + review.rating, 0) / mockEnhancedReviews.length;

  const filteredReviews = mockEnhancedReviews.filter(review => {
    // Search filter
    if (searchTerm && !review.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !review.content.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    // Rating filter
    if (filters.rating && review.rating !== filters.rating) {
      return false;
    }

    // Verified purchase filter
    if (filters.verifiedPurchase && !review.verifiedPurchase) {
      return false;
    }

    // Media filters
    if (filters.withImages && (!review.media || !review.media.some(m => m.type === 'image'))) {
      return false;
    }

    if (filters.withVideo && (!review.media || !review.media.some(m => m.type === 'video'))) {
      return false;
    }

    // Recommended filter
    if (filters.recommended && !review.isRecommended) {
      return false;
    }

    return true;
  });

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: mockEnhancedReviews.filter(r => r.rating === rating).length,
    percentage: (mockEnhancedReviews.filter(r => r.rating === rating).length / mockEnhancedReviews.length) * 100
  }));

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

  const toggleReviewExpanded = (reviewId: string) => {
    const newExpanded = new Set(expandedReviews);
    if (newExpanded.has(reviewId)) {
      newExpanded.delete(reviewId);
    } else {
      newExpanded.add(reviewId);
    }
    setExpandedReviews(newExpanded);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Rating Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">{averageRating.toFixed(1)}</div>
              {renderStars(Math.round(averageRating), 'w-8 h-8')}
              <p className="text-muted-foreground mt-2">
                Based on {mockEnhancedReviews.length} reviews
              </p>
              <div className="flex items-center justify-center space-x-1 mt-2">
                <Shield className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-600">Verified Reviews</span>
              </div>
            </div>

            <div className="space-y-2">
              {ratingDistribution.map(({ rating, count, percentage }) => (
                <div key={rating} className="flex items-center space-x-3">
                  <span className="text-sm w-3">{rating}</span>
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-8 text-right">
                    {count}
                  </span>
                </div>
              ))}

              <div className="mt-4 pt-4 border-t">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg font-semibold text-green-600">
                      {mockEnhancedReviews.filter(r => r.isRecommended).length}%
                    </div>
                    <div className="text-xs text-muted-foreground">Recommended</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold">
                      {mockEnhancedReviews.filter(r => r.verifiedPurchase).length}
                    </div>
                    <div className="text-xs text-muted-foreground">Verified</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold">
                      {mockEnhancedReviews.filter(r => r.media?.length).length}
                    </div>
                    <div className="text-xs text-muted-foreground">With Media</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search reviews..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filter Toggle */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="w-full justify-between"
            >
              <span>Filters</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </Button>

            {/* Filters */}
            {showFilters && (
              <div className="space-y-4 pt-4 border-t">
                {/* Rating Filter */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Rating</label>
                  <div className="flex flex-wrap gap-2">
                    {[5, 4, 3, 2, 1].map(rating => (
                      <Button
                        key={rating}
                        variant={filters.rating === rating ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFilters(prev => ({ ...prev, rating: prev.rating === rating ? null : rating }))}
                        className="flex items-center space-x-1"
                      >
                        <Star className="w-3 h-3" />
                        <span>{rating}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Additional Filters */}
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={filters.verifiedPurchase ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilters(prev => ({ ...prev, verifiedPurchase: !prev.verifiedPurchase }))}
                  >
                    Verified Purchase
                  </Button>
                  <Button
                    variant={filters.withImages ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilters(prev => ({ ...prev, withImages: !prev.withImages }))}
                  >
                    <Camera className="w-3 h-3 mr-1" />
                    With Images
                  </Button>
                  <Button
                    variant={filters.withVideo ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilters(prev => ({ ...prev, withVideo: !prev.withVideo }))}
                  >
                    With Video
                  </Button>
                  <Button
                    variant={filters.recommended ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilters(prev => ({ ...prev, recommended: !prev.recommended }))}
                  >
                    Recommended
                  </Button>
                </div>

                {/* Sort */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Sort by</label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="most-relevant">Most Relevant</option>
                    <option value="newest">Newest First</option>
                    <option value="highest-rating">Highest Rating</option>
                    <option value="lowest-rating">Lowest Rating</option>
                    <option value="most-helpful">Most Helpful</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-6">
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
                          <Verified className="w-4 h-4 text-blue-600" />
                        )}
                        {review.verifiedBuyer && (
                          <Badge variant="secondary" className="text-xs">
                            Verified Buyer
                          </Badge>
                        )}
                        {review.isRecommended && (
                          <Badge variant="default" className="text-xs bg-green-100 text-green-800">
                            Recommended
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        {renderStars(review.rating)}
                        <span className="text-sm text-muted-foreground">
                          {new Date(review.date).toLocaleDateString()}
                        </span>
                        {review.location && (
                          <span className="text-sm text-muted-foreground">
                            • {review.location}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Flag className="h-4 w-4 mr-2" />
                        Report
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Review Content */}
                <div>
                  <h4 className="font-medium mb-2">{review.title}</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {expandedReviews.has(review.id) || review.content.length <= 200
                      ? review.content
                      : `${review.content.substring(0, 200)}...`}
                  </p>

                  {review.content.length > 200 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleReviewExpanded(review.id)}
                      className="mt-2 p-0 h-auto text-primary"
                    >
                      {expandedReviews.has(review.id) ? (
                        <>
                          Show less <ChevronUp className="h-3 w-3 ml-1" />
                        </>
                      ) : (
                        <>
                          Read more <ChevronDown className="h-3 w-3 ml-1" />
                        </>
                      )}
                    </Button>
                  )}

                  {review.variant && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Variant: {review.variant}
                    </p>
                  )}

                  {/* Pros and Cons */}
                  {(review.pros || review.cons) && (
                    <div className="mt-4 grid md:grid-cols-2 gap-4">
                      {review.pros && review.pros.length > 0 && (
                        <div>
                          <h5 className="text-sm font-medium text-green-600 mb-2">Pros:</h5>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {review.pros.map((pro, index) => (
                              <li key={index} className="flex items-start">
                                <span className="text-green-600 mr-2">+</span>
                                {pro}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {review.cons && review.cons.length > 0 && (
                        <div>
                          <h5 className="text-sm font-medium text-red-600 mb-2">Cons:</h5>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {review.cons.map((con, index) => (
                              <li key={index} className="flex items-start">
                                <span className="text-red-600 mr-2">-</span>
                                {con}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Review Media */}
                {review.media && review.media.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium">Media</h5>
                    <div className="flex space-x-2 overflow-x-auto">
                      {review.media.map((media) => (
                        <div key={media.id} className="flex-shrink-0">
                          {media.type === 'image' ? (
                            <div className="relative w-20 h-20 rounded-lg overflow-hidden border">
                              <Image
                                src={media.url}
                                alt={media.alt}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="relative w-20 h-20 rounded-lg overflow-hidden border">
                              <Image
                                src={media.thumbnail || '/video-placeholder.jpg'}
                                alt={media.alt}
                                fill
                                className="object-cover"
                              />
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                <Camera className="w-6 h-6 text-white" />
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Replies */}
                {review.replies && review.replies.length > 0 && (
                  <div className="space-y-3 border-l-2 border-gray-200 pl-4">
                    {review.replies.map((reply) => (
                      <div key={reply.id} className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-medium text-sm">{reply.user.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {reply.user.role === 'seller' ? 'Seller' : 'Brand'}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(reply.date).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{reply.content}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Button variant="ghost" size="sm" className="text-xs h-auto p-0">
                            Helpful ({reply.helpful})
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Review Actions */}
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                      <ThumbsUp className="w-4 h-4" />
                      <span>Helpful ({review.helpfulVotes.positive})</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                      <ThumbsDown className="w-4 h-4" />
                      <span>Not Helpful ({review.helpfulVotes.negative})</span>
                    </Button>
                  </div>
                  <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                    <Reply className="w-4 h-4" />
                    <span>Reply</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center">
        <Button variant="outline">
          Load More Reviews
        </Button>
      </div>
    </div>
  );
}