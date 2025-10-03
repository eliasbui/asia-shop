'use client';

import React from 'react';
import {
  ShoppingBag,
  Search,
  Package,
  Heart,
  Star,
  ShoppingCart,
  Filter,
  Tag,
  Truck,
  CreditCard
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';

export type EmptyStateType =
  | 'cart'
  | 'search'
  | 'products'
  | 'wishlist'
  | 'reviews'
  | 'orders'
  | 'categories'
  | 'filters'
  | 'checkout'
  | 'payment';

export interface EmptyStateProps {
  type?: EmptyStateType;
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'destructive' | 'link';
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  image?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

// Icon mappings for different empty state types
const iconMap: Record<EmptyStateType, React.ReactNode> = {
  cart: <ShoppingCart className="h-12 w-12" />,
  search: <Search className="h-12 w-12" />,
  products: <Package className="h-12 w-12" />,
  wishlist: <Heart className="h-12 w-12" />,
  reviews: <Star className="h-12 w-12" />,
  orders: <Package className="h-12 w-12" />,
  categories: <Tag className="h-12 w-12" />,
  filters: <Filter className="h-12 w-12" />,
  checkout: <Truck className="h-12 w-12" />,
  payment: <CreditCard className="h-12 w-12" />,
};

// Default content for different empty state types
const defaultContent: Record<EmptyStateType, { title: string; description: string }> = {
  cart: {
    title: 'Your cart is empty',
    description: 'Looks like you haven\'t added anything to your cart yet. Start shopping to fill it up!',
  },
  search: {
    title: 'No results found',
    description: 'We couldn\'t find any products matching your search. Try different keywords or browse our categories.',
  },
  products: {
    title: 'No products available',
    description: 'There are no products in this category at the moment. Check back later or explore other categories.',
  },
  wishlist: {
    title: 'Your wishlist is empty',
    description: 'Save your favorite items here so you can find them easily later.',
  },
  reviews: {
    title: 'No reviews yet',
    description: 'Be the first to review this product and share your experience with others.',
  },
  orders: {
    title: 'No orders yet',
    description: 'You haven\'t placed any orders yet. Start shopping to see your order history here.',
  },
  categories: {
    title: 'No categories found',
    description: 'No categories are available at the moment. Please check back later.',
  },
  filters: {
    title: 'No filters applied',
    description: 'Apply filters to narrow down your search results and find exactly what you\'re looking for.',
  },
  checkout: {
    title: 'Ready to checkout?',
    description: 'Add items to your cart and proceed to checkout to complete your purchase.',
  },
  payment: {
    title: 'No payment methods',
    description: 'Add a payment method to make checkout faster and easier.',
  },
};

// Size configurations
const sizeConfig = {
  sm: {
    icon: 'h-8 w-8',
    title: 'text-lg',
    description: 'text-sm',
    spacing: 'space-y-3',
  },
  md: {
    icon: 'h-12 w-12',
    title: 'text-xl',
    description: 'text-base',
    spacing: 'space-y-4',
  },
  lg: {
    icon: 'h-16 w-16',
    title: 'text-2xl',
    description: 'text-lg',
    spacing: 'space-y-6',
  },
};

export function EmptyState({
  type = 'products',
  title,
  description,
  icon,
  action,
  secondaryAction,
  image,
  className = '',
  size = 'md',
}: EmptyStateProps) {
  const config = sizeConfig[size];
  const defaultTitle = title || defaultContent[type].title;
  const defaultDescription = description || defaultContent[type].description;
  const defaultIcon = icon || iconMap[type];

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center py-12 px-6',
        config.spacing,
        className
      )}
    >
      {/* Image or Icon */}
      <div className="mb-4">
        {image ? (
          <img
            src={image}
            alt={defaultTitle}
            className={cn(
              'mx-auto rounded-lg',
              size === 'sm' ? 'h-24 w-24' : size === 'md' ? 'h-32 w-32' : 'h-48 w-48'
            )}
          />
        ) : (
          <div className={cn('text-muted-foreground', config.icon)}>
            {defaultIcon}
          </div>
        )}
      </div>

      {/* Title */}
      <h3 className={cn('font-semibold text-foreground', config.title)}>
        {defaultTitle}
      </h3>

      {/* Description */}
      <p className={cn('text-muted-foreground max-w-md', config.description)}>
        {defaultDescription}
      </p>

      {/* Actions */}
      {(action || secondaryAction) && (
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          {action && (
            <Button
              onClick={action.onClick}
              variant={action.variant || 'default'}
              className="min-w-[120px]"
            >
              {action.label}
            </Button>
          )}

          {secondaryAction && (
            <Button
              onClick={secondaryAction.onClick}
              variant="outline"
              className="min-w-[120px]"
            >
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

// Specialized empty state components for common use cases
export function EmptyCart(props: Omit<EmptyStateProps, 'type'>) {
  return (
    <EmptyState
      type="cart"
      action={{
        label: 'Start Shopping',
        onClick: () => window.location.href = '/',
        variant: 'default',
      }}
      {...props}
    />
  );
}

export function EmptySearch(props: Omit<EmptyStateProps, 'type'>) {
  return (
    <EmptyState
      type="search"
      action={{
        label: 'Browse Categories',
        onClick: () => window.location.href = '/',
        variant: 'outline',
      }}
      {...props}
    />
  );
}

export function EmptyWishlist(props: Omit<EmptyStateProps, 'type'>) {
  return (
    <EmptyState
      type="wishlist"
      action={{
        label: 'Explore Products',
        onClick: () => window.location.href = '/',
        variant: 'default',
      }}
      {...props}
    />
  );
}

export function EmptyReviews(props: Omit<EmptyStateProps, 'type'>) {
  return (
    <EmptyState
      type="reviews"
      action={{
        label: 'Write a Review',
        onClick: () => {/* Handle review action */},
        variant: 'default',
      }}
      {...props}
    />
  );
}

export function EmptyOrders(props: Omit<EmptyStateProps, 'type'>) {
  return (
    <EmptyState
      type="orders"
      action={{
        label: 'Start Shopping',
        onClick: () => window.location.href = '/',
        variant: 'default',
      }}
      {...props}
    />
  );
}