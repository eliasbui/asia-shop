'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Star, ShoppingCart, Heart, Truck, Shield, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Product } from '@/lib/types/domain';
import { formatCurrency, formatRelativeTime } from '@/lib/utils/format';
import { ImageGallery } from './ImageGallery';
import { VariantSelector } from './VariantSelector';
import { ProductReviews } from './ProductReviews';

interface ProductDetailProps {
  product: Product;
}

export function ProductDetail({ product }: ProductDetailProps) {
  const t = useTranslations('product');
  const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0] || null);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleVariantChange = (variant: Product['variants'][0]) => {
    setSelectedVariant(variant);
  };

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    // Add to cart logic here
    console.log('Adding to cart:', { product, variant: selectedVariant, quantity });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    // Navigate to checkout
  };

  const renderPrice = () => {
    const price = selectedVariant?.price || product.price;
    const { list, sale, flashSale } = price;

    return (
      <div className="space-y-2">
        <div className="flex items-center space-x-3">
          <span className="text-3xl font-bold text-red-600">
            {formatCurrency(sale?.amount || list.amount, list.currency)}
          </span>
          {sale && (
            <span className="text-xl text-muted-foreground line-through">
              {formatCurrency(list.amount, list.currency)}
            </span>
          )}
        </div>

        {sale && (
          <div className="flex items-center space-x-2">
            <Badge variant="destructive">
              Giảm {price.percentOff}%
            </Badge>
            {flashSale && (
              <Badge variant="outline" className="text-red-600 border-red-600">
                Flash Sale - Kết thúc {formatRelativeTime(flashSale.endsAt)}
              </Badge>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderStockStatus = () => {
    if (!selectedVariant?.stock) return null;

    const { status, qty } = selectedVariant.stock;
    const statusConfig = {
      'in-stock': { text: 'Còn hàng', color: 'text-green-600', bgColor: 'bg-green-50' },
      'low-stock': { text: `Chỉ còn ${qty} sản phẩm`, color: 'text-orange-600', bgColor: 'bg-orange-50' },
      'out-of-stock': { text: 'Hết hàng', color: 'text-red-600', bgColor: 'bg-red-50' }
    };

    const config = statusConfig[status];
    return (
      <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${config.bgColor}`}>
        <div className={`w-2 h-2 rounded-full ${status === 'in-stock' ? 'bg-green-600' : status === 'low-stock' ? 'bg-orange-600' : 'bg-red-600'}`} />
        <span className={`text-sm font-medium ${config.color}`}>{config.text}</span>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
        <a href="/" className="hover:text-foreground">Trang chủ</a>
        <span>/</span>
        <a href="/c/all" className="hover:text-foreground">Sản phẩm</a>
        <span>/</span>
        <a href={`/c/${product.category}`} className="hover:text-foreground capitalize">{product.category}</a>
        <span>/</span>
        <span className="text-foreground">{product.title}</span>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-12">
        {/* Image Gallery */}
        <div>
          <ImageGallery
            images={product.media}
            currentImageIndex={currentImageIndex}
            onImageChange={setCurrentImageIndex}
          />
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Title and Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Badge variant="secondary">{product.brand}</Badge>
              {product.badges?.map((badge) => (
                <Badge key={badge} variant="outline">
                  {badge === 'new' ? 'Mới' : badge === 'bestseller' ? 'Bán chạy' : 'Flash Sale'}
                </Badge>
              ))}
            </div>
            <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
          </div>

          {/* Rating */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.floor(product.rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="font-medium">{product.rating}</span>
            <span className="text-muted-foreground">({product.reviewCount} đánh giá)</span>
          </div>

          {/* Price */}
          {renderPrice()}

          {/* Stock Status */}
          {renderStockStatus()}

          {/* Short Description */}
          {product.shortDesc && (
            <p className="text-muted-foreground">{product.shortDesc}</p>
          )}

          {/* Variant Selector */}
          {product.variants && product.variants.length > 1 && (
            <VariantSelector
              variants={product.variants}
              selectedVariant={selectedVariant}
              onChange={handleVariantChange}
            />
          )}

          {/* Quantity and Actions */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <span className="font-medium">Số lượng:</span>
              <div className="flex items-center border rounded-lg">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </Button>
                <span className="w-12 text-center">{quantity}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={selectedVariant?.stock.status === 'out-of-stock'}
                >
                  +
                </Button>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button
                size="lg"
                className="flex-1"
                onClick={handleAddToCart}
                disabled={selectedVariant?.stock.status === 'out-of-stock'}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                {t('addToCart')}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => {/* Add to wishlist */}}
              >
                <Heart className="h-5 w-5" />
              </Button>
            </div>

            <Button
              size="lg"
              className="w-full bg-orange-600 hover:bg-orange-700"
              onClick={handleBuyNow}
              disabled={selectedVariant?.stock.status === 'out-of-stock'}
            >
              Mua Ngay
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t">
            <div className="flex flex-col items-center space-y-2 text-center">
              <Truck className="h-6 w-6 text-blue-600" />
              <span className="text-sm">Giao hàng miễn phí</span>
            </div>
            <div className="flex flex-col items-center space-y-2 text-center">
              <Shield className="h-6 w-6 text-blue-600" />
              <span className="text-sm">Bảo hành chính hãng</span>
            </div>
            <div className="flex flex-col items-center space-y-2 text-center">
              <RefreshCw className="h-6 w-6 text-blue-600" />
              <span className="text-sm">Đổi trả 30 ngày</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <Tabs defaultValue="description" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="description">Mô tả sản phẩm</TabsTrigger>
          <TabsTrigger value="specifications">Thông số kỹ thuật</TabsTrigger>
          <TabsTrigger value="reviews">Đánh giá ({product.reviewCount})</TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="mt-6">
          <Card className="p-6">
            <div className="prose max-w-none">
              <p>{product.longDesc}</p>
              {product.attributes && Object.keys(product.attributes).length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Đặc điểm nổi bật</h3>
                  <ul className="space-y-2">
                    {Object.entries(product.attributes).map(([key, value]) => (
                      <li key={key} className="flex items-start space-x-2">
                        <span className="font-medium">{key}:</span>
                        <span>{Array.isArray(value) ? value.join(', ') : value}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="specifications" className="mt-6">
          <Card className="p-6">
            {product.specs ? (
              <div className="grid md:grid-cols-2 gap-6">
                {Object.entries(product.specs).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-3 border-b">
                    <span className="font-medium">{key}</span>
                    <span className="text-muted-foreground">{value}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">Chưa có thông số kỹ thuật</p>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="mt-6">
          <ProductReviews productId={product.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}