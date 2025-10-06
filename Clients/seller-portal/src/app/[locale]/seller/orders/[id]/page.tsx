import { Suspense } from 'react';

import { FulfillmentModal } from '@/components/seller/orders/fulfillment-modal';
import { OrderDetail } from '@/components/seller/orders/order-detail';
import { OrderActions } from '@/components/seller/orders/order-actions';
import { Skeleton } from '@/components/shared/skeleton';
import { orderSchema } from '@/lib/api/seller/types';

const order = orderSchema.parse({
  id: 'ord_1',
  orderNumber: '100045',
  status: 'confirmed',
  customerName: 'Linh Nguyen',
  total: 398,
  currency: 'USD',
  createdAt: new Date().toISOString(),
  storeId: 'store-1',
  items: [
    { id: 'item_1', productId: 'prod_1', title: 'Wireless Earbuds', quantity: 2, unitPrice: 99, variant: 'Black' }
  ]
});

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Order #{params.id}</h1>
          <p className="text-sm text-muted-foreground">Customer: {order.customerName}</p>
        </div>
        <OrderActions orderId={params.id} />
      </div>
      <Suspense fallback={<Skeleton className="h-64 w-full" />}>
        <OrderDetail order={order} />
      </Suspense>
      <FulfillmentModal orderId={params.id} onConfirm={async () => undefined} />
    </div>
  );
}
