"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/common/button";
import { useAuthStore, usePreferencesStore } from "@/lib/state";
import { mockProducts } from "@/lib/api/mock-data";
import { ProductGrid } from "@/components/product/product-grid";
import { User, Package, MapPin, Heart, LogOut } from "lucide-react";

export default function AccountPage() {
  const router = useRouter();
  const { user, isAuthenticated, clearAuth } = useAuthStore();
  const { wishlist } = usePreferencesStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  const wishlistProducts = mockProducts.filter((p) => wishlist.includes(p.id));

  const handleLogout = () => {
    clearAuth();
    router.push("/");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">My Account</h1>
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>

      {/* Account Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="border rounded-lg p-6">
          <User className="w-8 h-8 text-primary mb-3" />
          <h3 className="font-semibold mb-1">Profile</h3>
          <p className="text-sm text-muted-foreground">
            {user?.email || "Guest User"}
          </p>
        </div>

        <div className="border rounded-lg p-6">
          <Package className="w-8 h-8 text-primary mb-3" />
          <h3 className="font-semibold mb-1">Orders</h3>
          <p className="text-sm text-muted-foreground">0 orders</p>
        </div>

        <div className="border rounded-lg p-6">
          <MapPin className="w-8 h-8 text-primary mb-3" />
          <h3 className="font-semibold mb-1">Addresses</h3>
          <p className="text-sm text-muted-foreground">0 saved</p>
        </div>

        <div className="border rounded-lg p-6">
          <Heart className="w-8 h-8 text-primary mb-3" />
          <h3 className="font-semibold mb-1">Wishlist</h3>
          <p className="text-sm text-muted-foreground">
            {wishlist.length} items
          </p>
        </div>
      </div>

      {/* Wishlist */}
      {wishlistProducts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">My Wishlist</h2>
          <ProductGrid products={wishlistProducts} />
        </div>
      )}
    </div>
  );
}
