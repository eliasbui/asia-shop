'use client';

import { useState } from 'react';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface SortDropdownProps {
  onSortChange: (sort: string) => void;
}

const sortOptions = [
  { value: 'relevance', label: 'Phù hợp nhất' },
  { value: 'price-asc', label: 'Giá: Thấp đến cao' },
  { value: 'price-desc', label: 'Giá: Cao đến thấp' },
  { value: 'rating-desc', label: 'Đánh giá cao nhất' },
  { value: 'newest', label: 'Mới nhất' },
  { value: 'bestseller', label: 'Bán chạy nhất' },
  { value: 'discount-desc', label: 'Giảm giá nhiều nhất' }
];

export function SortDropdown({ onSortChange }: SortDropdownProps) {
  const [selectedSort, setSelectedSort] = useState('relevance');

  const handleSortSelect = (value: string) => {
    setSelectedSort(value);
    onSortChange(value);
  };

  const selectedLabel = sortOptions.find(option => option.value === selectedSort)?.label;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-48 justify-between">
          <span className="truncate">{selectedLabel}</span>
          <ArrowUpDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {sortOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => handleSortSelect(option.value)}
            className={selectedSort === option.value ? 'bg-accent' : ''}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}