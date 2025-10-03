"use client";

import Image from "next/image";
import { useLocale } from "next-intl";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/common/card";
import { Badge } from "@/components/common/badge";
import { Button } from "@/components/common/button";
import { Link } from "@/components/common/link";
import { useCartStore } from "@/lib/state";
import { usePreferencesStore } from "@/lib/state";
import { formatMoney } from "@/lib/utils";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const locale = useLocale();
  const addItem = useCartStore((state) => state.addItem);
  const { isInWishlist, toggleWishlist } = usePreferencesStore();
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      productId: product.id,
      variantId: "default",
      quantity: 1,
    });
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleWishlist(product.id);
  };

  const mainImage = product.media[0];
  const hasDiscount = !!product.price.sale;
  const isFlashSale = product.badges?.includes("flashSale");
  const isNew = product.badges?.includes("new");
  const isBestseller = product.badges?.includes("bestseller");

  return (
    <Card className={cn("group relative overflow-hidden", className)}>
      <Link href={`/p/${product.slug}`}>
        {/* Badges */}
        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
          {isFlashSale && (
            <Badge variant="destructive" className="shadow-md">
              Flash Sale
            </Badge>
          )}
          {isNew && (
            <Badge variant="success" className="shadow-md">
              New
            </Badge>
          )}
          {isBestseller && (
            <Badge variant="warning" className="shadow-md">
              Bestseller
            </Badge>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          className="absolute top-2 right-2 z-10 p-2 rounded-full bg-white/80 hover:bg-white shadow-md transition-colors"
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={cn(
              "w-5 h-5",
              inWishlist ? "fill-red-500 text-red-500" : "text-gray-600"
            )}
          />
        </button>

        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <Image
            src={mainImage.url}
            alt={mainImage.alt}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
        </div>

        <CardContent className="p-4">
          {/* Brand */}
          <p className="text-xs text-muted-foreground mb-1">{product.brand}</p>

          {/* Title */}
          <h3 className="font-semibold text-sm line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {product.title}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{product.rating}</span>
            <span className="text-xs text-muted-foreground">
              ({product.reviewCount})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-primary">
              {formatMoney(product.price.sale || product.price.list, locale)}
            </span>
            {hasDiscount && (
              <>
                <span className="text-sm text-muted-foreground line-through">
                  {formatMoney(product.price.list, locale)}
                </span>
                {product.price.percentOff && (
                  <Badge variant="destructive" className="text-xs">
                    -{product.price.percentOff}%
                  </Badge>
                )}
              </>
            )}
          </div>

          {/* Flash Sale Countdown */}
          {isFlashSale && product.price.flashSale && (
            <div className="mt-2 text-xs text-red-600 font-medium">
              Ends:{" "}
              {new Date(product.price.flashSale.endsAt).toLocaleString(locale)}
            </div>
          )}
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <Button onClick={handleAddToCart} className="w-full" size="sm">
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to Cart
          </Button>
        </CardFooter>
      </Link>
    </Card>
  );
}
