"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { ShoppingBag, Truck, Shield, CreditCard } from "lucide-react";
import { useFeaturedProducts } from "@/lib/api/hooks/use-products";
import { ProductCard } from "@/components/product/product-card";
import { ErrorBox } from "@/components/common/error-box";
import { EmptyState } from "@/components/common/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { initMSW } from "@/lib/mock/init-msw";
import { Header } from "@/components/common/header";

// Initialize MSW in development if enabled
if (process.env.NODE_ENV === "development" && process.env.NEXT_PUBLIC_ENABLE_MSW === "true") {
  initMSW();
}

export default function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const [locale, setLocale] = useState("vi");
  
  useEffect(() => {
    params.then(p => setLocale(p.locale));
  }, [params]);
  const t = useTranslations();

  // Fetch featured products
  const {
    data: featuredProducts,
    isLoading,
    error,
    refetch,
  } = useFeaturedProducts(8);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header locale={locale} />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary/10 to-primary/5 py-20">
        <div className="container">
          <div className="max-w-2xl">
            <h2 className="text-4xl font-bold tracking-tight sm:text-6xl">
              {t("navigation.newArrivals")}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Discover the latest products with amazing deals
            </p>
            <Button size="lg" className="mt-8">
              {t("navigation.shop")} Now
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 border-b">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="flex items-center gap-4">
              <Truck className="h-10 w-10 text-primary" />
              <div>
                <h3 className="font-semibold">{t("footer.freeShipping")}</h3>
                <p className="text-sm text-muted-foreground">500,000 VND</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Shield className="h-10 w-10 text-primary" />
              <div>
                <h3 className="font-semibold">Secure Payment</h3>
                <p className="text-sm text-muted-foreground">100% Protected</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <CreditCard className="h-10 w-10 text-primary" />
              <div>
                <h3 className="font-semibold">{t("footer.dayReturns")}</h3>
                <p className="text-sm text-muted-foreground">Easy Returns</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <ShoppingBag className="h-10 w-10 text-primary" />
              <div>
                <h3 className="font-semibold">{t("footer.customerSupport")}</h3>
                <p className="text-sm text-muted-foreground">Always Here</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <Button variant="outline">View All</Button>
          </div>

          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-square" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          )}

          {error && (
            <ErrorBox
              error={error}
              onRetry={refetch}
              className="max-w-md mx-auto"
            />
          )}

          {featuredProducts && featuredProducts.length === 0 && (
            <EmptyState
              icon={ShoppingBag}
              title="No products available"
              description="Check back later for new arrivals"
              action={{
                label: t("common.retry"),
                onClick: refetch,
              }}
            />
          )}

          {featuredProducts && featuredProducts.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  locale={locale}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 mt-20">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-4">{t("footer.customerService")}</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary">{t("navigation.help")}</a></li>
                <li><a href="#" className="hover:text-primary">{t("footer.returnPolicy")}</a></li>
                <li><a href="#" className="hover:text-primary">{t("footer.shippingInfo")}</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">{t("footer.aboutUs")}</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary">{t("navigation.about")}</a></li>
                <li><a href="#" className="hover:text-primary">{t("footer.careers")}</a></li>
                <li><a href="#" className="hover:text-primary">{t("footer.storeLocator")}</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary">{t("navigation.terms")}</a></li>
                <li><a href="#" className="hover:text-primary">{t("navigation.privacy")}</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">{t("footer.newsletter")}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {t("footer.subscribeNewsletter")}
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder={t("footer.emailAddress")}
                  className="flex-1 px-3 py-2 text-sm border rounded-md"
                />
                <Button size="sm">{t("footer.subscribe")}</Button>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>© 2024 AsiaShop. {t("footer.allRightsReserved")}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
