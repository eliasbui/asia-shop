"use client";

import { motion } from 'framer-motion';

interface Point {
  label: string;
  value: number;
}

interface RevenueChartClientProps {
  data: Point[];
  currency: string;
}

export default function RevenueChartClient({ data, currency }: RevenueChartClientProps) {
  if (!data.length) {
    return <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">No chart data</div>;
  }

  const maxValue = Math.max(...data.map((point) => point.value));
  const points = data
    .map((point, index) => {
      const x = (index / Math.max(1, data.length - 1)) * 100;
      const y = 100 - (point.value / maxValue) * 100;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <figure className="space-y-4">
      <svg viewBox="0 0 100 100" className="h-64 w-full rounded-lg bg-muted/30 p-4" preserveAspectRatio="none">
        <defs>
          <linearGradient id="revenueGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.35" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polyline
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="1.5"
          points={points}
          vectorEffect="non-scaling-stroke"
        />
        <motion.polygon
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          fill="url(#revenueGradient)"
          points={`${points} 100,100 0,100`}
        />
      </svg>
      <figcaption className="grid grid-cols-3 gap-3 text-xs text-muted-foreground">
        {data.map((point) => (
          <div key={point.label}>
            <div className="font-medium text-foreground">{formatCurrency(point.value, currency)}</div>
            <div>{point.label}</div>
          </div>
        ))}
      </figcaption>
    </figure>
  );
}

function formatCurrency(value: number, currency: string) {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0
  }).format(value);
}
