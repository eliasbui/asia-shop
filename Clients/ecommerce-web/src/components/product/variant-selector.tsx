'use client';

import { cn } from '@/lib/utils';

interface VariantOption {
  value: string;
  available?: boolean;
}

interface VariantSelectorProps {
  label: string;
  options: VariantOption[];
  selected?: string;
  onSelect: (value: string) => void;
}

export function VariantSelector({
  label,
  options,
  selected,
  onSelect,
}: VariantSelectorProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">{label}</label>
        {selected && (
          <span className="text-sm text-muted-foreground">{selected}</span>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => option.available !== false && onSelect(option.value)}
            disabled={option.available === false}
            className={cn(
              'px-4 py-2 rounded-md border text-sm font-medium transition-colors',
              'hover:bg-accent hover:text-accent-foreground',
              'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent',
              selected === option.value
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-input bg-background'
            )}
          >
            {option.value}
          </button>
        ))}
      </div>
    </div>
  );
}

