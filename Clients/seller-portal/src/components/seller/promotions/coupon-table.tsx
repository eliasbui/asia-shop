import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Coupon {
  id: string;
  code: string;
  usageLimit: number;
  used: number;
  expiresAt?: string;
}

interface CouponTableProps {
  coupons: Coupon[];
  onGenerate?: () => void;
}

export function CouponTable({ coupons, onGenerate }: CouponTableProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Coupons</h3>
        <Button size="sm" onClick={onGenerate}>
          Generate code
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Usage</TableHead>
            <TableHead>Expires</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {coupons.map((coupon) => (
            <TableRow key={coupon.id}>
              <TableCell>
                <Badge className="font-mono text-xs">{coupon.code}</Badge>
              </TableCell>
              <TableCell>
                {coupon.used}/{coupon.usageLimit}
              </TableCell>
              <TableCell>
                {coupon.expiresAt
                  ? new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(coupon.expiresAt))
                  : 'No expiry'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
