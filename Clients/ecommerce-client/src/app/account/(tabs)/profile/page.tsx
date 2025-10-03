'use client';

import { useState } from 'react';
import { useAuthStore } from '@/lib/state/authStore';
import { useAccountStore } from '@/lib/state/accountStore';
import { UserProfileForm } from '@/components/account/UserProfileForm';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  User,
  Mail,
  Phone,
  Calendar,
  Shield,
  Camera,
  Edit,
  Bell,
  Globe,
  CreditCard
} from 'lucide-react';

export default function AccountProfilePage() {
  const { user } = useAuthStore();
  const { updateProfile, isLoading } = useAccountStore();
  const [isEditing, setIsEditing] = useState(false);

  const handleProfileUpdate = async (data: any) => {
    try {
      await updateProfile(data);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Hồ sơ cá nhân</h1>
        <p className="text-muted-foreground">
          Quản lý thông tin cá nhân và cài đặt tài khoản của bạn.
        </p>
      </div>

      {/* Profile Overview Card */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Thông tin cơ bản</h2>
          <Button
            variant="outline"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? (
              <>Hủy</>
            ) : (
              <>
                <Edit className="w-4 h-4 mr-2" />
                Chỉnh sửa
              </>
            )}
          </Button>
        </div>

        {isEditing ? (
          <UserProfileForm
            user={user}
            onSubmit={handleProfileUpdate}
            onCancel={() => setIsEditing(false)}
            isLoading={isLoading}
          />
        ) : (
          <div className="space-y-6">
            {/* Avatar Section */}
            <div className="flex items-center space-x-6">
              <div className="relative">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={user.avatar || ''} />
                  <AvatarFallback className="text-2xl font-semibold">
                    {user.firstName?.[0]}{user.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                >
                  <Camera className="w-4 h-4" />
                </Button>
              </div>
              <div>
                <h3 className="text-lg font-semibold">
                  {user.firstName} {user.lastName}
                </h3>
                <p className="text-muted-foreground">{user.email}</p>
                <Badge variant="secondary" className="mt-2">
                  <Shield className="w-3 h-3 mr-1" />
                  Đã xác thực email
                </Badge>
              </div>
            </div>

            <Separator />

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Họ và tên
                  </label>
                  <p className="mt-1">
                    {user.firstName} {user.lastName}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email
                  </label>
                  <p className="mt-1">{user.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    <Phone className="w-4 h-4 inline mr-2" />
                    Số điện thoại
                  </label>
                  <p className="mt-1">
                    {user.phone || 'Chưa cập nhật'}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Ngày tham gia
                  </label>
                  <p className="mt-1">
                    {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Trạng thái tài khoản
                  </label>
                  <p className="mt-1">
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      Hoạt động
                    </Badge>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Loại tài khoản
                  </label>
                  <p className="mt-1">
                    <Badge variant="secondary">
                      Khách hàng thường
                    </Badge>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Bell className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold">Thông báo</h3>
              <p className="text-sm text-muted-foreground">
                Quản lý cài đặt thông báo
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <CreditCard className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold">Phương thức thanh toán</h3>
              <p className="text-sm text-muted-foreground">
                Quản lý thẻ và ví điện tử
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold">Bảo mật</h3>
              <p className="text-sm text-muted-foreground">
                Mật khẩu và 2FA
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Account Preferences */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Sở thích</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Globe className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Ngôn ngữ</p>
                <p className="text-sm text-muted-foreground">Chọn ngôn ngữ ưa thích</p>
              </div>
            </div>
            <select className="px-3 py-2 border rounded-md">
              <option>Tiếng Việt</option>
              <option>English</option>
            </select>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Email Marketing</p>
                <p className="text-sm text-muted-foreground">Nhận khuyến mãi và tin tức</p>
              </div>
            </div>
            <input type="checkbox" className="w-5 h-5" defaultChecked />
          </div>
        </div>
      </Card>
    </div>
  );
}