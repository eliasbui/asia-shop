"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Heart, ShoppingCart } from "lucide-react";
import { Product } from "@/types/models";
import { cn, formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/lib/state/cart-store";
import { useUIStore } from "@/lib/state/ui-store";
import { PriceBlock } from "./price-block";
import { Rating } from "../common/rating";

interface ProductCardProps {
  product: Product;
  className?: string;
  showQuickAdd?: boolean;
  locale?: string;
}

export function ProductCard({
  product,
  className,
  showQuickAdd = true,
  locale = "vi",
}: ProductCardProps) {
  const t = useTranslations();
  const addItem = useCartStore((state) => state.addItem);
  const { isInWishlist, addToWishlist, removeFromWishlist } = useUIStore();
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // If product has variants, redirect to product page
    if (product.variants && product.variants.length > 0) {
      window.location.href = `/${locale}/p/${product.slug}`;
      return;
    }
    
    addItem(product);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
    }
  };

  const isOutOfStock =
    product.variants?.every((v) => v.stock.status === "out-of-stock") ||
    false;

  return (
    <Card
      className={cn(
        "group relative overflow-hidden transition-all hover:shadow-lg",
        className
      )}
    >
      <Link href={`/${locale}/p/${product.slug}`} className="block">
        {/* Badges */}
        <div className="absolute left-2 top-2 z-10 flex flex-col gap-1">
          {product.badges?.includes("flashSale") && (
            <Badge variant="destructive" className="text-xs">
              {t("common.flashSale")}
            </Badge>
          )}
          {product.badges?.includes("new") && (
            <Badge variant="success" className="text-xs">
              {t("common.new")}
            </Badge>
          )}
          {product.badges?.includes("bestseller") && (
            <Badge variant="warning" className="text-xs">
              {t("common.bestseller")}
            </Badge>
          )}
          {product.price.percentOff && (
            <Badge variant="destructive" className="text-xs">
              -{product.price.percentOff}%
            </Badge>
          )}
        </div>

        {/* Wishlist Button */}
        <Button
          size="icon"
          variant="ghost"
          className="absolute right-2 top-2 z-10 h-8 w-8 bg-white/80 hover:bg-white"
          onClick={handleToggleWishlist}
        >
          <Heart
            className={cn(
              "h-4 w-4",
              inWishlist ? "fill-red-500 text-red-500" : "text-gray-600"
            )}
          />
          <span className="sr-only">
            {inWishlist
              ? t("product.removeFromWishlist")
              : t("product.addToWishlist")}
          </span>
        </Button>

        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          {product.media[0] ? (
            <Image
              src={product.media[0].url}
              alt={product.media[0].alt}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="text-muted-foreground">No image</div>
            </div>
          )}

          {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <span className="rounded bg-white px-3 py-1 text-sm font-semibold">
                {t("common.outOfStock")}
              </span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Brand */}
          <p className="text-xs text-muted-foreground">{product.brand}</p>

          {/* Title */}
          <h3 className="mt-1 line-clamp-2 text-sm font-medium">
            {product.title}
          </h3>

          {/* Rating */}
          {product.reviewCount > 0 && (
            <div className="mt-2 flex items-center gap-2">
              <Rating value={product.rating} size="sm" />
              <span className="text-xs text-muted-foreground">
                ({product.reviewCount})
              </span>
            </div>
          )}

          {/* Price */}
          <div className="mt-2">
            <PriceBlock price={product.price} locale={locale} size="sm" />
          </div>

          {/* Quick Add Button */}
          {showQuickAdd && !isOutOfStock && (
            <Button
              size="sm"
              className="mt-3 w-full opacity-0 transition-opacity group-hover:opacity-100"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              {product.variants && product.variants.length > 0
                ? t("common.select")
                : t("product.addToCart")}
            </Button>
          )}
        </div>
      </Link>
    </Card>
  );
}
