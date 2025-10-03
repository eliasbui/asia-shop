'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { MapPin, Plus, Edit2, Trash2 } from 'lucide-react';

interface AddressStepProps {
  data: any;
  onChange: (data: any) => void;
  onNext: () => void;
}

// Mock saved addresses
const savedAddresses = [
  {
    id: '1',
    fullName: 'Nguyễn Văn A',
    phone: '0912345678',
    address: '123 Nguyễn Huệ',
    city: 'TP. Hồ Chí Minh',
    district: 'Quận 1',
    postalCode: '700000',
    isDefault: true
  },
  {
    id: '2',
    fullName: 'Nguyễn Văn A',
    phone: '0912345678',
    address: '456 Lê Lợi',
    city: 'TP. Hồ Chí Minh',
    district: 'Quận 3',
    postalCode: '710000',
    isDefault: false
  }
];

export function AddressStep({ data, onChange, onNext }: AddressStepProps) {
  const [selectedAddressId, setSelectedAddressId] = useState<string>('1');
  const [useNewAddress, setUseNewAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    district: '',
    postalCode: ''
  });

  const selectedAddress = savedAddresses.find(addr => addr.id === selectedAddressId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const addressData = useNewAddress ? newAddress : selectedAddress;

    onChange({
      shippingAddress: addressData,
      billingAddress: {
        sameAsShipping: true
      }
    });

    onNext();
  };

  const handleNewAddressChange = (field: string, value: string) => {
    setNewAddress(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Địa chỉ giao hàng</h2>
        <p className="text-muted-foreground">
          Chọn địa chỉ giao hàng hoặc thêm địa chỉ mới
        </p>
      </div>

      {/* Saved Addresses */}
      {!useNewAddress && (
        <div className="space-y-3">
          {savedAddresses.map((address) => (
            <Card
              key={address.id}
              className={`p-4 cursor-pointer border-2 transition-colors ${
                selectedAddressId === address.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedAddressId(address.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium">{address.fullName}</span>
                    {address.isDefault && (
                      <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                        Mặc định
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{address.phone}</p>
                  <p className="text-sm">
                    {address.address}, {address.district}, {address.city}
                  </p>
                </div>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle edit
                    }}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  {!address.isDefault && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle delete
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}

          <Button
            variant="outline"
            className="w-full"
            onClick={() => setUseNewAddress(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Thêm địa chỉ mới
          </Button>
        </div>
      )}

      {/* New Address Form */}
      {useNewAddress && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fullName">Họ và tên *</Label>
              <Input
                id="fullName"
                value={newAddress.fullName}
                onChange={(e) => handleNewAddressChange('fullName', e.target.value)}
                placeholder="Nhập họ và tên"
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">Số điện thoại *</Label>
              <Input
                id="phone"
                value={newAddress.phone}
                onChange={(e) => handleNewAddressChange('phone', e.target.value)}
                placeholder="Nhập số điện thoại"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="address">Địa chỉ cụ thể *</Label>
            <Input
              id="address"
              value={newAddress.address}
              onChange={(e) => handleNewAddressChange('address', e.target.value)}
              placeholder="Số nhà, tên đường"
              required
            />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="city">Tỉnh/Thành phố *</Label>
              <Input
                id="city"
                value={newAddress.city}
                onChange={(e) => handleNewAddressChange('city', e.target.value)}
                placeholder="Chọn tỉnh/thành phố"
                required
              />
            </div>
            <div>
              <Label htmlFor="district">Quận/Huyện *</Label>
              <Input
                id="district"
                value={newAddress.district}
                onChange={(e) => handleNewAddressChange('district', e.target.value)}
                placeholder="Chọn quận/huyện"
                required
              />
            </div>
            <div>
              <Label htmlFor="postalCode">Mã bưu điện</Label>
              <Input
                id="postalCode"
                value={newAddress.postalCode}
                onChange={(e) => handleNewAddressChange('postalCode', e.target.value)}
                placeholder="Nhập mã bưu điện"
              />
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => setUseNewAddress(false)}
          >
            Quay lại chọn địa chỉ có sẵn
          </Button>

          <Separator />

          <div className="flex justify-between">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Tiếp tục
            </Button>
          </div>
        </form>
      )}

      {/* Continue Button for Saved Address */}
      {!useNewAddress && selectedAddress && (
        <div className="flex justify-end">
          <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
            Tiếp tục
          </Button>
        </div>
      )}
    </div>
  );
}