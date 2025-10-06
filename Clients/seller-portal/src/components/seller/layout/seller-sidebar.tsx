"use client";

import Link from 'next/link';
import { useSelectedLayoutSegment } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { authStore } from '@/lib/state/auth-store';
import { cn } from '@/lib/utils/cn';

interface NavItem {
  href: string;
  label: string;
  permission?: string;
}

const NAV_ITEMS: NavItem[] = [
  { href: 'dashboard', label: 'dashboard', permission: 'dashboard.view' },
  { href: 'products', label: 'products', permission: 'products.view' },
  { href: 'orders', label: 'orders', permission: 'orders.view' },
  { href: 'promotions', label: 'promotions', permission: 'promotions.view' },
  { href: 'payouts', label: 'payouts', permission: 'payouts.view' },
  { href: 'reports', label: 'reports', permission: 'reports.view' },
  { href: 'settings', label: 'settings', permission: 'settings.view' }
];

export function SellerSidebar({ locale }: { locale: string }) {
  const t = useTranslations('nav');
  const segment = useSelectedLayoutSegment();
  const roles = authStore((state) => state.roles);

  return (
    <aside className="hidden h-full w-64 border-r bg-background/95 p-4 lg:block">
      <div className="mb-6 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        {locale.toUpperCase()} Portal
      </div>
      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.filter((item) => canAccess(item, roles)).map((item) => {
          const isActive = segment ? item.href.startsWith(segment) : item.href === 'dashboard';
          return (
            <Link
              key={item.href}
              href={`/${locale}/seller/${item.href}`}
              className={cn(
                'flex items-center rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground',
                isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
              )}
            >
              {t(item.label as any)}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

function canAccess(item: NavItem, roles: string[]) {
  if (!item.permission) return true;
  const roleMap: Record<string, string[]> = {
    owner: ['*'],
    manager: ['products.view', 'products.edit', 'orders.view', 'orders.edit', 'reports.view'],
    staff: ['orders.view', 'orders.edit', 'chat.view'],
    accountant: ['payouts.view', 'reports.view']
  };

  return roles.some((role) => roleMap[role]?.includes('*') || roleMap[role]?.includes(item.permission as string));
}
