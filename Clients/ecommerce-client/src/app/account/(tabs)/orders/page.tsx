'use client';

import { useEffect, useState } from 'react';
import { useAccountStore } from '@/lib/state/accountStore';
import { OrderHistory } from '@/components/account/OrderHistory';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Package,
  Search,
  Filter,
  Calendar,
  ChevronDown,
  RefreshCw
} from 'lucide-react';
import { Order } from '@/lib/types/account';

export default function AccountOrdersPage() {
  const {
    orders,
    fetchOrders,
    fetchOrderDetails,
    isLoading,
    error
  } = useAccountStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date-desc');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const filteredAndSortedOrders = orders
    .filter(order => {
      const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'date-asc':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'total-desc':
          return b.total - a.total;
        case 'total-asc':
          return a.total - b.total;
        default:
          return 0;
      }
    });

  const handleOrderClick = async (order: Order) => {
    try {
      const orderDetails = await fetchOrderDetails(order.id);
      setSelectedOrder(orderDetails);
      setShowOrderDetails(true);
    } catch (error) {
      console.error('Failed to fetch order details:', error);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      refunded: 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status: string) => {
    const texts = {
      pending: 'Chờ xử lý',
      processing: 'Đang xử lý',
      shipped: 'Đang giao hàng',
      delivered: 'Đã giao hàng',
      cancelled: 'Đã hủy',
      refunded: 'Đã hoàn tiền'
    };
    return texts[status as keyof typeof texts] || status;
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <Alert variant="destructive" className="max-w-md mx-auto mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={fetchOrders}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Thử lại
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Đơn hàng của tôi</h1>
          <p className="text-muted-foreground">
            Xem lịch sử và theo dõi tình trạng đơn hàng.
          </p>
        </div>
        <Button onClick={fetchOrders} disabled={isLoading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Làm mới
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo mã đơn hàng hoặc sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="w-full lg:w-48">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="pending">Chờ xử lý</SelectItem>
                <SelectItem value="processing">Đang xử lý</SelectItem>
                <SelectItem value="shipped">Đang giao hàng</SelectItem>
                <SelectItem value="delivered">Đã giao hàng</SelectItem>
                <SelectItem value="cancelled">Đã hủy</SelectItem>
                <SelectItem value="refunded">Đã hoàn tiền</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort */}
          <div className="w-full lg:w-48">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sắp xếp" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date-desc">Mới nhất</SelectItem>
                <SelectItem value="date-asc">Cũ nhất</SelectItem>
                <SelectItem value="total-desc">Giá giảm dần</SelectItem>
                <SelectItem value="total-asc">Giá tăng dần</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Order Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {orders.filter(o => o.status === 'pending').length}
          </div>
          <div className="text-sm text-muted-foreground">Chờ xử lý</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">
            {orders.filter(o => o.status === 'shipped').length}
          </div>
          <div className="text-sm text-muted-foreground">Đang giao</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {orders.filter(o => o.status === 'delivered').length}
          </div>
          <div className="text-sm text-muted-foreground">Đã giao</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold">
            {orders.length}
          </div>
          <div className="text-sm text-muted-foreground">Tổng đơn</div>
        </Card>
      </div>

      {/* Orders List */}
      {filteredAndSortedOrders.length === 0 ? (
        <Card className="p-12 text-center">
          <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            {searchTerm || statusFilter !== 'all' ? 'Không tìm thấy đơn hàng nào' : 'Chưa có đơn hàng nào'}
          </h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || statusFilter !== 'all'
              ? 'Thử thay đổi bộ lọc hoặc tìm kiếm'
              : 'Bắt đầu mua sắm để tạo đơn hàng đầu tiên của bạn.'
            }
          </p>
          {(searchTerm || statusFilter !== 'all') && (
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setSortBy('date-desc');
              }}
            >
              Xóa bộ lọc
            </Button>
          )}
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredAndSortedOrders.map((order) => (
            <Card key={order.id} className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{order.orderNumber}</h3>
                  <p className="text-sm text-muted-foreground">
                    Đặt hàng vào {new Date(order.createdAt).toLocaleDateString('vi-VN')} • {order.items.length} sản phẩm
                  </p>
                </div>
                <div className="text-right">
                  <Badge className={getStatusColor(order.status)}>
                    {getStatusText(order.status)}
                  </Badge>
                  <div className="text-lg font-semibold mt-1">
                    {new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                      minimumFractionDigits: 0,
                    }).format(order.total * 23000)}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {order.items.slice(0, 2).map((item) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.quantity} × {new Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND',
                          minimumFractionDigits: 0,
                        }).format(item.price * 23000)}
                      </p>
                    </div>
                  </div>
                ))}

                {order.items.length > 2 && (
                  <p className="text-sm text-muted-foreground">
                    +{order.items.length - 2} sản phẩm khác
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <div className="text-sm text-muted-foreground">
                  {order.trackingNumber && (
                    <span>Mã vận chuyển: {order.trackingNumber}</span>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOrderClick(order)}
                >
                  Xem chi tiết
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Order Details Modal/Section */}
      {showOrderDetails && selectedOrder && (
        <OrderHistory
          order={selectedOrder}
          onClose={() => setShowOrderDetails(false)}
        />
      )}
    </div>
  );
}