"use client";

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { uiStore } from '@/lib/state/ui-store';

interface FulfillmentModalProps {
  orderId: string;
  onConfirm: (payload: { orderId: string; notes?: string }) => Promise<void> | void;
}

export function FulfillmentModal({ orderId, onConfirm }: FulfillmentModalProps) {
  const open = uiStore((state) => state.isFulfillmentOpen);
  const close = uiStore((state) => state.closeFulfillment);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  return (
    <Dialog open={open} onOpenChange={(value) => (value ? uiStore.getState().openFulfillment() : close())}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Batch fulfill order</DialogTitle>
          <DialogDescription>Create a shipping manifest and mark items as shipped.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label htmlFor="order">Order ID</Label>
            <p className="text-sm font-medium">{orderId}</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Add fulfillment instructions"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={close}>
            Cancel
          </Button>
          <Button
            disabled={loading}
            onClick={async () => {
              setLoading(true);
              await onConfirm({ orderId, notes });
              setLoading(false);
              close();
            }}
          >
            {loading ? 'Processing…' : 'Fulfill order'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
