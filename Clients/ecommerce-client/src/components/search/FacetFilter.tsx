'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FacetOption {
  value: string;
  label: string;
  count: number;
}

interface FacetFilterProps {
  facet: string;
  options: FacetOption[];
  selectedValues: string[];
  onChange: (value: string, checked: boolean) => void;
}

const facetLabels: Record<string, string> = {
  brand: 'Thương hiệu',
  price: 'Khoảng giá',
  rating: 'Đánh giá',
  availability: 'Tình trạng'
};

export function FacetFilter({ facet, options, selectedValues, onChange }: FacetFilterProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showAll, setShowAll] = useState(false);

  const displayOptions = showAll ? options : options.slice(0, 5);

  const renderPriceRange = (value: string) => {
    const ranges: Record<string, string> = {
      '0-5000000': 'Dưới 5 triệu',
      '5000000-10000000': '5 - 10 triệu',
      '10000000-20000000': '10 - 20 triệu',
      '20000000-50000000': '20 - 50 triệu',
      '50000000+': 'Trên 50 triệu'
    };
    return ranges[value] || value;
  };

  const renderRating = (value: string) => {
    const rating = parseInt(value);
    return `${rating} sao trở lên`;
  };

  const renderLabel = (value: string) => {
    if (facet === 'price') return renderPriceRange(value);
    if (facet === 'rating') return renderRating(value);
    return value;
  };

  return (
    <div className="border-b pb-4 last:border-b-0">
      <Button
        variant="ghost"
        className="w-full justify-between p-0 h-auto font-semibold"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span>{facetLabels[facet] || facet}</span>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </Button>

      {isExpanded && (
        <div className="mt-3 space-y-2">
          {displayOptions.map((option) => {
            const isChecked = selectedValues.includes(option.value);

            return (
              <label
                key={option.value}
                className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded"
              >
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => onChange(option.value, e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm">{renderLabel(option.value)}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  ({option.count})
                </span>
              </label>
            );
          })}

          {options.length > 5 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-blue-600 hover:text-blue-700 p-0 h-auto text-sm"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? 'Thu gọn' : `Xem thêm ${options.length - 5} lựa chọn`}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}