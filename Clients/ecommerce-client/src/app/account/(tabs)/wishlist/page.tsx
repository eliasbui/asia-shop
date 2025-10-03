'use client';

import { useEffect, useState } from 'react';
import { useAccountStore } from '@/lib/state/accountStore';
import { useCartStore } from '@/lib/state/cartStore';
import { WishlistGrid } from '@/components/account/WishlistGrid';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Heart,
  Search,
  Filter,
  ShoppingCart,
  RefreshCw,
  Grid3X3,
  List
} from 'lucide-react';
import { WishlistItem } from '@/lib/types/account';

export default function AccountWishlistPage() {
  const {
    wishlist,
    fetchWishlist,
    addToWishlist,
    removeFromWishlist,
    moveToCart,
    isLoading,
    error
  } = useAccountStore();

  const { addItem, isInCart } = useCartStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<string>('date-desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const filteredAndSortedWishlist = wishlist
    .filter(item => {
      return item.product.name.toLowerCase().includes(searchTerm.toLowerCase());
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
        case 'date-asc':
          return new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime();
        case 'price-desc':
          return b.product.price - a.product.price;
        case 'price-asc':
          return a.product.price - b.product.price;
        case 'name-asc':
          return a.product.name.localeCompare(b.product.name);
        case 'name-desc':
          return b.product.name.localeCompare(a.product.name);
        default:
          return 0;
      }
    });

  const handleAddToCart = async (item: WishlistItem) => {
    try {
      // Create a mock product and variant for the cart
      const mockProduct = {
        id: item.product.id,
        name: item.product.name,
        slug: item.product.slug,
        description: '',
        price: {
          list: { amount: item.product.price, currency: 'USD' },
          sale: item.product.originalPrice ? { amount: item.product.price, currency: 'USD' } : undefined
        },
        images: [{ url: item.product.image, alt: item.product.name }],
        inStock: item.product.inStock,
        categories: [],
        tags: [],
        variants: [{
          id: item.variantId || 'default',
          name: 'Default',
          sku: 'DEFAULT',
          price: {
            list: { amount: item.product.price, currency: 'USD' },
            sale: item.product.originalPrice ? { amount: item.product.price, currency: 'USD' } : undefined
          },
          inStock: item.product.inStock,
          image: item.product.image
        }]
      };

      const mockVariant = mockProduct.variants[0];

      // Add to cart
      addItem(mockProduct, mockVariant, 1);

      // Remove from wishlist
      await removeFromWishlist(item.id);
    } catch (error) {
      console.error('Failed to add item to cart:', error);
    }
  };

  const handleRemoveFromWishlist = async (itemId: string) => {
    try {
      await removeFromWishlist(itemId);
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
    }
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <Alert variant="destructive" className="max-w-md mx-auto mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={fetchWishlist}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Thử lại
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Danh sách yêu thích</h1>
          <p className="text-muted-foreground">
            Quản lý các sản phẩm bạn quan tâm và muốn mua sau.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={fetchWishlist} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Làm mới
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <Heart className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">{wishlist.length}</div>
              <div className="text-sm text-muted-foreground">Sản phẩm yêu thích</div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <ShoppingCart className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">
                {wishlist.filter(item => item.product.inStock).length}
              </div>
              <div className="text-sm text-muted-foreground">Còn hàng</div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Heart className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">
                {wishlist.filter(item => !isInCart(item.product.id, item.variantId || 'default')).length}
              </div>
              <div className="text-sm text-muted-foreground">Chưa trong giỏ</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Sort */}
          <div className="w-full lg:w-48">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sắp xếp" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date-desc">Mới nhất</SelectItem>
                <SelectItem value="date-asc">Cũ nhất</SelectItem>
                <SelectItem value="price-desc">Giá giảm dần</SelectItem>
                <SelectItem value="price-asc">Giá tăng dần</SelectItem>
                <SelectItem value="name-asc">Tên A-Z</SelectItem>
                <SelectItem value="name-desc">Tên Z-A</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* View Mode */}
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Wishlist Grid/List */}
      {filteredAndSortedWishlist.length === 0 ? (
        <Card className="p-12 text-center">
          <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            {searchTerm ? 'Không tìm thấy sản phẩm nào' : 'Danh sách yêu thích trống'}
          </h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm
              ? 'Thử tìm kiếm với từ khóa khác'
              : 'Thêm sản phẩm vào danh sách yêu thích để không bỏ lỡ các món hàng bạn thích.'
            }
          </p>
          {searchTerm ? (
            <Button
              variant="outline"
              onClick={() => setSearchTerm('')}
            >
              Xóa tìm kiếm
            </Button>
          ) : (
            <Button>
              Khám phá sản phẩm
            </Button>
          )}
        </Card>
      ) : (
        <WishlistGrid
          items={filteredAndSortedWishlist}
          viewMode={viewMode}
          onAddToCart={handleAddToCart}
          onRemove={handleRemoveFromWishlist}
          isInCart={(productId, variantId) => isInCart(productId, variantId || 'default')}
        />
      )}

      {/* Tips */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <div className="flex items-start space-x-3">
          <Heart className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-semibold mb-2">Mẹo sử dụng danh sách yêu thích</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Thêm sản phẩm vào danh sách yêu thích để theo dõi giá và khuyến mãi</li>
              <li>• Nhận thông báo khi sản phẩm bạn thích giảm giá</li>
              <li>• Dễ dàng thêm sản phẩm vào giỏ hàng khi sẵn sàng mua</li>
              <li>• Chia sẻ danh sách yêu thích với bạn bè và gia đình</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}