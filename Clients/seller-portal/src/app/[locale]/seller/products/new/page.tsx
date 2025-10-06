import { ProductCreateForm } from '@/components/seller/forms/product-create-form';

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Create product</h1>
        <p className="text-sm text-muted-foreground">
          Upload product details, manage pricing, and configure visibility across stores.
        </p>
      </div>
      <ProductCreateForm />
    </div>
  );
}
