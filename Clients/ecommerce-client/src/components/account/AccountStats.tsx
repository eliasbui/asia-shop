'use client';

import { Card } from '@/components/ui/card';
import { AccountStats as AccountStatsType } from '@/lib/types/account';
import {
  ShoppingBag,
  DollarSign,
  Heart,
  MapPin,
  TrendingUp,
  Clock,
  Award
} from 'lucide-react';

interface AccountStatsProps {
  stats: AccountStatsType;
}

export function AccountStats({ stats }: AccountStatsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(amount * 23000); // Convert USD to VND
  };

  const statCards = [
    {
      title: 'Tổng đơn hàng',
      value: stats.totalOrders,
      icon: ShoppingBag,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      change: '+12% so với tháng trước',
      changeType: 'positive' as const
    },
    {
      title: 'Tổng chi tiêu',
      value: formatCurrency(stats.totalSpent),
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      change: '+8% so với tháng trước',
      changeType: 'positive' as const
    },
    {
      title: 'Giá trị trung bình',
      value: formatCurrency(stats.averageOrderValue),
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      change: '+5% so với tháng trước',
      changeType: 'positive' as const
    },
    {
      title: 'Điểm tích lũy',
      value: stats.loyaltyPoints?.toLocaleString() || '0',
      icon: Award,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      change: '+120 điểm tháng này',
      changeType: 'positive' as const
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {statCards.map((stat, index) => (
        <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <span className="text-xs text-muted-foreground bg-gray-100 px-2 py-1 rounded">
              {stat.change}
            </span>
          </div>
          <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
          <p className="text-sm text-muted-foreground">{stat.title}</p>
        </Card>
      ))}
    </div>
  );
}