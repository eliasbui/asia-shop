"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown, X, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export interface FacetOption {
  value: string;
  label: string;
  count?: number;
}

export interface Facet {
  id: string;
  label: string;
  type: "checkbox" | "radio" | "range" | "color";
  options?: FacetOption[];
  range?: {
    min: number;
    max: number;
    step?: number;
    prefix?: string;
    suffix?: string;
  };
}

export interface FilterValues {
  [key: string]: string | string[] | number[] | undefined;
}

interface FacetFilterProps {
  facets: Facet[];
  values: FilterValues;
  onChange: (values: FilterValues) => void;
  onClear?: () => void;
  showMobileToggle?: boolean;
  className?: string;
}

export function FacetFilter({
  facets,
  values,
  onChange,
  onClear,
  showMobileToggle = true,
  className,
}: FacetFilterProps) {
  const t = useTranslations();
  const [openFacets, setOpenFacets] = useState<string[]>(
    facets.map((f) => f.id)
  );

  const toggleFacet = (facetId: string) => {
    setOpenFacets((prev) =>
      prev.includes(facetId)
        ? prev.filter((id) => id !== facetId)
        : [...prev, facetId]
    );
  };

  const handleCheckboxChange = (facetId: string, optionValue: string) => {
    const currentValues = (values[facetId] as string[]) || [];
    const newValues = currentValues.includes(optionValue)
      ? currentValues.filter((v) => v !== optionValue)
      : [...currentValues, optionValue];
    
    onChange({
      ...values,
      [facetId]: newValues.length > 0 ? newValues : undefined,
    });
  };

  const handleRadioChange = (facetId: string, optionValue: string) => {
    onChange({
      ...values,
      [facetId]: optionValue,
    });
  };

  const handleRangeChange = (facetId: string, rangeValues: number[]) => {
    onChange({
      ...values,
      [facetId]: rangeValues,
    });
  };

  const handleColorChange = (facetId: string, colorValue: string) => {
    const currentValues = (values[facetId] as string[]) || [];
    const newValues = currentValues.includes(colorValue)
      ? currentValues.filter((v) => v !== colorValue)
      : [...currentValues, colorValue];
    
    onChange({
      ...values,
      [facetId]: newValues.length > 0 ? newValues : undefined,
    });
  };

  const getActiveFiltersCount = () => {
    return Object.keys(values).filter((key) => {
      const value = values[key];
      if (Array.isArray(value)) return value.length > 0;
      return value !== undefined && value !== null && value !== "";
    }).length;
  };

  const FilterContent = () => (
    <div className="space-y-4">
      {/* Active Filters */}
      {getActiveFiltersCount() > 0 && (
        <div className="flex flex-wrap gap-2 pb-4 border-b">
          {Object.entries(values).map(([facetId, value]) => {
            const facet = facets.find((f) => f.id === facetId);
            if (!facet || !value) return null;

            if (Array.isArray(value)) {
              return value.map((v) => {
                const option = facet.options?.find((o) => o.value === v);
                return (
                  <Badge key={`${facetId}-${v}`} variant="secondary">
                    {option?.label || v}
                    <button
                      onClick={() => handleCheckboxChange(facetId, String(v))}
                      className="ml-1.5 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                );
              });
            }

            if (facet.type === "range" && Array.isArray(value)) {
              return (
                <Badge key={facetId} variant="secondary">
                  {facet.range?.prefix}{value[0]} - {value[1]}{facet.range?.suffix}
                  <button
                    onClick={() => onChange({ ...values, [facetId]: undefined })}
                    className="ml-1.5 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              );
            }

            const option = facet.options?.find((o) => o.value === value);
            return (
              <Badge key={facetId} variant="secondary">
                {option?.label || value}
                <button
                  onClick={() => onChange({ ...values, [facetId]: undefined })}
                  className="ml-1.5 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            );
          })}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="h-6 px-2 text-xs"
          >
            {t("common.clearAll")}
          </Button>
        </div>
      )}

      {/* Facets */}
      {facets.map((facet) => (
        <Collapsible
          key={facet.id}
          open={openFacets.includes(facet.id)}
          onOpenChange={() => toggleFacet(facet.id)}
        >
          <CollapsibleTrigger className="flex w-full items-center justify-between py-2 text-sm font-medium hover:text-primary">
            {facet.label}
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform",
                openFacets.includes(facet.id) && "rotate-180"
              )}
            />
          </CollapsibleTrigger>
          
          <CollapsibleContent className="pt-2">
            {/* Checkbox Facet */}
            {facet.type === "checkbox" && facet.options && (
              <div className="space-y-2">
                {facet.options.map((option) => {
                  const isChecked = (values[facet.id] as string[])?.includes(
                    option.value
                  );
                  return (
                    <div key={option.value} className="flex items-center">
                      <Checkbox
                        id={`${facet.id}-${option.value}`}
                        checked={isChecked}
                        onCheckedChange={() =>
                          handleCheckboxChange(facet.id, option.value)
                        }
                      />
                      <label
                        htmlFor={`${facet.id}-${option.value}`}
                        className="ml-2 flex-1 text-sm cursor-pointer"
                      >
                        {option.label}
                        {option.count !== undefined && (
                          <span className="ml-1 text-muted-foreground">
                            ({option.count})
                          </span>
                        )}
                      </label>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Radio Facet */}
            {facet.type === "radio" && facet.options && (
              <RadioGroup
                value={values[facet.id] as string}
                onValueChange={(value) => handleRadioChange(facet.id, value)}
              >
                {facet.options.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem
                      value={option.value}
                      id={`${facet.id}-${option.value}`}
                    />
                    <Label
                      htmlFor={`${facet.id}-${option.value}`}
                      className="flex-1 cursor-pointer"
                    >
                      {option.label}
                      {option.count !== undefined && (
                        <span className="ml-1 text-muted-foreground">
                          ({option.count})
                        </span>
                      )}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}

            {/* Range Facet */}
            {facet.type === "range" && facet.range && (
              <div className="space-y-4">
                <Slider
                  min={facet.range.min}
                  max={facet.range.max}
                  step={facet.range.step || 1}
                  value={(values[facet.id] as number[]) || [
                    facet.range.min,
                    facet.range.max,
                  ]}
                  onValueChange={(value) => handleRangeChange(facet.id, value)}
                  className="w-full"
                />
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>
                    {facet.range.prefix}
                    {(values[facet.id] as number[])?.[0] || facet.range.min}
                    {facet.range.suffix}
                  </span>
                  <span>
                    {facet.range.prefix}
                    {(values[facet.id] as number[])?.[1] || facet.range.max}
                    {facet.range.suffix}
                  </span>
                </div>
              </div>
            )}

            {/* Color Facet */}
            {facet.type === "color" && facet.options && (
              <div className="flex flex-wrap gap-2">
                {facet.options.map((option) => {
                  const isSelected = (values[facet.id] as string[])?.includes(
                    option.value
                  );
                  return (
                    <button
                      key={option.value}
                      onClick={() => handleColorChange(facet.id, option.value)}
                      className={cn(
                        "h-8 w-8 rounded-full border-2",
                        isSelected ? "border-primary" : "border-transparent"
                      )}
                      style={{ backgroundColor: option.value }}
                      aria-label={option.label}
                      title={option.label}
                    />
                  );
                })}
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>
      ))}
    </div>
  );

  // Mobile Sheet
  if (showMobileToggle) {
    return (
      <>
        {/* Mobile Toggle */}
        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="w-full">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                {t("common.filters")}
                {getActiveFiltersCount() > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {getActiveFiltersCount()}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>{t("common.filters")}</SheetTitle>
                <SheetDescription>
                  Adjust filters to refine your search results
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 pr-2 overflow-y-auto max-h-[calc(100vh-200px)]">
                <FilterContent />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Sidebar */}
        <div className={cn("hidden lg:block", className)}>
          <FilterContent />
        </div>
      </>
    );
  }

  return (
    <div className={className}>
      <FilterContent />
    </div>
  );
}
