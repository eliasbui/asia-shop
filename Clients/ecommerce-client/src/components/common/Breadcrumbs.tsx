'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  className?: string;
  items?: BreadcrumbItem[];
  homeLabel?: string;
}

const getBreadcrumbsFromPath = (pathname: string): BreadcrumbItem[] => {
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [];

  segments.forEach((segment, index) => {
    const href = '/' + segments.slice(0, index + 1).join('/');
    let label = segment;

    // Convert kebab-case to title case
    label = label
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    // Translate common paths
    const translations: Record<string, string> = {
      'Help': 'Trung tâm hỗ trợ',
      'Legal': 'Pháp lý',
      'Shipping': 'Vận chuyển',
      'Returns': 'Đổi trả',
      'Payment': 'Thanh toán',
      'Warranty': 'Bảo hành',
      'Contact': 'Liên hệ',
      'Privacy': 'Chính sách bảo mật',
      'Terms': 'Điều khoản sử dụng',
      'Cookies': 'Chính sách cookie',
      'Account': 'Quản lý tài khoản',
      'Ordering': 'Hướng dẫn đặt hàng',
    };

    breadcrumbs.push({
      label: translations[label] || label,
      href: index === segments.length - 1 ? undefined : href,
    });
  });

  return breadcrumbs;
};

export function Breadcrumbs({ className, items, homeLabel = 'Trang chủ' }: BreadcrumbsProps) {
  const pathname = usePathname();
  const breadcrumbItems = items || getBreadcrumbsFromPath(pathname);

  if (breadcrumbItems.length === 0) {
    return null;
  }

  return (
    <nav className={cn('flex items-center space-x-2 text-sm text-muted-foreground', className)}>
      <Link
        href="/"
        className="flex items-center hover:text-foreground transition-colors"
      >
        <Home className="h-4 w-4" />
        <span className="sr-only">{homeLabel}</span>
      </Link>

      {breadcrumbItems.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          <ChevronRight className="h-4 w-4" />
          {item.href ? (
            <Link
              href={item.href}
              className="hover:text-foreground transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-foreground font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}