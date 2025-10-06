"use client";

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
const productFormSchema = z
  .object({
    title: z.string().min(3),
    sku: z.string().min(1),
    price: z.number().nonnegative(),
    discountPrice: z.number().nonnegative().optional(),
    stock: z.number().int().nonnegative(),
    description: z.string().max(500).optional(),
    visibility: z.boolean().default(true)
  })
  .refine((data) => !data.discountPrice || data.discountPrice <= data.price, {
    path: ['discountPrice'],
    message: 'Discount price must be lower than base price'
  });

type ProductFormValues = z.infer<typeof productFormSchema>;

interface ProductFormProps {
  defaultValues?: Partial<ProductFormValues>;
  onSubmit: (values: ProductFormValues) => Promise<void> | void;
  submitting?: boolean;
}

export function ProductForm({ defaultValues, onSubmit, submitting }: ProductFormProps) {
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      title: '',
      sku: '',
      price: 0,
      stock: 0,
      visibility: true,
      ...defaultValues
    }
  });

  return (
    <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" placeholder="Wireless earbuds" {...form.register('title')} />
          {form.formState.errors.title && (
            <p className="text-xs text-destructive">{form.formState.errors.title.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="sku">SKU</Label>
          <Input id="sku" placeholder="SKU-123" {...form.register('sku')} />
          {form.formState.errors.sku && (
            <p className="text-xs text-destructive">{form.formState.errors.sku.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">Price</Label>
          <Input id="price" type="number" step="0.01" {...form.register('price', { valueAsNumber: true })} />
          {form.formState.errors.price && (
            <p className="text-xs text-destructive">{form.formState.errors.price.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="discountPrice">Discount price</Label>
          <Input
            id="discountPrice"
            type="number"
            step="0.01"
            {...form.register('discountPrice', { valueAsNumber: true })}
          />
          {form.formState.errors.discountPrice && (
            <p className="text-xs text-destructive">{form.formState.errors.discountPrice.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="stock">Stock</Label>
          <Input id="stock" type="number" {...form.register('stock', { valueAsNumber: true })} />
          {form.formState.errors.stock && (
            <p className="text-xs text-destructive">{form.formState.errors.stock.message}</p>
          )}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" rows={4} {...form.register('description')} />
        {form.formState.errors.description && (
          <p className="text-xs text-destructive">{form.formState.errors.description.message}</p>
        )}
      </div>
      <div className="flex items-center justify-between rounded-md border p-4">
        <div>
          <p className="text-sm font-medium">Visible</p>
          <p className="text-xs text-muted-foreground">Hide product from storefront without deleting.</p>
        </div>
        <Switch checked={form.watch('visibility')} onCheckedChange={(checked) => form.setValue('visibility', checked)} />
      </div>
      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => form.reset()}>Reset</Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Saving…' : 'Save product'}
        </Button>
      </div>
    </form>
  );
}
