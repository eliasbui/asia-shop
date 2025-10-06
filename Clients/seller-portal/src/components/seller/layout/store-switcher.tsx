"use client";

import { ChevronsUpDown, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface StoreSwitcherProps {
  stores: Array<{ id: string; name: string }>;
  activeStoreId: string | null;
  onChange: (storeId: string) => void;
}

export function StoreSwitcher({ stores, activeStoreId, onChange }: StoreSwitcherProps) {
  if (!stores?.length) {
    return (
      <Button size="sm" variant="outline" className="gap-2">
        <Plus className="h-4 w-4" />
        Add store
      </Button>
    );
  }

  return (
    <Select defaultValue={activeStoreId ?? stores[0].id} onValueChange={onChange}>
      <SelectTrigger className="w-56 justify-between">
        <SelectValue />
        <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
      </SelectTrigger>
      <SelectContent>
        {stores.map((store) => (
          <SelectItem key={store.id} value={store.id}>
            {store.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
