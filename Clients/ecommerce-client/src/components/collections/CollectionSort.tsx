'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

interface CollectionSortProps {
  onSortChange: (sortValue: string) => void;
  className?: string;
}

export function CollectionSort({ onSortChange, className = '' }: CollectionSortProps) {
  const [sortValue, setSortValue] = useState('featured');

  const handleSortChange = (value: string) => {
    setSortValue(value);
    onSortChange(value);
  };

  const sortOptions = [
    { value: 'featured', label: 'Featured', icon: <ArrowUpDown className="h-4 w-4" /> },
    { value: 'price-low-high', label: 'Price: Low to High', icon: <ArrowUp className="h-4 w-4" /> },
    { value: 'price-high-low', label: 'Price: High to Low', icon: <ArrowDown className="h-4 w-4" /> },
    { value: 'name-az', label: 'Name: A to Z', icon: <ArrowUp className="h-4 w-4" /> },
    { value: 'name-za', label: 'Name: Z to A', icon: <ArrowDown className="h-4 w-4" /> },
    { value: 'rating', label: 'Customer Rating', icon: <ArrowUpDown className="h-4 w-4" /> },
    { value: 'newest', label: 'Newest First', icon: <ArrowDown className="h-4 w-4" /> },
  ];

  const currentSort = sortOptions.find(option => option.value === sortValue);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-sm text-gray-600 whitespace-nowrap">Sort by:</span>
      <Select value={sortValue} onValueChange={handleSortChange}>
        <SelectTrigger className="w-48">
          <div className="flex items-center gap-2">
            {currentSort?.icon}
            <SelectValue placeholder="Sort products" />
          </div>
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              <div className="flex items-center gap-2">
                {option.icon}
                <span>{option.label}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}