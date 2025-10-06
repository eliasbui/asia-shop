"use client";

import { Menu, Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { authStore } from '@/lib/state/auth-store';
import { uiStore } from '@/lib/state/ui-store';

import { StoreSwitcher } from './store-switcher';

export function SellerNavbar() {
  const t = useTranslations('nav');
  const toggleSidebar = uiStore((state) => state.toggleSidebar);
  const stores = authStore((state) => state.stores);
  const activeStoreId = authStore((state) => state.activeStoreId);
  const switchStore = authStore((state) => state.switchStore);
  const pathname = usePathname();
  const [_, currentLocale] = pathname.split('/');

  return (
    <header className="flex h-16 items-center gap-4 border-b px-4 lg:px-6">
      <Button variant="ghost" size="sm" className="lg:hidden" onClick={toggleSidebar}>
        <Menu className="h-5 w-5" />
      </Button>
      <div className="hidden items-center gap-2 lg:flex">
        <StoreSwitcher stores={stores} activeStoreId={activeStoreId} onChange={switchStore} />
      </div>
      <div className="flex flex-1 items-center gap-3">
        <div className="hidden items-center gap-2 md:flex">
          <Select defaultValue={currentLocale} onValueChange={(value) => switchLocale(value)}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">EN</SelectItem>
              <SelectItem value="vi">VI</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-10" placeholder={`${t('products')}...`} />
        </div>
      </div>
      <Button variant="outline" size="sm">
        {t('settings')}
      </Button>
    </header>
  );
}

function switchLocale(locale: string) {
  const url = new URL(window.location.href);
  const [, currentLocale, ...segments] = url.pathname.split('/');
  if (currentLocale === locale) return;
  url.pathname = ['/', locale, ...segments].join('/');
  window.location.assign(url.toString());
}
