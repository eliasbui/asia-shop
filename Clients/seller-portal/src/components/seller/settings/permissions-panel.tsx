"use client";

import { useState } from 'react';

import { RolePermissionForm } from './role-permission-form';

const initialPermissions: Record<string, string[]> = {
  manager: ['products.view', 'products.edit', 'orders.view', 'orders.edit'],
  staff: ['orders.view'],
  accountant: ['payouts.view', 'reports.view']
};

export function PermissionsPanel() {
  const [permissions, setPermissions] = useState(initialPermissions);

  return (
    <div className="space-y-8">
      {Object.entries(permissions).map(([role, values]) => (
        <RolePermissionForm
          key={role}
          role={role}
          assigned={values}
          onChange={(next) => setPermissions((prev) => ({ ...prev, [role]: next }))}
        />
      ))}
    </div>
  );
}
