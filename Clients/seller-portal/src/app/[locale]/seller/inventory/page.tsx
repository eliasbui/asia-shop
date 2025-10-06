import { InventoryTable } from '@/components/seller/inventory/inventory-table';
import { productVariantSchema } from '@/lib/api/seller/types';

const variants = productVariantSchema.array().parse([
  {
    id: 'variant-1',
    sku: 'ASIA-001-BLK',
    title: 'Wireless Earbuds • Black',
    price: 99,
    available: 120,
    reserved: 24,
    sold: 412,
    defective: 3
  },
  {
    id: 'variant-2',
    sku: 'ASIA-001-WHT',
    title: 'Wireless Earbuds • White',
    price: 99,
    available: 88,
    reserved: 18,
    sold: 298,
    defective: 1
  }
]);

export default function InventoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Inventory</h1>
        <p className="text-sm text-muted-foreground">Track stock across variants and warehouses.</p>
      </div>
      <InventoryTable variants={variants} />
    </div>
  );
}
