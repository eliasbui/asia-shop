"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { notFound } from "next/navigation";
import { ProductImageGallery } from "@/components/product/product-image-gallery";
import { VariantSelector } from "@/components/product/variant-selector";
import { ProductReviews } from "@/components/product/product-reviews";
import { ProductGrid } from "@/components/product/product-grid";
import { Button } from "@/components/common/button";
import { Badge } from "@/components/common/badge";
import { useCartStore, usePreferencesStore } from "@/lib/state";
import { mockProducts } from "@/lib/api/mock-data";
import { formatMoney } from "@/lib/utils";
import {
  Heart,
  ShoppingCart,
  Share2,
  Star,
  Truck,
  Shield,
  RotateCcw,
} from "lucide-react";

export default function ProductDetailPage() {
  const params = useParams();
  const productSlug = params.productSlug as string;

  // Find product
  const product = mockProducts.find((p) => p.slug === productSlug);

  if (!product) {
    notFound();
  }

  const addItem = useCartStore((state) => state.addItem);
  const { isInWishlist, toggleWishlist } = usePreferencesStore();
  const [selectedVariants, setSelectedVariants] = useState<
    Record<string, string>
  >({});
  const [quantity, setQuantity] = useState(1);

  const handleVariantChange = (key: string, value: string) => {
    setSelectedVariants((prev) => ({ ...prev, [key]: value }));
  };

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      variantId: Object.values(selectedVariants).join("-") || "default",
      quantity,
    });
  };

  const currentPrice = product.price.sale || product.price.list;
  const inWishlist = isInWishlist(product.id);

  // Related products (same category)
  const relatedProducts = mockProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-muted-foreground mb-6">
        <span>Home</span> / <span>{product.category}</span> /{" "}
        <span className="text-foreground">{product.title}</span>
      </nav>

      {/* Product Main Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Image Gallery */}
        <ProductImageGallery
          media={product.media}
          productTitle={product.title}
        />

        {/* Product Info */}
        <div className="space-y-6">
          {/* Title and Brand */}
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              {product.brand}
            </p>
            <h1 className="text-3xl font-bold mb-2">{product.title}</h1>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm">
                {product.rating} ({product.reviewCount} reviews)
              </span>
            </div>
          </div>

          {/* Badges */}
          {product.badges && product.badges.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.badges.includes("flashSale") && (
                <Badge variant="destructive">Flash Sale</Badge>
              )}
              {product.badges.includes("new") && <Badge>New</Badge>}
              {product.badges.includes("bestseller") && (
                <Badge variant="success">Bestseller</Badge>
              )}
            </div>
          )}

          {/* Price */}
          <div className="space-y-2">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-primary">
                {formatMoney(currentPrice)}
              </span>
              {product.price.sale && (
                <>
                  <span className="text-xl text-muted-foreground line-through">
                    {formatMoney(product.price.list)}
                  </span>
                  <Badge variant="destructive">
                    -{product.price.percentOff}%
                  </Badge>
                </>
              )}
            </div>
            {product.price.flashSale && (
              <p className="text-sm text-red-600 dark:text-red-400">
                Flash sale ends soon!
              </p>
            )}
          </div>

          {/* Description */}
          {product.shortDesc && (
            <p className="text-muted-foreground">{product.shortDesc}</p>
          )}

          {/* Variant Selectors */}
          {product.attributes && Object.keys(product.attributes).length > 0 && (
            <div className="space-y-4">
              {Object.entries(product.attributes).map(([key, values]) => (
                <VariantSelector
                  key={key}
                  label={key.charAt(0).toUpperCase() + key.slice(1)}
                  options={(Array.isArray(values) ? values : [values]).map(
                    (v) => ({ value: v, available: true })
                  )}
                  selected={selectedVariants[key]}
                  onSelect={(value) => handleVariantChange(key, value)}
                />
              ))}
            </div>
          )}

          {/* Quantity */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Quantity</label>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </Button>
              <span className="w-12 text-center font-medium">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button onClick={handleAddToCart} className="flex-1" size="lg">
              <ShoppingCart className="w-5 h-5 mr-2" />
              Add to Cart
            </Button>
            <Button
              variant={inWishlist ? "default" : "outline"}
              size="lg"
              onClick={() => toggleWishlist(product.id)}
            >
              <Heart
                className={`w-5 h-5 ${inWishlist ? "fill-current" : ""}`}
              />
            </Button>
            <Button variant="outline" size="lg">
              <Share2 className="w-5 h-5" />
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t">
            <div className="flex items-center gap-3">
              <Truck className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Free Shipping</p>
                <p className="text-xs text-muted-foreground">
                  Orders over 500k
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Warranty</p>
                <p className="text-xs text-muted-foreground">12 months</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <RotateCcw className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Easy Returns</p>
                <p className="text-xs text-muted-foreground">30 days</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications */}
      {product.attributes && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Specifications</h2>
          <div className="bg-muted/50 rounded-lg p-6">
            <table className="w-full">
              <tbody>
                {Object.entries(product.attributes).map(([key, values]) => (
                  <tr key={key} className="border-b last:border-b-0">
                    <td className="py-3 font-medium w-1/3">
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </td>
                    <td className="py-3 text-muted-foreground">
                      {Array.isArray(values) ? values.join(", ") : values}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Reviews */}
      <div className="mb-12">
        <ProductReviews
          rating={product.rating}
          reviewCount={product.reviewCount}
        />
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <ProductGrid products={relatedProducts} />
        </div>
      )}
    </div>
  );
}
