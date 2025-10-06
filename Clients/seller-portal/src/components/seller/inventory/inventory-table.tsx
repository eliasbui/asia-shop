import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ProductVariant } from '@/lib/api/seller/types';

interface InventoryTableProps {
  variants: ProductVariant[];
}

export function InventoryTable({ variants }: InventoryTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Variant</TableHead>
          <TableHead>Available</TableHead>
          <TableHead>Reserved</TableHead>
          <TableHead>Sold</TableHead>
          <TableHead>Defective</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {variants.map((variant) => (
          <TableRow key={variant.id}>
            <TableCell>
              <div className="space-y-1">
                <p className="text-sm font-medium">{variant.title}</p>
                <Badge className="text-xs">{variant.sku}</Badge>
              </div>
            </TableCell>
            <TableCell>{variant.available}</TableCell>
            <TableCell>{variant.reserved}</TableCell>
            <TableCell>{variant.sold}</TableCell>
            <TableCell>{variant.defective}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
