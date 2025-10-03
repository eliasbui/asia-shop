'use client';

import { useEffect, useState } from 'react';
import { useAccountStore } from '@/lib/state/accountStore';
import { AddressManager } from '@/components/account/AddressManager';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  MapPin,
  Plus,
  Home,
  Building,
  CreditCard,
  Check
} from 'lucide-react';
import { Address, AddressFormData } from '@/lib/types/account';

export default function AccountAddressesPage() {
  const {
    addresses,
    fetchAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    isLoading,
    error
  } = useAccountStore();

  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const handleAddAddress = async (data: AddressFormData) => {
    try {
      await addAddress(data);
      setIsAddingAddress(false);
    } catch (error) {
      console.error('Failed to add address:', error);
    }
  };

  const handleUpdateAddress = async (id: string, data: Partial<AddressFormData>) => {
    try {
      await updateAddress(id, data);
      setEditingAddress(null);
    } catch (error) {
      console.error('Failed to update address:', error);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    try {
      await deleteAddress(id);
    } catch (error) {
      console.error('Failed to delete address:', error);
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await setDefaultAddress(id);
    } catch (error) {
      console.error('Failed to set default address:', error);
    }
  };

  const getAddressIcon = (type: 'shipping' | 'billing') => {
    return type === 'shipping' ? (
      <Home className="w-5 h-5" />
    ) : (
      <Building className="w-5 h-5" />
    );
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <Alert variant="destructive" className="max-w-md mx-auto mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={fetchAddresses}>Thử lại</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Sổ địa chỉ</h1>
          <p className="text-muted-foreground">
            Quản lý địa chỉ giao hàng và thanh toán của bạn.
          </p>
        </div>
        <Button
          onClick={() => setIsAddingAddress(true)}
          disabled={isAddingAddress || !!editingAddress}
        >
          <Plus className="w-4 h-4 mr-2" />
          Thêm địa chỉ mới
        </Button>
      </div>

      {/* Add Address Form */}
      {isAddingAddress && (
        <AddressManager
          onSubmit={handleAddAddress}
          onCancel={() => setIsAddingAddress(false)}
          isLoading={isLoading}
        />
      )}

      {/* Edit Address Form */}
      {editingAddress && (
        <AddressManager
          address={editingAddress}
          onSubmit={(data) => handleUpdateAddress(editingAddress.id, data)}
          onCancel={() => setEditingAddress(null)}
          isLoading={isLoading}
        />
      )}

      {/* Addresses List */}
      {addresses.length === 0 && !isAddingAddress && !editingAddress ? (
        <Card className="p-12 text-center">
          <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Chưa có địa chỉ nào</h3>
          <p className="text-muted-foreground mb-4">
            Thêm địa chỉ đầu tiên của bạn để bắt đầu mua sắm.
          </p>
          <Button onClick={() => setIsAddingAddress(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Thêm địa chỉ mới
          </Button>
        </Card>
      ) : (
        <div className="grid gap-6">
          {addresses.map((address) => (
            <Card key={address.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className={`p-2 rounded-lg ${
                    address.type === 'shipping'
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-green-100 text-green-600'
                  }`}>
                    {getAddressIcon(address.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-lg">
                        {address.firstName} {address.lastName}
                      </h3>
                      {address.isDefault && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          <Check className="w-3 h-3 mr-1" />
                          Mặc định
                        </Badge>
                      )}
                      <Badge variant="outline">
                        {address.type === 'shipping' ? 'Giao hàng' : 'Thanh toán'}
                      </Badge>
                    </div>

                    <div className="space-y-1 text-sm">
                      {address.company && (
                        <p className="font-medium">{address.company}</p>
                      )}
                      <p>{address.address}</p>
                      {address.apartment && (
                        <p>{address.apartment}</p>
                      )}
                      <p>
                        {address.city}, {address.state} {address.postalCode}
                      </p>
                      <p>{address.country}</p>
                      {address.phone && (
                        <p className="font-medium">{address.phone}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {!address.isDefault && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetDefault(address.id)}
                      disabled={isLoading}
                    >
                      Đặt làm mặc định
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingAddress(address)}
                    disabled={isAddingAddress || !!editingAddress}
                  >
                    Chỉnh sửa
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteAddress(address.id)}
                    disabled={isLoading || address.isDefault}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    Xóa
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Tips */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <div className="flex items-start space-x-3">
          <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-semibold mb-2">Mẹo quản lý địa chỉ</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Đặt địa chỉ mặc định để thanh toán nhanh hơn</li>
              <li>• Thêm nhiều địa chỉ giao hàng cho tiện lợi</li>
              <li>• Giữ thông tin địa chỉ luôn cập nhật</li>
              <li>• Sử dụng địa chỉ công ty cho đơn hàng riêng</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}