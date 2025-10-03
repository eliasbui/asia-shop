'use client';

import { useEffect } from 'react';
import { useAccountStore } from '@/lib/state/accountStore';
import { AccountStats } from '@/components/account/AccountStats';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  ShoppingBag,
  Heart,
  MapPin,
  Star,
  TrendingUp,
  Clock,
  ChevronRight,
  Gift,
  Truck
} from 'lucide-react';
import Link from 'next/link';

export default function AccountOverviewPage() {
  const { stats, fetchStats, isLoading, error } = useAccountStore();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={fetchStats}>Try Again</Button>
      </div>
    );
  }

  const tierColors = {
    bronze: 'bg-orange-100 text-orange-800',
    silver: 'bg-gray-100 text-gray-800',
    gold: 'bg-yellow-100 text-yellow-800',
    platinum: 'bg-purple-100 text-purple-800'
  };

  const tierProgress = {
    bronze: 25,
    silver: 50,
    gold: 75,
    platinum: 100
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Tổng quan tài khoản</h1>
        <p className="text-muted-foreground">
          Chào mừng trở lại! Đây là trung tâm tài khoản của bạn.
        </p>
      </div>

      {/* Loyalty Status */}
      {stats && (
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Gift className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Thành viên {stats.tier}</h3>
                <p className="text-sm text-muted-foreground">
                  {stats.loyaltyPoints} điểm tích lũy
                </p>
              </div>
            </div>
            <Badge className={tierColors[stats.tier || 'bronze']}>
              {stats.tier?.toUpperCase()}
            </Badge>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Tiến độ lên hạng tiếp theo</span>
              <span className="font-medium">{tierProgress[stats.tier || 'bronze']}%</span>
            </div>
            <Progress value={tierProgress[stats.tier || 'bronze']} className="h-2" />
          </div>
        </Card>
      )}

      {/* Account Stats */}
      {stats && <AccountStats stats={stats} />}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <ShoppingBag className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-1">Đơn hàng gần đây</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Xem lịch sử mua hàng
              </p>
              <Link href="/account/orders">
                <Button variant="outline" size="sm" className="w-full">
                  Xem tất cả
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-red-100 rounded-lg">
              <Heart className="w-6 h-6 text-red-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-1">Yêu thích</h3>
              <p className="text-sm text-muted-foreground mb-3">
                {stats?.wishlistCount || 0} sản phẩm
              </p>
              <Link href="/account/wishlist">
                <Button variant="outline" size="sm" className="w-full">
                  Xem danh sách
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <MapPin className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-1">Địa chỉ giao hàng</h3>
              <p className="text-sm text-muted-foreground mb-3">
                {stats?.savedAddresses || 0} địa chỉ
              </p>
              <Link href="/account/addresses">
                <Button variant="outline" size="sm" className="w-full">
                  Quản lý
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-4">Hoạt động gần đây</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="p-2 bg-green-100 rounded">
              <TrendingUp className="w-4 h-4 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium">Đơn hàng mới</p>
              <p className="text-sm text-muted-foreground">
                {stats?.lastOrderDate
                  ? `Đặt hàng vào ${new Date(stats.lastOrderDate).toLocaleDateString('vi-VN')}`
                  : 'Chưa có đơn hàng nào'
                }
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="p-2 bg-blue-100 rounded">
              <Truck className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium">Theo dõi đơn hàng</p>
              <p className="text-sm text-muted-foreground">
                Theo dõi tình trạng đơn hàng của bạn
              </p>
            </div>
            <Link href="/account/orders">
              <Button variant="ghost" size="sm">
                Theo dõi
              </Button>
            </Link>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="p-2 bg-yellow-100 rounded">
              <Star className="w-4 h-4 text-yellow-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium">Đánh giá sản phẩm</p>
              <p className="text-sm text-muted-foreground">
                Chia sẻ trải nghiệm của bạn
              </p>
            </div>
            <Button variant="ghost" size="sm">
              Đánh giá
            </Button>
          </div>
        </div>
      </Card>

      {/* Recommendations */}
      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-4">Gợi ý cho bạn</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="group cursor-pointer">
              <div className="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300"></div>
              </div>
              <h4 className="font-medium mb-1 group-hover:text-blue-600 transition-colors">
                Sản phẩm gợi ý {i}
              </h4>
              <p className="text-sm text-muted-foreground">
                299.000₫
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}