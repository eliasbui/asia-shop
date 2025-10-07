"use client";

import { useState, useEffect } from "react";
import { notFound, useRouter } from "next/navigation";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import {
  Heart,
  Share2,
  ShoppingCart,
  Truck,
  Shield,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  Check,
} from "lucide-react";
import { api } from "@/lib/api/fetch-wrapper";
import { ProductSchema } from "@/types/models";
import { formatCurrency, cn } from "@/lib/utils";
import { useCartStore } from "@/lib/state/cart-store";
import { useUIStore } from "@/lib/state/ui-store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProductCard } from "@/components/product/product-card";
import { PriceBlock } from "@/components/product/price-block";
import { VariantSelector } from "@/components/product/variant-selector";
import { Rating } from "@/components/common/rating";
import { ErrorBox } from "@/components/common/error-box";
import type { Product, Variant } from "@/types/models";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const [locale, setLocale] = useState("vi");
  const [slug, setSlug] = useState("");
  const t = useTranslations();
  const router = useRouter();

  useEffect(() => {
    params.then((p) => {
      setLocale(p.locale);
      setSlug(p.slug);
    });
  }, [params]);

  // State
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<Variant | undefined>();
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [justAddedToCart, setJustAddedToCart] = useState(false);

  // Store hooks
  const addItem = useCartStore((state) => state.addItem);
  const { isInWishlist, addToWishlist, removeFromWishlist, addToRecentlyViewed } =
    useUIStore();

  // Fetch product data
  const {
    data: product,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      if (!slug) return null;
      const response = await api.get<Product>(`/products/${slug}`, {
        schema: ProductSchema,
      });
      return response;
    },
    enabled: !!slug,
  });

  // Fetch related products
  const { data: relatedProducts } = useQuery({
    queryKey: ["products", "related", product?.category],
    queryFn: async () => {
      if (!product?.category) return null;
      const response = await api.get("/products", {
        params: {
          category: product.category,
          size: 4,
        },
      });
      return response.items.filter((p: Product) => p.id !== product.id);
    },
    enabled: !!product?.category,
  });

  // Add to recently viewed
  useEffect(() => {
    if (product) {
      addToRecentlyViewed(product.id);
    }
  }, [product, addToRecentlyViewed]);

  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  if (error || !product) {
    return (
      <div className="container py-8">
        <ErrorBox
          error={error}
          onRetry={refetch}
          className="max-w-md mx-auto"
        />
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);
  const currentPrice = selectedVariant?.price || product.price;
  const isOutOfStock =
    selectedVariant?.stock.status === "out-of-stock" ||
    (product.variants &&
      product.variants.length > 0 &&
      product.variants.every((v) => v.stock.status === "out-of-stock"));

  const handleAddToCart = async () => {
    if (product.variants && product.variants.length > 0 && !selectedVariant) {
      // Show error - variant must be selected
      return;
    }

    setIsAddingToCart(true);
    setJustAddedToCart(false);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    addItem(product, selectedVariant, quantity);
    setIsAddingToCart(false);
    setJustAddedToCart(true);

    // Reset the "just added" state after 2 seconds
    setTimeout(() => setJustAddedToCart(false), 2000);
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    router.push(`/${locale}/cart`);
  };

  const handleToggleWishlist = () => {
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: product.title,
        text: product.shortDesc,
        url: window.location.href,
      });
    } else {
      // Fallback - copy to clipboard
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="container py-4">
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
          <a href={`/${locale}`} className="hover:text-primary">
            {t("navigation.home")}
          </a>
          <span>/</span>
          <a
            href={`/${locale}/c/${product.category}`}
            className="hover:text-primary capitalize"
          >
            {product.category}
          </a>
          <span>/</span>
          <span className="text-foreground">{product.title}</span>
        </nav>
      </div>

      <div className="container pb-12">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
              {product.media[selectedImage] ? (
                <Image
                  src={product.media[selectedImage].url}
                  alt={product.media[selectedImage].alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <div className="text-muted-foreground">No image</div>
                </div>
              )}

              {/* Image Navigation */}
              {product.media.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                    onClick={() =>
                      setSelectedImage((prev) =>
                        prev === 0 ? product.media.length - 1 : prev - 1
                      )
                    }
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                    onClick={() =>
                      setSelectedImage(
                        (prev) => (prev + 1) % product.media.length
                      )
                    }
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}

              {/* Badges */}
              <div className="absolute left-2 top-2 flex flex-col gap-1">
                {product.badges?.includes("flashSale") && (
                  <Badge variant="destructive">{t("common.flashSale")}</Badge>
                )}
                {product.badges?.includes("new") && (
                  <Badge variant="success">{t("common.new")}</Badge>
                )}
                {product.badges?.includes("bestseller") && (
                  <Badge variant="warning">{t("common.bestseller")}</Badge>
                )}
              </div>
            </div>

            {/* Thumbnails */}
            {product.media.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {product.media.map((media, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={cn(
                      "relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2",
                      selectedImage === index
                        ? "border-primary"
                        : "border-transparent"
                    )}
                  >
                    <Image
                      src={media.url}
                      alt={media.alt}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Title & Brand */}
            <div>
              <p className="text-sm text-muted-foreground">{product.brand}</p>
              <h1 className="mt-1 text-3xl font-bold">{product.title}</h1>
              
              {/* Rating */}
              {product.reviewCount > 0 && (
                <div className="mt-3 flex items-center gap-3">
                  <Rating value={product.rating} showValue />
                  <span className="text-sm text-muted-foreground">
                    ({product.reviewCount} {t("product.reviews")})
                  </span>
                </div>
              )}
            </div>

            {/* Price */}
            <div>
              <PriceBlock price={currentPrice} locale={locale} size="lg" />
              {currentPrice.flashSale && (
                <p className="mt-2 text-sm text-destructive">
                  {t("product.limitedTimeOffer")} - {t("product.endsIn")}{" "}
                  {new Date(currentPrice.flashSale.endsAt).toLocaleString(
                    locale
                  )}
                </p>
              )}
            </div>

            {/* Short Description */}
            {product.shortDesc && (
              <p className="text-muted-foreground">{product.shortDesc}</p>
            )}

            {/* Variant Selector */}
            {product.variants && product.variants.length > 0 && (
              <VariantSelector
                variants={product.variants}
                selectedVariant={selectedVariant}
                onVariantChange={setSelectedVariant}
              />
            )}

            {/* Quantity Selector */}
            <div>
              <Label className="text-sm font-medium mb-2 block">
                {t("common.quantity")}
              </Label>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                  }
                  className="w-20 text-center"
                  min="1"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                size="lg"
                className="flex-1"
                onClick={handleAddToCart}
                disabled={
                  isOutOfStock ||
                  isAddingToCart ||
                  (product.variants &&
                    product.variants.length > 0 &&
                    !selectedVariant)
                }
              >
                {justAddedToCart ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    {t("product.inYourCart")}
                  </>
                ) : isAddingToCart ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    {t("common.loading")}
                  </>
                ) : (
                  <>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    {isOutOfStock
                      ? t("common.outOfStock")
                      : product.variants &&
                        product.variants.length > 0 &&
                        !selectedVariant
                      ? t("common.select")
                      : t("product.addToCart")}
                  </>
                )}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleBuyNow}
                disabled={
                  isOutOfStock ||
                  (product.variants &&
                    product.variants.length > 0 &&
                    !selectedVariant)
                }
              >
                {t("product.buyNow")}
              </Button>
              <Button
                size="lg"
                variant="ghost"
                onClick={handleToggleWishlist}
              >
                <Heart
                  className={cn(
                    "h-5 w-5",
                    inWishlist && "fill-red-500 text-red-500"
                  )}
                />
              </Button>
              <Button size="lg" variant="ghost" onClick={handleShare}>
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 border-t pt-6">
              <div className="flex flex-col items-center text-center">
                <Truck className="h-6 w-6 text-primary mb-2" />
                <p className="text-sm font-medium">Free Shipping</p>
                <p className="text-xs text-muted-foreground">
                  Orders over 500k
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <Shield className="h-6 w-6 text-primary mb-2" />
                <p className="text-sm font-medium">Warranty</p>
                <p className="text-xs text-muted-foreground">12 months</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <RefreshCw className="h-6 w-6 text-primary mb-2" />
                <p className="text-sm font-medium">30-Day Returns</p>
                <p className="text-xs text-muted-foreground">Easy returns</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-12">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">
                {t("product.description")}
              </TabsTrigger>
              <TabsTrigger value="specifications">
                {t("product.specifications")}
              </TabsTrigger>
              <TabsTrigger value="reviews">{t("product.reviews")}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="mt-6">
              <Card className="p-6">
                <div className="prose max-w-none">
                  {product.longDesc || product.shortDesc || (
                    <p className="text-muted-foreground">
                      No description available
                    </p>
                  )}
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="specifications" className="mt-6">
              <Card className="p-6">
                {product.specs ? (
                  <dl className="grid gap-3">
                    {Object.entries(product.specs).map(([key, value]) => (
                      <div
                        key={key}
                        className="grid grid-cols-2 gap-4 border-b pb-3 last:border-0"
                      >
                        <dt className="font-medium">{key}</dt>
                        <dd className="text-muted-foreground">{value}</dd>
                      </div>
                    ))}
                  </dl>
                ) : (
                  <p className="text-muted-foreground">
                    No specifications available
                  </p>
                )}
              </Card>
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-6">
              <Card className="p-6">
                <p className="text-muted-foreground">
                  Reviews coming soon...
                </p>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">
              {t("product.relatedProducts")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((product: Product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  locale={locale}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ProductDetailSkeleton() {
  return (
    <div className="container py-8">
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <Skeleton className="aspect-square rounded-lg" />
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-20 w-20 rounded-lg" />
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <div>
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/2 mt-3" />
          </div>
          <Skeleton className="h-12 w-1/3" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-32 w-full" />
          <div className="flex gap-3">
            <Skeleton className="h-12 flex-1" />
            <Skeleton className="h-12 w-32" />
            <Skeleton className="h-12 w-12" />
          </div>
        </div>
      </div>
    </div>
  );
}
