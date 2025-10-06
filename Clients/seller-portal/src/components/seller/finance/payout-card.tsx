import { Banknote } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Payout } from '@/lib/api/seller/types';

interface PayoutCardProps {
  payout: Payout;
}

export function PayoutCard({ payout }: PayoutCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-medium">Scheduled payout</CardTitle>
        <Banknote className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-2xl font-semibold">{formatCurrency(payout.amount)}</div>
        <CardDescription>
          {payout.status === 'pending' ? 'Processing' : payout.status.toUpperCase()} • {payout.account}
        </CardDescription>
        <div className="text-xs text-muted-foreground">
          Scheduled {new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(payout.scheduledFor)}
        </div>
        <div className="text-xs font-mono text-muted-foreground">{payout.reference}</div>
      </CardContent>
    </Card>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value);
}
