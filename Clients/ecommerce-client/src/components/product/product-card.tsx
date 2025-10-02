"use client"

import Link from "next/link";
import Image from "next/image";
import { Star, ShoppingCart, Heart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "@/types";
import { formatPrice, formatDiscount } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export default function ProductCard({ product, className }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
  };

  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Added to wishlist:", product.id);
  };

  return (
    <Link
      href={`/products/${product.slug}`}
      className={cn(
        "group bg-card rounded-lg border overflow-hidden hover:shadow-lg transition-all duration-200",
        className
      )}
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Image
          src={product.thumbnail}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-200"
        />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.discount && (
            <span className="bg-accent text-accent-foreground text-xs font-medium px-2 py-1 rounded">
              -{formatDiscount(product.discount)}
            </span>
          )}
          {product.isNewArrival && (
            <span className="bg-success text-success-foreground text-xs font-medium px-2 py-1 rounded">
              Mới
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-warning text-warning-foreground text-xs font-medium px-2 py-1 rounded">
              Bán chạy
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
            onClick={handleAddToWishlist}
          >
            <Heart className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>

        {/* Free Shipping Badge */}
        {product.freeShipping && (
          <div className="absolute bottom-2 left-2">
            <span className="bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded">
              Miễn phí vận chuyển
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
        </div>

        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center">
            <Star className="h-3 w-3 fill-warning text-warning" />
            <span className="text-xs font-medium ml-1">{product.rating}</span>
          </div>
          <span className="text-xs text-muted-foreground">
            ({product.reviewCount} đánh giá)
          </span>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <span className="font-bold text-primary">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-muted-foreground line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
          <span>Đã bán {product.sold}</span>
          <span>Còn {product.stock} sp</span>
        </div>

        <Button
          className="w-full"
          size="sm"
          onClick={handleAddToCart}
          disabled={product.stock === 0}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {product.stock === 0 ? "Hết hàng" : "Thêm vào giỏ"}
        </Button>
      </div>
    </Link>
  );
}
