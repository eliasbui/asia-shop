'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HelpCircle, Package, FileText, Shield, MessageSquare, ShoppingCart, Wrench, Users } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface HelpNavItem {
  id: string;
  title: string;
  href: string;
  icon: React.ReactNode;
  description?: string;
}

const helpNavItems: HelpNavItem[] = [
  {
    id: 'overview',
    title: 'Trung tâm hỗ trợ',
    href: '/help',
    icon: <HelpCircle className="w-5 h-5" />,
    description: 'Tổng quan các chủ đề hỗ trợ'
  },
  {
    id: 'ordering',
    title: 'Hướng dẫn đặt hàng',
    href: '/help/ordering',
    icon: <ShoppingCart className="w-5 h-5" />,
    description: 'Cách đặt hàng và mua sắm'
  },
  {
    id: 'account',
    title: 'Quản lý tài khoản',
    href: '/help/account',
    icon: <Users className="w-5 h-5" />,
    description: 'Hướng dẫn quản lý tài khoản'
  },
  {
    id: 'shipping',
    title: 'Vận chuyển',
    href: '/help/shipping',
    icon: <Package className="w-5 h-5" />,
    description: 'Thông tin vận chuyển và giao hàng'
  },
  {
    id: 'returns',
    title: 'Đổi trả',
    href: '/help/returns',
    icon: <FileText className="w-5 h-5" />,
    description: 'Chính sách đổi trả hàng'
  },
  {
    id: 'payment',
    title: 'Thanh toán',
    href: '/help/payment',
    icon: <FileText className="w-5 h-5" />,
    description: 'Phương thức thanh toán'
  },
  {
    id: 'warranty',
    title: 'Bảo hành',
    href: '/help/warranty',
    icon: <Shield className="w-5 h-5" />,
    description: 'Thông tin bảo hành sản phẩm'
  },
  {
    id: 'troubleshooting',
    title: 'Khắc phục sự cố',
    href: '/help/troubleshooting',
    icon: <Wrench className="w-5 h-5" />,
    description: 'Giải pháp các vấn đề thường gặp'
  },
  {
    id: 'contact',
    title: 'Liên hệ',
    href: '/help/contact',
    icon: <MessageSquare className="w-5 h-5" />,
    description: 'Liên hệ đội ngũ hỗ trợ'
  }
];

interface HelpNavigationProps {
  className?: string;
}

export function HelpNavigation({ className }: HelpNavigationProps) {
  const pathname = usePathname();

  return (
    <nav className={cn("space-y-1", className)}>
      {helpNavItems.map((item) => {
        const isActive = pathname === item.href;
        
        return (
          <Link
            key={item.id}
            href={item.href}
            className={cn(
              "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors",
              isActive
                ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600"
                : "hover:bg-gray-50 text-muted-foreground hover:text-foreground"
            )}
          >
            <div className={cn(
              "flex items-center justify-center w-8 h-8 rounded-lg",
              isActive ? "bg-blue-100" : "bg-gray-100"
            )}>
              {item.icon}
            </div>
            <div className="flex-1">
              <div className="font-medium">{item.title}</div>
              {item.description && (
                <div className="text-xs text-muted-foreground">
                  {item.description}
                </div>
              )}
            </div>
          </Link>
        );
      })}
    </nav>
  );
}
