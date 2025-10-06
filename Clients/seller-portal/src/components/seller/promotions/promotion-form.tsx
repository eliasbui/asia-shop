"use client";

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

const promotionSchema = z.object({
  name: z.string().min(3),
  percentage: z.number().min(0).max(90),
  flashSale: z.boolean(),
  startAt: z.string().optional(),
  endAt: z.string().optional()
});

type PromotionValues = z.infer<typeof promotionSchema>;

interface PromotionFormProps {
  defaultValues?: Partial<PromotionValues>;
  onSubmit: (values: PromotionValues) => Promise<void> | void;
}

export function PromotionForm({ defaultValues, onSubmit }: PromotionFormProps) {
  const form = useForm<PromotionValues>({
    resolver: zodResolver(promotionSchema),
    defaultValues: {
      name: '',
      percentage: 10,
      flashSale: false,
      ...defaultValues
    }
  });

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <Label htmlFor="name">Promotion name</Label>
        <Input id="name" {...form.register('name')} />
        {form.formState.errors.name && (
          <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
        )}
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="percentage">Discount %</Label>
          <Input
            id="percentage"
            type="number"
            min={0}
            max={90}
            {...form.register('percentage', { valueAsNumber: true })}
          />
          {form.formState.errors.percentage && (
            <p className="text-xs text-destructive">{form.formState.errors.percentage.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="flashSale">Flash sale</Label>
          <div className="flex items-center justify-between rounded-md border p-3">
            <span className="text-sm text-muted-foreground">Limited time offer</span>
            <Switch checked={form.watch('flashSale')} onCheckedChange={(value) => form.setValue('flashSale', value)} />
          </div>
        </div>
      </div>
      {form.watch('flashSale') && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="startAt">Start</Label>
            <Input id="startAt" type="datetime-local" {...form.register('startAt')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endAt">End</Label>
            <Input id="endAt" type="datetime-local" {...form.register('endAt')} />
          </div>
        </div>
      )}
      <div className="flex justify-end">
        <Button type="submit">Save promotion</Button>
      </div>
    </form>
  );
}
