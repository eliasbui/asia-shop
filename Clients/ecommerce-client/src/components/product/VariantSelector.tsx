'use client';

import { Check } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Product } from '@/lib/types/domain';
import { formatCurrency } from '@/lib/utils/format';

interface VariantSelectorProps {
  variants: Product['variants'];
  selectedVariant: Product['variants'][0] | null;
  onChange: (variant: Product['variants'][0]) => void;
}

export function VariantSelector({ variants, selectedVariant, onChange }: VariantSelectorProps) {
  if (!variants || variants.length <= 1) return null;

  // Group variants by attributes
  const attributeKeys = variants[0] ? Object.keys(variants[0].attributes) : [];
  const attributeGroups = attributeKeys.reduce((groups, key) => {
    const values = [...new Set(variants.map(v => v.attributes[key]))];
    groups[key] = values;
    return groups;
  }, {} as Record<string, string[]>);

  const getAvailableVariants = (selectedAttributes: Record<string, string>) => {
    return variants.filter(variant => {
      return Object.entries(selectedAttributes).every(([key, value]) =>
        variant.attributes[key] === value
      );
    });
  };

  const handleAttributeChange = (attribute: string, value: string) => {
    const currentAttributes = selectedVariant ? { ...selectedVariant.attributes } : {};
    const newAttributes = { ...currentAttributes, [attribute]: value };

    const availableVariants = getAvailableVariants(newAttributes);
    if (availableVariants.length > 0) {
      onChange(availableVariants[0]);
    }
  };

  const getAttributeClass = (attribute: string, value: string) => {
    const testAttributes = selectedVariant ? { ...selectedVariant.attributes, [attribute]: value } : { [attribute]: value };
    const isAvailable = getAvailableVariants(testAttributes).length > 0;
    const isSelected = selectedVariant?.attributes[attribute] === value;

    return `
      px-4 py-2 rounded-lg border text-sm font-medium transition-all
      ${isSelected
        ? 'border-blue-500 bg-blue-50 text-blue-600'
        : isAvailable
          ? 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
          : 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed'
      }
    `;
  };

  return (
    <div className="space-y-6">
      {Object.entries(attributeGroups).map(([attribute, values]) => (
        <div key={attribute}>
          <h3 className="font-medium mb-3 capitalize">
            {attribute === 'color' ? 'Màu sắc' : attribute === 'storage' ? 'Dung lượng' : attribute}
          </h3>
          <div className="flex flex-wrap gap-2">
            {values.map((value) => (
              <button
                key={value}
                className={getAttributeClass(attribute, value)}
                onClick={() => handleAttributeChange(attribute, value)}
                disabled={getAvailableVariants({ [attribute]: value }).length === 0}
              >
                {attribute === 'color' ? (
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-4 h-4 rounded-full border border-gray-300"
                      style={{
                        backgroundColor: value.toLowerCase().includes('blue') ? '#3B82F6' :
                                        value.toLowerCase().includes('black') ? '#000000' :
                                        value.toLowerCase().includes('white') ? '#FFFFFF' :
                                        value.toLowerCase().includes('natural') ? '#F5F5DC' :
                                        '#6B7280'
                      }}
                    />
                    <span>{value}</span>
                    {selectedVariant?.attributes[attribute] === value && (
                      <Check className="h-4 w-4 text-blue-600" />
                    )}
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span>{value}</span>
                    {selectedVariant?.attributes[attribute] === value && (
                      <Check className="h-4 w-4 text-blue-600" />
                    )}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* Selected Variant Info */}
      {selectedVariant && (
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600">
                Đã chọn: {Object.entries(selectedVariant.attributes)
                  .map(([key, value]) => `${key}: ${value}`)
                  .join(', ')}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                SKU: {selectedVariant.sku}
              </p>
            </div>
            <div className="text-right">
              {selectedVariant.price && (
                <div>
                  <span className="font-semibold text-blue-600">
                    {formatCurrency(
                      selectedVariant.price.sale?.amount || selectedVariant.price.list.amount,
                      selectedVariant.price.list.currency
                    )}
                  </span>
                  {selectedVariant.price.sale && (
                    <span className="ml-2 text-sm text-muted-foreground line-through">
                      {formatCurrency(
                        selectedVariant.price.list.amount,
                        selectedVariant.price.list.currency
                      )}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}