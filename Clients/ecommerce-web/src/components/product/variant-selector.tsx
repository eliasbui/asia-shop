"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import type { Variant } from "@/types/models";

interface VariantSelectorProps {
  variants: Variant[];
  selectedVariant?: Variant;
  onVariantChange: (variant: Variant) => void;
  className?: string;
}

export function VariantSelector({
  variants,
  selectedVariant,
  onVariantChange,
  className,
}: VariantSelectorProps) {
  const t = useTranslations();

  // Group variants by attributes
  const attributeGroups = variants.reduce((groups, variant) => {
    Object.entries(variant.attributes).forEach(([key, value]) => {
      if (!groups[key]) {
        groups[key] = new Set();
      }
      groups[key].add(value);
    });
    return groups;
  }, {} as Record<string, Set<string>>);

  // Convert Sets to arrays for easier iteration
  const attributes = Object.entries(attributeGroups).map(([key, values]) => ({
    key,
    values: Array.from(values),
  }));

  // Track selected attributes
  const [selectedAttributes, setSelectedAttributes] = useState<
    Record<string, string>
  >(selectedVariant?.attributes || {});

  // Find variant based on selected attributes
  const findVariant = (attrs: Record<string, string>) => {
    return variants.find((variant) =>
      Object.entries(attrs).every(
        ([key, value]) => variant.attributes[key] === value
      )
    );
  };

  // Handle attribute selection
  const handleAttributeSelect = (attributeKey: string, value: string) => {
    const newAttributes = {
      ...selectedAttributes,
      [attributeKey]: value,
    };

    setSelectedAttributes(newAttributes);

    // Check if all attributes are selected
    const allAttributesSelected = attributes.every(
      (attr) => newAttributes[attr.key]
    );

    if (allAttributesSelected) {
      const variant = findVariant(newAttributes);
      if (variant) {
        onVariantChange(variant);
      }
    }
  };

  // Check if an attribute value is available based on other selections
  const isAttributeAvailable = (attributeKey: string, value: string) => {
    const testAttributes = {
      ...selectedAttributes,
      [attributeKey]: value,
    };

    // If not all attributes are selected yet, consider it available
    const hasAllOtherAttributes = attributes
      .filter((attr) => attr.key !== attributeKey)
      .every((attr) => testAttributes[attr.key]);

    if (!hasAllOtherAttributes) return true;

    // Check if there's a variant with these attributes
    return variants.some((variant) =>
      Object.entries(testAttributes).every(
        ([key, val]) => variant.attributes[key] === val
      )
    );
  };

  // Check stock status for a specific attribute value
  const getStockStatus = (attributeKey: string, value: string) => {
    const testAttributes = {
      ...selectedAttributes,
      [attributeKey]: value,
    };

    const matchingVariants = variants.filter((variant) =>
      Object.entries(testAttributes).every(
        ([key, val]) => variant.attributes[key] === val
      )
    );

    if (matchingVariants.length === 0) return null;

    const allOutOfStock = matchingVariants.every(
      (v) => v.stock.status === "out-of-stock"
    );
    const someLowStock = matchingVariants.some(
      (v) => v.stock.status === "low-stock"
    );

    if (allOutOfStock) return "out-of-stock";
    if (someLowStock) return "low-stock";
    return "in-stock";
  };

  // Render attribute selector based on type
  const renderAttributeSelector = (
    attributeKey: string,
    values: string[]
  ) => {
    const isColor = attributeKey.toLowerCase() === "color";
    const isSize =
      attributeKey.toLowerCase() === "size" ||
      attributeKey.toLowerCase() === "storage";

    if (isColor) {
      // Color selector with color swatches
      return (
        <div className="flex flex-wrap gap-2">
          {values.map((value) => {
            const isSelected = selectedAttributes[attributeKey] === value;
            const isAvailable = isAttributeAvailable(attributeKey, value);
            const stockStatus = getStockStatus(attributeKey, value);
            const colorMap: Record<string, string> = {
              "Natural Titanium": "#A8A9AD",
              "Blue Titanium": "#3B82C4",
              "White Titanium": "#F3F4F6",
              "Black Titanium": "#1F2937",
              "Titanium Gray": "#6B7280",
              "Titanium Black": "#111827",
              "Titanium Violet": "#8B5CF6",
              "Space Gray": "#4B5563",
              "Silver": "#E5E7EB",
              "Midnight": "#1E293B",
              "Starlight": "#FEF3C7",
            };

            return (
              <button
                key={value}
                onClick={() =>
                  isAvailable && handleAttributeSelect(attributeKey, value)
                }
                disabled={!isAvailable || stockStatus === "out-of-stock"}
                className={cn(
                  "relative h-10 w-10 rounded-full border-2 transition-all",
                  isSelected
                    ? "border-primary ring-2 ring-primary ring-offset-2"
                    : "border-gray-300",
                  !isAvailable || stockStatus === "out-of-stock"
                    ? "cursor-not-allowed opacity-50"
                    : "hover:border-primary"
                )}
                title={value}
              >
                <span
                  className="absolute inset-1 rounded-full"
                  style={{
                    backgroundColor: colorMap[value] || "#E5E7EB",
                  }}
                />
                {stockStatus === "out-of-stock" && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="h-[1px] w-8 rotate-45 bg-gray-500" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      );
    }

    if (isSize) {
      // Size/Storage selector with buttons
      return (
        <div className="flex flex-wrap gap-2">
          {values.map((value) => {
            const isSelected = selectedAttributes[attributeKey] === value;
            const isAvailable = isAttributeAvailable(attributeKey, value);
            const stockStatus = getStockStatus(attributeKey, value);

            return (
              <Button
                key={value}
                variant={isSelected ? "default" : "outline"}
                size="sm"
                onClick={() =>
                  isAvailable && handleAttributeSelect(attributeKey, value)
                }
                disabled={!isAvailable || stockStatus === "out-of-stock"}
                className={cn(
                  "min-w-[60px]",
                  stockStatus === "low-stock" && "relative"
                )}
              >
                {value}
                {stockStatus === "low-stock" && (
                  <Badge
                    variant="warning"
                    className="absolute -right-1 -top-1 h-2 w-2 rounded-full p-0"
                  />
                )}
              </Button>
            );
          })}
        </div>
      );
    }

    // Default radio group selector
    return (
      <RadioGroup
        value={selectedAttributes[attributeKey]}
        onValueChange={(value) => handleAttributeSelect(attributeKey, value)}
      >
        {values.map((value) => {
          const isAvailable = isAttributeAvailable(attributeKey, value);
          const stockStatus = getStockStatus(attributeKey, value);

          return (
            <div key={value} className="flex items-center space-x-2">
              <RadioGroupItem
                value={value}
                id={`${attributeKey}-${value}`}
                disabled={!isAvailable || stockStatus === "out-of-stock"}
              />
              <Label
                htmlFor={`${attributeKey}-${value}`}
                className={cn(
                  "cursor-pointer",
                  (!isAvailable || stockStatus === "out-of-stock") &&
                    "cursor-not-allowed opacity-50"
                )}
              >
                {value}
                {stockStatus === "low-stock" && (
                  <Badge variant="warning" className="ml-2">
                    {t("common.lowStock")}
                  </Badge>
                )}
                {stockStatus === "out-of-stock" && (
                  <Badge variant="destructive" className="ml-2">
                    {t("common.outOfStock")}
                  </Badge>
                )}
              </Label>
            </div>
          );
        })}
      </RadioGroup>
    );
  };

  return (
    <div className={cn("space-y-6", className)}>
      {attributes.map(({ key, values }) => (
        <div key={key}>
          <Label className="text-sm font-medium capitalize mb-3 block">
            {t(`product.${key.toLowerCase()}`) || key}
            {!selectedAttributes[key] && (
              <span className="text-destructive ml-1">*</span>
            )}
          </Label>
          {renderAttributeSelector(key, values)}
        </div>
      ))}

      {selectedVariant && (
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">SKU:</span>
            <span className="font-mono">{selectedVariant.sku}</span>
          </div>
          {selectedVariant.stock.qty !== undefined && (
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">
                {t("common.available")}:
              </span>
              <span>
                {selectedVariant.stock.qty} {t("common.items")}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
