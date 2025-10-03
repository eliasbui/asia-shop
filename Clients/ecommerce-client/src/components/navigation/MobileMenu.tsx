'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import {
  X,
  Menu,
  ChevronRight,
  ChevronDown,
  Home,
  ShoppingBag,
  Grid3X3,
  HelpCircle,
  User,
  Heart,
  Settings,
  LogOut,
  Package,
  CreditCard,
  MapPin,
  Bell,
  FileText,
  Star,
  Headphones,
  Smartphone,
  Laptop,
  Watch,
  Camera,
  HeadphonesIcon,
  Gamepad2,
  Monitor,
  Tablet
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

interface MobileMenuProps {
  className?: string;
}

interface MenuItem {
  title: string;
  href?: string;
  icon?: React.ReactNode;
  badge?: string;
  children?: MenuItem[];
  onClick?: () => void;
}

interface CategoryItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  count?: number;
}

export function MobileMenu({ className = '' }: MobileMenuProps) {
  const t = useTranslations('common');
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const mainMenuItems: MenuItem[] = [
    {
      title: 'Home',
      href: '/',
      icon: <Home className="w-4 h-4" />
    },
    {
      title: 'All Products',
      href: '/c/all',
      icon: <ShoppingBag className="w-4 h-4" />
    },
    {
      title: 'Collections',
      href: '/collections',
      icon: <Grid3X3 className="w-4 h-4" />
    },
    {
      title: 'Categories',
      icon: <Menu className="w-4 h-4" />,
      children: [
        {
          title: 'Smartphones',
          href: '/c/smartphones',
          icon: <Smartphone className="w-4 h-4" />
        },
        {
          title: 'Laptops',
          href: '/c/laptops',
          icon: <Laptop className="w-4 h-4" />
        },
        {
          title: 'Tablets',
          href: '/c/tablets',
          icon: <Tablet className="w-4 h-4" />
        },
        {
          title: 'Watches',
          href: '/c/watches',
          icon: <Watch className="w-4 h-4" />
        },
        {
          title: 'Audio',
          href: '/c/audio',
          icon: <HeadphonesIcon className="w-4 h-4" />
        },
        {
          title: 'Cameras',
          href: '/c/cameras',
          icon: <Camera className="w-4 h-4" />
        },
        {
          title: 'Gaming',
          href: '/c/gaming',
          icon: <Gamepad2 className="w-4 h-4" />
        },
        {
          title: 'Monitors',
          href: '/c/monitors',
          icon: <Monitor className="w-4 h-4" />
        }
      ]
    },
    {
      title: 'Support',
      href: '/help',
      icon: <HelpCircle className="w-4 h-4" />
    }
  ];

  const accountMenuItems: MenuItem[] = [
    {
      title: 'My Account',
      href: '/account',
      icon: <User className="w-4 h-4" />
    },
    {
      title: 'Orders',
      href: '/account/orders',
      icon: <Package className="w-4 h-4" />
    },
    {
      title: 'Wishlist',
      href: '/account/wishlist',
      icon: <Heart className="w-4 h-4" />,
      badge: '3'
    },
    {
      title: 'Addresses',
      href: '/account/addresses',
      icon: <MapPin className="w-4 h-4" />
    },
    {
      title: 'Payment Methods',
      href: '/account/payment',
      icon: <CreditCard className="w-4 h-4" />
    },
    {
      title: 'Notifications',
      href: '/account/notifications',
      icon: <Bell className="w-4 h-4" />,
      badge: '5'
    },
    {
      title: 'Reviews',
      href: '/account/reviews',
      icon: <Star className="w-4 h-4" />
    },
    {
      title: 'Settings',
      href: '/account/settings',
      icon: <Settings className="w-4 h-4" />
    },
    {
      title: 'Terms & Privacy',
      href: '/terms',
      icon: <FileText className="w-4 h-4" />
    },
    {
      title: 'Contact Support',
      href: '/help/contact',
      icon: <Headphones className="w-4 h-4" />
    }
  ];

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const handleNavigation = (href: string) => {
    router.push(href);
    setIsOpen(false);
  };

  const handleMenuItemClick = (item: MenuItem) => {
    if (item.onClick) {
      item.onClick();
    }
    if (item.href) {
      handleNavigation(item.href);
    }
    if (item.children) {
      toggleCategory(item.title);
    }
  };

  const renderMenuItem = (item: MenuItem, level = 0) => {
    const isExpanded = expandedCategories.has(item.title);
    const hasChildren = item.children && item.children.length > 0;

    return (
      <div key={item.title}>
        <button
          onClick={() => handleMenuItemClick(item)}
          className={`w-full flex items-center justify-between p-3 text-left hover:bg-accent rounded-lg transition-colors ${
            level > 0 ? 'ml-4 pl-6' : ''
          }`}
        >
          <div className="flex items-center space-x-3">
            {item.icon && <span className="text-muted-foreground">{item.icon}</span>}
            <span className="font-medium">{item.title}</span>
            {item.badge && (
              <Badge variant="secondary" className="text-xs">
                {item.badge}
              </Badge>
            )}
          </div>
          {hasChildren && (
            <span className="text-muted-foreground">
              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </span>
          )}
        </button>

        {hasChildren && isExpanded && (
          <div className="space-y-1">
            {item.children!.map((child) => renderMenuItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const featuredCategories: CategoryItem[] = [
    { name: 'Smartphones', href: '/c/smartphones', icon: <Smartphone className="w-6 h-6" />, count: 156 },
    { name: 'Laptops', href: '/c/laptops', icon: <Laptop className="w-6 h-6" />, count: 89 },
    { name: 'Audio', href: '/c/audio', icon: <HeadphonesIcon className="w-6 h-6" />, count: 234 },
    { name: 'Watches', href: '/c/watches', icon: <Watch className="w-6 h-6" />, count: 67 }
  ];

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className={className}>
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full sm:w-80 p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <SheetHeader className="p-6 border-b">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-lg font-semibold">Menu</SheetTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </SheetHeader>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {/* Featured Categories */}
            <div className="p-6">
              <h3 className="text-sm font-semibold text-muted-foreground mb-4">Shop by Category</h3>
              <div className="grid grid-cols-2 gap-3">
                {featuredCategories.map((category) => (
                  <button
                    key={category.name}
                    onClick={() => handleNavigation(category.href)}
                    className="flex flex-col items-center justify-center p-4 border rounded-lg hover:bg-accent transition-colors"
                  >
                    <div className="text-primary mb-2">{category.icon}</div>
                    <span className="text-sm font-medium">{category.name}</span>
                    {category.count && (
                      <span className="text-xs text-muted-foreground">{category.count} items</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <Separator />

            {/* Main Menu */}
            <div className="p-6 space-y-2">
              <h3 className="text-sm font-semibold text-muted-foreground mb-4">Menu</h3>
              {mainMenuItems.map((item) => renderMenuItem(item))}
            </div>

            <Separator />

            {/* Account Menu */}
            <div className="p-6 space-y-2">
              <h3 className="text-sm font-semibold text-muted-foreground mb-4">Account</h3>
              {accountMenuItems.map((item) => renderMenuItem(item))}
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t">
            <div className="space-y-4">
              {/* App Download */}
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-3">Get our app for better experience</p>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" className="h-8">
                    <Smartphone className="w-3 h-3 mr-1" />
                    iOS
                  </Button>
                  <Button variant="outline" size="sm" className="h-8">
                    <Smartphone className="w-3 h-3 mr-1" />
                    Android
                  </Button>
                </div>
              </div>

              {/* Contact Info */}
              <div className="text-center text-xs text-muted-foreground">
                <p>Need help? Contact us at</p>
                <p className="font-medium text-foreground">support@asiashop.com</p>
                <p className="mt-1">Hotline: 1900-1234</p>
              </div>

              {/* Social Links */}
              <div className="flex justify-center space-x-4">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <div className="w-4 h-4 bg-blue-600 rounded" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <div className="w-4 h-4 bg-pink-600 rounded" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <div className="w-4 h-4 bg-blue-400 rounded" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <div className="w-4 h-4 bg-red-600 rounded" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// Export a simplified version for quick access
export function MobileMenuSimple() {
  return <MobileMenu />;
}