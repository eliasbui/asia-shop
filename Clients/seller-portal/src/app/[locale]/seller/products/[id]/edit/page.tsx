import { ProductForm } from '@/components/seller/forms/product-form';

const mockProduct = {
  title: 'Wireless Earbuds',
  sku: 'ASIA-001',
  price: 129,
  discountPrice: 99,
  stock: 240,
  description: 'Noise cancelling wireless earbuds',
  visibility: true
};

export default function EditProductPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Edit product</h1>
        <p className="text-sm text-muted-foreground">Update pricing, inventory, and metadata for {params.id}.</p>
      </div>
      <ProductForm defaultValues={mockProduct} onSubmit={async () => undefined} />
    </div>
  );
}
