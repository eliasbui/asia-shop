import { TrendingDown, TrendingUp } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils/cn';

interface DashboardCardProps {
  title: string;
  value: string;
  delta?: number;
  trend?: 'up' | 'down';
  description?: string;
}

export function DashboardCard({ title, value, delta, trend = 'up', description }: DashboardCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {delta !== undefined && (
          <span
            className={cn(
              'inline-flex items-center gap-1 text-xs font-medium',
              trend === 'up' ? 'text-emerald-500' : 'text-rose-500'
            )}
          >
            {trend === 'up' ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
            {delta}%
          </span>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold">{value}</div>
        {description && <CardDescription>{description}</CardDescription>}
      </CardContent>
    </Card>
  );
}
