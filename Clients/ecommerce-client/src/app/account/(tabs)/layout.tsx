'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  User,
  MapPin,
  Package,
  Heart,
  ShoppingBag,
  Settings,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AuthGuard } from '@/components/auth/AuthGuard';

interface TabConfig {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
}

const tabs: TabConfig[] = [
  {
    id: 'overview',
    label: 'Tổng quan',
    href: '/account/overview',
    icon: <ShoppingBag className="w-5 h-5" />
  },
  {
    id: 'profile',
    label: 'Hồ sơ',
    href: '/account/profile',
    icon: <User className="w-5 h-5" />
  },
  {
    id: 'addresses',
    label: 'Địa chỉ',
    href: '/account/addresses',
    icon: <MapPin className="w-5 h-5" />
  },
  {
    id: 'orders',
    label: 'Đơn hàng',
    href: '/account/orders',
    icon: <Package className="w-5 h-5" />,
    badge: '3'
  },
  {
    id: 'wishlist',
    label: 'Yêu thích',
    href: '/account/wishlist',
    icon: <Heart className="w-5 h-5" />,
    badge: '12'
  },
  {
    id: 'settings',
    label: 'Cài đặt',
    href: '/account/settings',
    icon: <Settings className="w-5 h-5" />
  }
];

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const currentTab = tabs.find(tab => tab.href === pathname);
  const t = useTranslations('account');

  return (
    <AuthGuard>
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* User Profile Card */}
              <Card className="p-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src="/avatar-placeholder.jpg" />
                    <AvatarFallback className="text-lg font-semibold">
                      JD
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h2 className="font-semibold text-lg">John Doe</h2>
                    <p className="text-sm text-muted-foreground">john.doe@example.com</p>
                    <Badge variant="secondary" className="mt-1">
                      Premium Member
                    </Badge>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Thành viên từ</span>
                    <span className="font-medium">Jan 2024</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Điểm tích lũy</span>
                    <span className="font-medium text-blue-600">2,450</span>
                  </div>
                </div>
              </Card>

              {/* Navigation */}
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <Link
                    key={tab.id}
                    href={tab.href}
                    className={`
                      flex items-center justify-between w-full px-4 py-3 rounded-lg transition-colors
                      ${currentTab?.id === tab.id
                        ? 'bg-blue-50 text-blue-600 border border-blue-200'
                        : 'hover:bg-gray-50 text-muted-foreground hover:text-foreground'
                      }
                    `}
                  >
                    <div className="flex items-center space-x-3">
                      {tab.icon}
                      <span className="font-medium">{tab.label}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {tab.badge && (
                        <Badge variant="secondary" className="h-5 min-w-5 px-1 text-xs">
                          {tab.badge}
                        </Badge>
                      )}
                      <ChevronRight className="w-4 h-4 opacity-50" />
                    </div>
                  </Link>
                ))}
              </nav>

              {/* Logout */}
              <div className="pt-4 border-t">
                <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
                  <LogOut className="w-5 h-5 mr-3" />
                  Đăng xuất
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Breadcrumb */}
            <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
              <Link href="/" className="hover:text-foreground">Trang chủ</Link>
              <span>/</span>
              <Link href="/account" className="hover:text-foreground">Tài khoản</Link>
              {currentTab && (
                <>
                  <span>/</span>
                  <span className="text-foreground">{currentTab.label}</span>
                </>
              )}
            </div>

            {/* Page Content */}
            <div className="min-h-screen">
              {children}
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}