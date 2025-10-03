'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  ChevronRight,
  Home,
  ShoppingBag,
  Grid3X3,
  Package,
  Search,
  User,
  HelpCircle,
  FileText,
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  isCurrent?: boolean;
}

interface BreadcrumbNavProps {
  items?: BreadcrumbItem[];
  className?: string;
  showHome?: boolean;
  separator?: React.ReactNode;
}

interface BreadcrumbSchema {
  '@context': string;
  '@type': string;
  itemListElement: {
    '@type': string;
    position: number;
    name: string;
    item?: string;
  }[];
}

export function BreadcrumbNav({
  items,
  className = '',
  showHome = true,
  separator = <ChevronRight className="w-4 h-4" />
}: BreadcrumbNavProps) {
  const pathname = usePathname();
  const t = useTranslations('navigation');

  // Auto-generate breadcrumbs if not provided
  const breadcrumbItems: BreadcrumbItem[] = items || generateBreadcrumbs(pathname, t);

  // Generate structured data for SEO
  const generateStructuredData = (): BreadcrumbSchema => {
    const itemListElement = breadcrumbItems.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      ...(item.href && { item: `${typeof window !== 'undefined' ? window.location.origin : ''}${item.href}` })
    }));

    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement
    };
  };

  // Add home item if requested and not already present
  const displayItems = showHome && !breadcrumbItems.some(item => item.href === '/')
    ? [
        {
          label: 'Home',
          href: '/',
          icon: <Home className="w-4 h-4" />
        },
        ...breadcrumbItems
      ]
    : breadcrumbItems;

  if (displayItems.length === 0) {
    return null;
  }

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateStructuredData())
        }}
      />

      {/* Breadcrumb Navigation */}
      <nav
        aria-label="Breadcrumb"
        className={cn('flex items-center space-x-2 text-sm text-muted-foreground', className)}
      >
        {displayItems.map((item, index) => {
          const isLast = index === displayItems.length - 1;
          const isCurrent = item.isCurrent || isLast;

          return (
            <React.Fragment key={index}>
              {index > 0 && <span className="text-muted-foreground/60">{separator}</span>}

              {item.href && !isCurrent ? (
                <Link
                  href={item.href}
                  className="flex items-center space-x-1 hover:text-foreground transition-colors"
                  aria-current={isCurrent ? 'page' : undefined}
                >
                  {item.icon && <span>{item.icon}</span>}
                  <span className="truncate max-w-[150px] sm:max-w-none">{item.label}</span>
                </Link>
              ) : (
                <span
                  className={cn(
                    'flex items-center space-x-1 font-medium text-foreground',
                    isCurrent && 'text-foreground'
                  )}
                  aria-current={isCurrent ? 'page' : undefined}
                >
                  {item.icon && <span>{item.icon}</span>}
                  <span className="truncate max-w-[150px] sm:max-w-none">{item.label}</span>
                </span>
              )}
            </React.Fragment>
          );
        })}
      </nav>
    </>
  );
}

// Helper function to generate breadcrumbs from pathname
function generateBreadcrumbs(pathname: string, t: (key: string) => string): BreadcrumbItem[] {
  const pathSegments = pathname.split('/').filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [];
  let currentPath = '';

  // Define breadcrumb mappings
  const breadcrumbMap: Record<string, { label: string; icon?: React.ReactNode }> = {
    c: { label: 'Products', icon: <ShoppingBag className="w-4 h-4" /> },
    collections: { label: 'Collections', icon: <Grid3X3 className="w-4 h-4" /> },
    search: { label: 'Search Results', icon: <Search className="w-4 h-4" /> },
    cart: { label: 'Shopping Cart', icon: <Package className="w-4 h-4" /> },
    checkout: { label: 'Checkout', icon: <Package className="w-4 h-4" /> },
    account: { label: 'My Account', icon: <User className="w-4 h-4" /> },
    help: { label: 'Help & Support', icon: <HelpCircle className="w-4 h-4" /> },
    terms: { label: 'Terms & Conditions', icon: <FileText className="w-4 h-4" /> },
    privacy: { label: 'Privacy Policy', icon: <FileText className="w-4 h-4" /> },
    about: { label: 'About Us', icon: <FileText className="w-4 h-4" /> },
    contact: { label: 'Contact Us', icon: <HelpCircle className="w-4 h-4" /> },
    login: { label: 'Login', icon: <User className="w-4 h-4" /> },
    register: { label: 'Register', icon: <User className="w-4 h-4" /> },
    'forgot-password': { label: 'Forgot Password', icon: <User className="w-4 h-4" /> },
    settings: { label: 'Settings', icon: <Settings className="w-4 h-4" /> }
  };

  // Category-specific mappings
  const categoryMap: Record<string, string> = {
    smartphones: 'Smartphones',
    laptops: 'Laptops',
    tablets: 'Tablets',
    watches: 'Smart Watches',
    audio: 'Audio & Headphones',
    cameras: 'Cameras',
    gaming: 'Gaming',
    monitors: 'Monitors',
    accessories: 'Accessories',
    all: 'All Products'
  };

  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;

    // Check if it's a product page (p/[slug])
    if (segment === 'p' && pathSegments[index + 1]) {
      const productSlug = pathSegments[index + 1];
      breadcrumbs.push({
        label: formatProductTitle(productSlug),
        href: currentPath,
        isCurrent: index === pathSegments.length - 2
      });
      return; // Skip the next segment as it's the product slug
    }

    // Check if it's a collection page
    if (segment === 'collections' && pathSegments[index + 1]) {
      breadcrumbs.push({
        label: 'Collections',
        href: '/collections',
        icon: <Grid3X3 className="w-4 h-4" />
      });

      const collectionSlug = pathSegments[index + 1];
      breadcrumbs.push({
        label: formatCollectionTitle(collectionSlug),
        href: `${currentPath}/${collectionSlug}`,
        isCurrent: index === pathSegments.length - 2
      });
      return;
    }

    // Check if it's a checkout step
    if (segment === 'checkout' && pathSegments[index + 1]) {
      breadcrumbs.push({
        label: 'Checkout',
        href: '/checkout',
        icon: <Package className="w-4 h-4" />
      });

      const step = pathSegments[index + 1];
      const stepMap: Record<string, string> = {
        address: 'Address',
        shipping: 'Shipping',
        payment: 'Payment',
        review: 'Review Order',
        success: 'Order Successful'
      };

      if (stepMap[step]) {
        breadcrumbs.push({
          label: stepMap[step],
          href: `${currentPath}/${step}`,
          isCurrent: index === pathSegments.length - 2
        });
      }
      return;
    }

    // Standard breadcrumb mapping
    if (breadcrumbMap[segment]) {
      breadcrumbs.push({
        label: breadcrumbMap[segment].label,
        href: currentPath,
        icon: breadcrumbMap[segment].icon,
        isCurrent: index === pathSegments.length - 1
      });
    } else if (categoryMap[segment]) {
      breadcrumbs.push({
        label: categoryMap[segment],
        href: currentPath,
        isCurrent: index === pathSegments.length - 1
      });
    } else {
      // Fallback to formatted segment
      breadcrumbs.push({
        label: formatSegment(segment),
        href: currentPath,
        isCurrent: index === pathSegments.length - 1
      });
    }
  });

  return breadcrumbs;
}

// Helper function to format product titles
function formatProductTitle(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Helper function to format collection titles
function formatCollectionTitle(slug: string): string {
  const collectionMap: Record<string, string> = {
    'new-arrivals': 'New Arrivals',
    'best-sellers': 'Best Sellers',
    'sale-items': 'Sale Items',
    'trending': 'Trending Now',
    'featured': 'Featured Products',
    'clearance': 'Clearance'
  };

  return collectionMap[slug] || formatSegment(slug);
}

// Helper function to format URL segments
function formatSegment(segment: string): string {
  return segment
    .split(/[-_]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Predefined breadcrumb configurations for common pages
export const useBreadcrumbs = (customItems?: BreadcrumbItem[]) => {
  const pathname = usePathname();
  const t = useTranslations('navigation');

  return customItems || generateBreadcrumbs(pathname, t);
};

// Export predefined breadcrumb items for common use cases
export const predefinedBreadcrumbs = {
  home: [{ label: 'Home', href: '/', isCurrent: true }],
  products: [
    { label: 'Products', href: '/c/all', icon: <ShoppingBag className="w-4 h-4" /> }
  ],
  cart: [
    { label: 'Shopping Cart', href: '/cart', icon: <Package className="w-4 h-4" />, isCurrent: true }
  ],
  checkout: [
    { label: 'Checkout', href: '/checkout', icon: <Package className="w-4 h-4" /> }
  ],
  account: [
    { label: 'My Account', href: '/account', icon: <User className="w-4 h-4" /> }
  ],
  help: [
    { label: 'Help & Support', href: '/help', icon: <HelpCircle className="w-4 h-4" /> }
  ]
};

// Export a simple wrapper for common use cases
export function Breadcrumb({ className }: { className?: string }) {
  return <BreadcrumbNav className={className} />;
}