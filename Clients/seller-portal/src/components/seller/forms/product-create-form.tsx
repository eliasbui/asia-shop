"use client";

import { useState } from 'react';

import { ProductForm } from './product-form';

export function ProductCreateForm() {
  const [saving, setSaving] = useState(false);

  return (
    <ProductForm
      submitting={saving}
      onSubmit={async (values) => {
        setSaving(true);
        await fetch('/api/mock/products', {
          method: 'POST',
          body: JSON.stringify(values)
        });
        setSaving(false);
      }}
    />
  );
}
