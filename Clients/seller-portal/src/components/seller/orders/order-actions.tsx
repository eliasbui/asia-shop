"use client";

import { Download, Printer } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { uiStore } from '@/lib/state/ui-store';

interface OrderActionsProps {
  orderId: string;
}

export function OrderActions({ orderId }: OrderActionsProps) {
  const openFulfillment = uiStore((state) => state.openFulfillment);

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={() => window.print()}>
        <Printer className="mr-2 h-4 w-4" /> Label
      </Button>
      <Button variant="outline" size="sm">
        <Download className="mr-2 h-4 w-4" /> Invoice
      </Button>
      <Button size="sm" onClick={() => openFulfillment()}>
        Fulfill
      </Button>
    </div>
  );
}
