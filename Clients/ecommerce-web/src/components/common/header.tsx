"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Link } from "./link";
import { useTranslations } from "next-intl";
import { ShoppingCart, User, Search, Menu, LogOut } from "lucide-react";
import { useCartStore } from "../../lib/state/cart-store";
import { Badge } from "./badge";
import { ThemeToggle } from "./theme-toggle";
import { LanguageSwitcher } from "./language-switcher";
import { useAuthActions } from "../../hooks/use-auth-actions";
import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export function Header() {
  const t = useTranslations("nav");
  const router = useRouter();
  const itemCount = useCartStore((state) => state.getItemCount());
  const [searchQuery, setSearchQuery] = useState("");
  const { isAuthenticated, user, login, logout } = useAuthActions();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/s?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogin = () => {
    login(window.location.href);
  };

  const handleRegister = () => {
    login(window.location.href);
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const handleAccount = () => {
    router.push("/account");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary">Asia Shop</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              {t("home")}
            </Link>
            <Link
              href="/categories"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              {t("categories")}
            </Link>
            <Link
              href="/deals"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              {t("deals")}
            </Link>
          </nav>

          {/* Search Bar (Desktop) */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-md mx-8"
          >
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-4 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Mobile Search */}
            <button
              className="md:hidden p-2 hover:bg-accent rounded-md"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2 hover:bg-accent rounded-md"
            >
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {itemCount}
                </Badge>
              )}
            </Link>

            {/* Account */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="p-2 hover:bg-accent rounded-md">
                    <User className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="px-2 py-1.5 text-sm font-medium">
                    {user?.firstName} {user?.lastName}
                  </div>
                  <div className="px-2 py-1 text-xs text-muted-foreground">
                    {user?.email}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleAccount}>
                    <User className="mr-2 h-4 w-4" />
                    {t("account")}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    {t("logout")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" size="sm" onClick={handleLogin} className="p-2 hover:bg-accent rounded-md">
                <User className="w-5 h-5" />
              </Button>
            )}

            {/* Mobile Menu */}
            <button
              className="md:hidden p-2 hover:bg-accent rounded-md"
              aria-label="Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <form onSubmit={handleSearch} className="md:hidden pb-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </form>
      </div>
    </header>
  );
}
