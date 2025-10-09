"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  ShoppingBag,
  User,
  Heart,
  Search,
  Menu,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/lib/state/cart-store";
import { useUIStore } from "@/lib/state/ui-store";
import { useAuthBridge } from "@/lib/auth-bridge/use-auth-bridge";
import { maskEmail } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  locale: string;
}

export function Header({ locale }: HeaderProps) {
  const t = useTranslations();
  const {
    isReady,
    isAuthenticated,
    user,
    redirectToAuth,
    redirectToRegister,
    logout,
  } = useAuthBridge();
  
  const getItemCount = useCartStore((state) => state.getItemCount);
  const wishlistItems = useUIStore((state) => state.wishlistItems);
  const toggleMobileMenu = useUIStore((state) => state.toggleMobileMenu);

  const cartCount = getItemCount();
  const wishlistCount = wishlistItems.length;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo & Navigation */}
        <div className="flex items-center gap-6">
          <Link href={`/${locale}`} className="flex items-center gap-2">
            <ShoppingBag className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">AsiaShop</h1>
          </Link>
          
          <nav className="hidden md:flex gap-6">
            <Link
              href={`/${locale}`}
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              {t("navigation.home")}
            </Link>
            <Link
              href={`/${locale}/c/smartphones`}
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              {t("navigation.products")}
            </Link>
            <Link
              href={`/${locale}/deals`}
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              {t("navigation.deals")}
            </Link>
          </nav>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Search Button (Mobile) */}
          <Button variant="ghost" size="icon" className="md:hidden">
            <Search className="h-5 w-5" />
            <span className="sr-only">{t("common.search")}</span>
          </Button>

          {/* Wishlist */}
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/${locale}/wishlist`} className="relative">
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  {wishlistCount}
                </Badge>
              )}
              <span className="sr-only">{t("common.wishlist")}</span>
            </Link>
          </Button>

          {/* Cart */}
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/${locale}/cart`} className="relative">
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  {cartCount}
                </Badge>
              )}
              <span className="sr-only">{t("common.cart")}</span>
            </Link>
          </Button>

          {/* Auth Section */}
          {isReady && (
            <>
              {isAuthenticated && user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <User className="h-4 w-4" />
                      <span className="hidden md:inline-block">
                        {user.name || maskEmail(user.email)}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user.name}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href={`/${locale}/account`}>
                        {t("account.profile")}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/${locale}/account/orders`}>
                        {t("account.orders")}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/${locale}/account/addresses`}>
                        {t("account.addresses")}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/${locale}/wishlist`}>
                        {t("common.wishlist")}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={logout}
                      className="text-destructive focus:text-destructive"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      {t("common.logout")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => redirectToAuth()}
                  >
                    {t("common.login")}
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => redirectToRegister()}
                    className="hidden md:inline-flex"
                  >
                    {t("common.register")}
                  </Button>
                </div>
              )}
            </>
          )}

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleMobileMenu}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">{t("common.menu")}</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
