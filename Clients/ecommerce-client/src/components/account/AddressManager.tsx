'use client';

import { useState, useEffect } from 'react';
import { Address, AddressFormData } from '@/lib/types/account';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import {
  Home,
  Building,
  MapPin,
  Phone,
  User,
  Building2,
  Globe
} from 'lucide-react';

interface AddressManagerProps {
  address?: Address;
  onSubmit: (data: AddressFormData) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

const countries = [
  'United States',
  'Canada',
  'United Kingdom',
  'Australia',
  'Germany',
  'France',
  'Japan',
  'South Korea',
  'China',
  'India',
  'Singapore',
  'Malaysia',
  'Thailand',
  'Vietnam',
  'Indonesia',
  'Philippines'
];

const vietnamStates = [
  'Hà Nội',
  'Hồ Chí Minh',
  'Đà Nẵng',
  'Hải Phòng',
  'Cần Thơ',
  'An Giang',
  'Bà Rịa - Vũng Tàu',
  'Bắc Giang',
  'Bắc Kạn',
  'Bạc Liêu',
  'Bắc Ninh',
  'Bến Tre',
  'Bình Định',
  'Bình Dương',
  'Bình Phước',
  'Bình Thuận',
  'Cà Mau',
  'Cao Bằng',
  'Đắk Lắk',
  'Đắk Nông',
  'Điện Biên',
  'Đồng Nai',
  'Đồng Tháp',
  'Gia Lai',
  'Hà Giang',
  'Hà Nam',
  'Hà Tĩnh',
  'Hải Dương',
  'Hậu Giang',
  'Hòa Bình',
  'Hưng Yên',
  'Khánh Hòa',
  'Kiên Giang',
  'Kon Tum',
  'Lai Châu',
  'Lâm Đồng',
  'Lạng Sơn',
  'Lào Cai',
  'Long An',
  'Nam Định',
  'Nghệ An',
  'Ninh Bình',
  'Ninh Thuận',
  'Phú Thọ',
  'Phú Yên',
  'Quảng Bình',
  'Quảng Nam',
  'Quảng Ngãi',
  'Quảng Ninh',
  'Quảng Trị',
  'Sóc Trăng',
  'Sơn La',
  'Tây Ninh',
  'Thái Bình',
  'Thái Nguyên',
  'Thanh Hóa',
  'Thừa Thiên Huế',
  'Tiền Giang',
  'Trà Vinh',
  'Tuyên Quang',
  'Vĩnh Long',
  'Vĩnh Phúc',
  'Yên Bái'
];

export function AddressManager({ address, onSubmit, onCancel, isLoading }: AddressManagerProps) {
  const [formData, setFormData] = useState<AddressFormData>({
    type: address?.type || 'shipping',
    isDefault: address?.isDefault || false,
    firstName: address?.firstName || '',
    lastName: address?.lastName || '',
    company: address?.company || '',
    address: address?.address || '',
    apartment: address?.apartment || '',
    city: address?.city || '',
    state: address?.state || '',
    postalCode: address?.postalCode || '',
    country: address?.country || 'Vietnam',
    phone: address?.phone || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (address) {
      setFormData({
        type: address.type,
        isDefault: address.isDefault,
        firstName: address.firstName,
        lastName: address.lastName,
        company: address.company || '',
        address: address.address,
        apartment: address.apartment || '',
        city: address.city,
        state: address.state,
        postalCode: address.postalCode,
        country: address.country,
        phone: address.phone || ''
      });
    }
  }, [address]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Vui lòng nhập họ';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Vui lòng nhập tên';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Vui lòng nhập địa chỉ';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'Vui lòng nhập thành phố';
    }

    if (!formData.state.trim()) {
      newErrors.state = 'Vui lòng chọn tỉnh/thành phố';
    }

    if (!formData.postalCode.trim()) {
      newErrors.postalCode = 'Vui lòng nhập mã bưu điện';
    }

    if (!formData.country.trim()) {
      newErrors.country = 'Vui lòng chọn quốc gia';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!/^[+]?[\d\s\-\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const getStateOptions = () => {
    if (formData.country === 'Vietnam') {
      return vietnamStates;
    }
    // Add other countries' states if needed
    return [];
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {address ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'}
          </h2>
        </div>

        {/* Address Type */}
        <div className="flex items-center space-x-4">
          <Label>Loại địa chỉ:</Label>
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              id="shipping"
              name="type"
              checked={formData.type === 'shipping'}
              onChange={() => handleInputChange('type', 'shipping')}
              className="w-4 h-4"
            />
            <Label htmlFor="shipping" className="flex items-center cursor-pointer">
              <Home className="w-4 h-4 mr-2" />
              Giao hàng
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              id="billing"
              name="type"
              checked={formData.type === 'billing'}
              onChange={() => handleInputChange('type', 'billing')}
              className="w-4 h-4"
            />
            <Label htmlFor="billing" className="flex items-center cursor-pointer">
              <Building className="w-4 h-4 mr-2" />
              Thanh toán
            </Label>
          </div>
        </div>

        <Separator />

        {/* Personal Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="firstName">Họ *</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className={`pl-10 ${errors.firstName ? 'border-red-500' : ''}`}
              />
            </div>
            {errors.firstName && (
              <p className="text-sm text-red-500">{errors.firstName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Tên *</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className={`pl-10 ${errors.lastName ? 'border-red-500' : ''}`}
              />
            </div>
            {errors.lastName && (
              <p className="text-sm text-red-500">{errors.lastName}</p>
            )}
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="company">Công ty (tùy chọn)</Label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                placeholder="Tên công ty"
                className="pl-10"
              />
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address">Địa chỉ *</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="123 Đường ABC"
                className={`pl-10 ${errors.address ? 'border-red-500' : ''}`}
              />
            </div>
            {errors.address && (
              <p className="text-sm text-red-500">{errors.address}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="apartment">Căn hộ, tầng, etc (tùy chọn)</Label>
            <Input
              id="apartment"
              value={formData.apartment}
              onChange={(e) => handleInputChange('apartment', e.target.value)}
              placeholder="Tầng 5, Căn hộ 501"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="city">Thành phố *</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                className={errors.city ? 'border-red-500' : ''}
              />
              {errors.city && (
                <p className="text-sm text-red-500">{errors.city}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">Tỉnh/Thành phố *</Label>
              {formData.country === 'Vietnam' ? (
                <Select value={formData.state} onValueChange={(value) => handleInputChange('state', value)}>
                  <SelectTrigger className={errors.state ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Chọn tỉnh/thành phố" />
                  </SelectTrigger>
                  <SelectContent>
                    {vietnamStates.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  className={errors.state ? 'border-red-500' : ''}
                />
              )}
              {errors.state && (
                <p className="text-sm text-red-500">{errors.state}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="postalCode">Mã bưu điện *</Label>
              <Input
                id="postalCode"
                value={formData.postalCode}
                onChange={(e) => handleInputChange('postalCode', e.target.value)}
                className={errors.postalCode ? 'border-red-500' : ''}
              />
              {errors.postalCode && (
                <p className="text-sm text-red-500">{errors.postalCode}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="country">Quốc gia *</Label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                <Select value={formData.country} onValueChange={(value) => handleInputChange('country', value)}>
                  <SelectTrigger className={`pl-10 ${errors.country ? 'border-red-500' : ''}`}>
                    <SelectValue placeholder="Chọn quốc gia" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {errors.country && (
                <p className="text-sm text-red-500">{errors.country}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Số điện thoại *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+84..."
                  className={`pl-10 ${errors.phone ? 'border-red-500' : ''}`}
                />
              </div>
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone}</p>
              )}
            </div>
          </div>
        </div>

        {/* Default Address */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="isDefault"
            checked={formData.isDefault}
            onCheckedChange={(checked) => handleInputChange('isDefault', checked)}
          />
          <Label htmlFor="isDefault" className="cursor-pointer">
            Đặt làm địa chỉ mặc định
          </Label>
        </div>

        {Object.keys(errors).length > 0 && (
          <Alert variant="destructive">
            <AlertDescription>
              Vui lòng sửa các lỗi trên trước khi gửi.
            </AlertDescription>
          </Alert>
        )}

        {/* Form Actions */}
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Hủy
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Đang lưu...' : address ? 'Cập nhật' : 'Thêm địa chỉ'}
          </Button>
        </div>
      </form>
    </Card>
  );
}