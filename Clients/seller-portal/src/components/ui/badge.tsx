import type { HTMLAttributes } from 'react';

import { cn } from '@/lib/utils/cn';

const badgeVariants = {
  default: 'inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium',
  success: 'inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-500',
  warning: 'inline-flex items-center rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-600',
  danger: 'inline-flex items-center rounded-full bg-rose-500/10 px-2.5 py-0.5 text-xs font-medium text-rose-500'
} as const;

type BadgeVariant = keyof typeof badgeVariants;

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return <span className={cn(badgeVariants[variant], className)} {...props} />;
}
