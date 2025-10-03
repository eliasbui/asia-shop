'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import { CollectionFiltersProps } from '@/lib/types/collections';
import { formatCurrency } from '@/lib/utils/format';
import { cn } from '@/lib/utils/cn';

export function CollectionFilters({
  filters,
  activeFilters,
  onFilterChange,
  className = ''
}: CollectionFiltersProps) {
  const [openSections, setOpenSections] = useState<Set<string>>(
    new Set(filters.map(f => f.id))
  );

  const handleCheckboxChange = (filterId: string, value: string, checked: boolean) => {
    const currentValues = activeFilters[filterId] || [];
    let newValues: string[];

    if (checked) {
      newValues = [...currentValues, value];
    } else {
      newValues = currentValues.filter((v: string) => v !== value);
    }

    onFilterChange({
      ...activeFilters,
      [filterId]: newValues
    });
  };

  const handleSelectChange = (filterId: string, value: string) => {
    onFilterChange({
      ...activeFilters,
      [filterId]: value
    });
  };

  const handleRangeChange = (filterId: string, values: number[]) => {
    onFilterChange({
      ...activeFilters,
      [filterId]: values
    });
  };

  const clearFilter = (filterId: string) => {
    const newFilters = { ...activeFilters };
    delete newFilters[filterId];
    onFilterChange(newFilters);
  };

  const clearAllFilters = () => {
    onFilterChange({});
  };

  const toggleSection = (filterId: string) => {
    const newOpenSections = new Set(openSections);
    if (newOpenSections.has(filterId)) {
      newOpenSections.delete(filterId);
    } else {
      newOpenSections.add(filterId);
    }
    setOpenSections(newOpenSections);
  };

  const hasActiveFilters = Object.keys(activeFilters).length > 0;

  return (
    <div className={cn('space-y-6', className)}>
      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="border-b pb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-sm">Active Filters</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-xs"
            >
              Clear All
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(activeFilters).map(([filterId, value]) => {
              const filter = filters.find(f => f.id === filterId);
              if (!filter) return null;

              const getFilterLabel = () => {
                if (filter.type === 'range' && Array.isArray(value)) {
                  return `${filter.name}: ${formatCurrency(value[0])} - ${formatCurrency(value[1])}`;
                }
                if (filter.type === 'select') {
                  const option = filter.options?.find(opt => opt.value === value);
                  return `${filter.name}: ${option?.label || value}`;
                }
                if (filter.type === 'checkbox' && Array.isArray(value)) {
                  return `${filter.name}: ${value.length} selected`;
                }
                return `${filter.name}: ${value}`;
              };

              return (
                <Badge
                  key={filterId}
                  variant="secondary"
                  className="gap-1 pr-1"
                >
                  {getFilterLabel()}
                  <button
                    onClick={() => clearFilter(filterId)}
                    className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              );
            })}
          </div>
        </div>
      )}

      {/* Filter Sections */}
      <div className="space-y-4">
        {filters.map((filter) => (
          <Collapsible
            key={filter.id}
            open={openSections.has(filter.id)}
            onOpenChange={() => toggleSection(filter.id)}
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full py-2 hover:bg-gray-50 rounded-lg px-2 transition-colors">
              <h3 className="font-medium">{filter.name}</h3>
              {openSections.has(filter.id) ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </CollapsibleTrigger>

            <CollapsibleContent className="space-y-3 pt-2">
              {filter.type === 'checkbox' && filter.options && (
                <div className="space-y-2">
                  {filter.options.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`${filter.id}-${option.value}`}
                        checked={(activeFilters[filter.id] || []).includes(option.value)}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange(filter.id, option.value, checked as boolean)
                        }
                      />
                      <Label
                        htmlFor={`${filter.id}-${option.value}`}
                        className="text-sm font-normal cursor-pointer flex-1"
                      >
                        {option.label}
                      </Label>
                      {option.count && (
                        <span className="text-xs text-gray-500">
                          ({option.count})
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {filter.type === 'select' && filter.options && (
                <Select
                  value={activeFilters[filter.id] || ''}
                  onValueChange={(value) => handleSelectChange(filter.id, value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={`Select ${filter.name}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {filter.options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center justify-between w-full">
                          <span>{option.label}</span>
                          {option.count && (
                            <span className="text-xs text-gray-500 ml-2">
                              ({option.count})
                            </span>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {filter.type === 'range' && (
                <div className="space-y-3">
                  <Slider
                    value={activeFilters[filter.id] || [filter.min || 0, filter.max || 100]}
                    onValueChange={(values) => handleRangeChange(filter.id, values)}
                    max={filter.max}
                    min={filter.min}
                    step={filter.step || 1}
                    className="w-full"
                  />
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{formatCurrency(filter.min || 0)}</span>
                    <span className="font-medium text-gray-900">
                      {formatCurrency(
                        Array.isArray(activeFilters[filter.id])
                          ? activeFilters[filter.id][1]
                          : filter.max || 100
                      )}
                    </span>
                    <span>{formatCurrency(filter.max || 100)}</span>
                  </div>
                </div>
              )}
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </div>
  );
}