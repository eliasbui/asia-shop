import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Order } from '@/lib/api/seller/types';

interface OrderDetailProps {
  order: Order;
}

export function OrderDetail({ order }: OrderDetailProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <Card>
        <CardHeader>
          <CardTitle>Items</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Unit price</TableHead>
                <TableHead>Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{item.title}</p>
                      {item.variant && <p className="text-xs text-muted-foreground">Variant: {item.variant}</p>}
                    </div>
                  </TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{formatCurrency(item.unitPrice, order.currency)}</TableCell>
                  <TableCell>{formatCurrency(item.unitPrice * item.quantity, order.currency)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span>Order date</span>
            <span>{new Intl.DateTimeFormat().format(order.createdAt)}</span>
          </div>
          <div className="flex justify-between">
            <span>Status</span>
            <span className="font-medium capitalize">{order.status}</span>
          </div>
          <div className="flex justify-between">
            <span>Total</span>
            <span className="text-base font-semibold">{formatCurrency(order.total, order.currency)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function formatCurrency(value: number, currency: string) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2
  }).format(value);
}
