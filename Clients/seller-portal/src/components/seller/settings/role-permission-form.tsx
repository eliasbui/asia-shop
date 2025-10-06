"use client";

import { useMemo } from 'react';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

const permissions = {
  products: ['products.view', 'products.edit'],
  orders: ['orders.view', 'orders.edit'],
  payouts: ['payouts.view'],
  reports: ['reports.view', 'reports.export']
};

interface RolePermissionFormProps {
  role: string;
  assigned: string[];
  onChange: (permissions: string[]) => void;
}

export function RolePermissionForm({ role, assigned, onChange }: RolePermissionFormProps) {
  const assignedSet = useMemo(() => new Set(assigned), [assigned]);

  return (
    <form className="space-y-6" onSubmit={(event) => event.preventDefault()}>
      <div className="space-y-1">
        <h3 className="text-lg font-semibold capitalize">{role}</h3>
        <p className="text-sm text-muted-foreground">Configure granular access for staff members.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {Object.entries(permissions).map(([group, values]) => (
          <div key={group} className="rounded-lg border p-4">
            <h4 className="text-sm font-semibold capitalize">{group}</h4>
            <div className="mt-3 space-y-3">
              {values.map((permission) => (
                <div key={permission} className="flex items-center justify-between">
                  <Label htmlFor={`${role}-${permission}`} className="text-sm">
                    {permission}
                  </Label>
                  <Switch
                    id={`${role}-${permission}`}
                    checked={assignedSet.has(permission)}
                    onCheckedChange={(checked) => {
                      const next = new Set(assignedSet);
                      if (checked) next.add(permission);
                      else next.delete(permission);
                      onChange(Array.from(next));
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-end">
        <Button type="button" onClick={() => onChange(Array.from(assignedSet))}>
          Save permissions
        </Button>
      </div>
    </form>
  );
}
