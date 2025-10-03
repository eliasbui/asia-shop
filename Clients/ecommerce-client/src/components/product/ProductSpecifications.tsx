'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  ChevronDown,
  ChevronUp,
  Download,
  FileText,
  Check,
  X,
  Info,
  Shield,
  Zap,
  Package,
  Smartphone,
  Monitor,
  Camera,
  Battery,
  Wifi,
  HardDrive,
  Cpu,
  Weight,
  Ruler
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Product } from '@/lib/types/domain';

interface SpecificationGroup {
  title: string;
  icon: React.ReactNode;
  specs: {
    label: string;
    value: string;
    important?: boolean;
    tooltip?: string;
  }[];
}

interface ProductSpecificationsProps {
  product: Product;
  className?: string;
}

interface ComparisonItem {
  competitor: string;
  specs: Record<string, string>;
}

export function ProductSpecifications({ product, className = '' }: ProductSpecificationsProps) {
  const t = useTranslations('product.specs');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['general']));
  const [activeTab, setActiveTab] = useState('overview');

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  // Create specification groups from product specs
  const createSpecificationGroups = (): SpecificationGroup[] => {
    const specs = product.specs || {};

    const groups: SpecificationGroup[] = [
      {
        title: 'General',
        icon: <Package className="w-4 h-4" />,
        specs: [
          { label: 'Brand', value: product.brand, important: true },
          { label: 'Model', value: product.title, important: true },
          { label: 'Category', value: product.category },
          { label: 'Release Date', value: 'Q4 2024' },
          { label: 'Warranty', value: '12 Months', important: true, tooltip: 'Official manufacturer warranty' }
        ]
      }
    ];

    // Dynamically add specification groups based on product specs
    if (specs.display) {
      groups.push({
        title: 'Display',
        icon: <Monitor className="w-4 h-4" />,
        specs: [
          { label: 'Screen Size', value: specs.display },
          { label: 'Resolution', value: specs.resolution || '1920 x 1080' },
          { label: 'Display Type', value: specs.displayType || 'IPS LCD' },
          { label: 'Refresh Rate', value: specs.refreshRate || '60Hz' },
          { label: 'Brightness', value: specs.brightness || '400 nits' }
        ]
      });
    }

    if (specs.processor || specs.ram || specs.storage) {
      groups.push({
        title: 'Performance',
        icon: <Cpu className="w-4 h-4" />,
        specs: [
          { label: 'Processor', value: specs.processor || 'Not specified' },
          { label: 'RAM', value: specs.ram || 'Not specified', important: true },
          { label: 'Storage', value: specs.storage || 'Not specified', important: true },
          { label: 'GPU', value: specs.gpu || 'Integrated' },
          { label: 'Operating System', value: specs.os || 'Not specified' }
        ]
      });
    }

    if (specs.camera) {
      groups.push({
        title: 'Camera',
        icon: <Camera className="w-4 h-4" />,
        specs: [
          { label: 'Main Camera', value: specs.camera },
          { label: 'Front Camera', value: specs.frontCamera || 'Not specified' },
          { label: 'Video Recording', value: specs.video || '4K@30fps' },
          { label: 'Flash', value: specs.flash || 'LED Flash' },
          { label: 'Features', value: specs.cameraFeatures || 'Auto-focus, HDR' }
        ]
      });
    }

    if (specs.battery) {
      groups.push({
        title: 'Battery',
        icon: <Battery className="w-4 h-4" />,
        specs: [
          { label: 'Capacity', value: specs.battery, important: true },
          { label: 'Charging', value: specs.charging || 'Fast Charging' },
          { label: 'Charging Port', value: specs.chargingPort || 'USB-C' },
          { label: 'Battery Life', value: specs.batteryLife || 'Up to 24 hours' },
          { label: 'Wireless Charging', value: specs.wirelessCharging || 'Yes' }
        ]
      });
    }

    if (specs.connectivity) {
      groups.push({
        title: 'Connectivity',
        icon: <Wifi className="w-4 h-4" />,
        specs: [
          { label: 'Network', value: specs.network || '5G, 4G LTE' },
          { label: 'Wi-Fi', value: specs.wifi || 'Wi-Fi 6' },
          { label: 'Bluetooth', value: specs.bluetooth || 'Bluetooth 5.2' },
          { label: 'GPS', value: specs.gps || 'Yes' },
          { label: 'NFC', value: specs.nfc || 'Yes' },
          { label: 'Ports', value: specs.ports || 'USB-C, 3.5mm jack' }
        ]
      });
    }

    if (specs.dimensions || specs.weight) {
      groups.push({
        title: 'Physical',
        icon: <Ruler className="w-4 h-4" />,
        specs: [
          { label: 'Dimensions', value: specs.dimensions || 'Not specified' },
          { label: 'Weight', value: specs.weight || 'Not specified' },
          { label: 'Materials', value: specs.materials || 'Aluminum, Glass' },
          { label: 'Colors', value: specs.colors || 'Multiple colors available' },
          { label: 'Water Resistance', value: specs.waterResistance || 'IP68' }
        ]
      });
    }

    // Add any additional specs that don't fit in standard categories
    const otherSpecs = Object.entries(specs).filter(([key]) =>
      !['display', 'resolution', 'displayType', 'refreshRate', 'brightness', 'processor', 'ram', 'storage', 'gpu', 'os', 'camera', 'frontCamera', 'video', 'flash', 'cameraFeatures', 'battery', 'charging', 'chargingPort', 'batteryLife', 'wirelessCharging', 'network', 'wifi', 'bluetooth', 'gps', 'nfc', 'ports', 'dimensions', 'weight', 'materials', 'colors', 'waterResistance'].includes(key)
    );

    if (otherSpecs.length > 0) {
      groups.push({
        title: 'Additional Features',
        icon: <Info className="w-4 h-4" />,
        specs: otherSpecs.map(([key, value]) => ({
          label: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
          value: value
        }))
      });
    }

    return groups;
  };

  const specGroups = createSpecificationGroups();

  // Mock comparison data
  const comparisonData: ComparisonItem[] = [
    {
      competitor: 'Competitor A',
      specs: {
        'Brand': 'Competitor Brand',
        'RAM': '6GB',
        'Storage': '128GB',
        'Battery': '4500mAh',
        'Camera': '48MP',
        'Price': '$799'
      }
    },
    {
      competitor: 'Competitor B',
      specs: {
        'Brand': 'Another Brand',
        'RAM': '8GB',
        'Storage': '256GB',
        'Battery': '5000mAh',
        'Camera': '64MP',
        'Price': '$899'
      }
    }
  ];

  const getComparisonSpecs = () => {
    const allSpecs = new Set<string>();
    specGroups.forEach(group => {
      group.specs.forEach(spec => allSpecs.add(spec.label));
    });
    comparisonData.forEach(item => {
      Object.keys(item.specs).forEach(spec => allSpecs.add(spec));
    });
    return Array.from(allSpecs);
  };

  const downloadSpecs = () => {
    // Create text content for download
    let content = `${product.title} - Specifications\n\n`;
    content += `Brand: ${product.brand}\n`;
    content += `Category: ${product.category}\n\n`;

    specGroups.forEach(group => {
      content += `${group.title}:\n`;
      group.specs.forEach(spec => {
        content += `  ${spec.label}: ${spec.value}\n`;
      });
      content += '\n';
    });

    // Create blob and download
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${product.slug}-specifications.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Product Specifications</CardTitle>
            <Button variant="outline" size="sm" onClick={downloadSpecs}>
              <Download className="w-4 h-4 mr-2" />
              Download Specs
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="detailed">Detailed</TabsTrigger>
              <TabsTrigger value="comparison">Comparison</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              {/* Key Specifications */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {specGroups.flatMap(group =>
                  group.specs
                    .filter(spec => spec.important)
                    .map((spec, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-center space-x-2 mb-1">
                          {group.icon}
                          <span className="text-sm font-medium text-muted-foreground">
                            {spec.label}
                          </span>
                        </div>
                        <div className="font-semibold">{spec.value}</div>
                      </div>
                    ))
                )}
              </div>

              {/* Quick Summary */}
              <div className="bg-muted rounded-lg p-4">
                <h4 className="font-medium mb-2">Key Features</h4>
                <div className="grid md:grid-cols-2 gap-2 text-sm">
                  {specGroups.slice(0, 3).map(group => (
                    <div key={group.title} className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span>{group.title}: {group.specs[0]?.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="detailed" className="space-y-4">
              {/* Expandable Specification Groups */}
              {specGroups.map((group) => (
                <Card key={group.title}>
                  <CardHeader
                    className="cursor-pointer"
                    onClick={() => toggleSection(group.title)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {group.icon}
                        <CardTitle className="text-lg">{group.title}</CardTitle>
                      </div>
                      {expandedSections.has(group.title) ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </CardHeader>
                  {expandedSections.has(group.title) && (
                    <CardContent>
                      <div className="space-y-3">
                        {group.specs.map((spec, index) => (
                          <div key={index} className="flex items-start justify-between">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-muted-foreground min-w-[100px]">
                                {spec.label}
                              </span>
                              {spec.tooltip && (
                                <div className="relative group">
                                  <Info className="w-3 h-3 text-muted-foreground" />
                                  <div className="absolute left-0 top-4 bg-gray-900 text-white text-xs rounded p-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 w-48">
                                    {spec.tooltip}
                                  </div>
                                </div>
                              )}
                              {spec.important && (
                                <Badge variant="secondary" className="text-xs">
                                  Key Feature
                                </Badge>
                              )}
                            </div>
                            <span className="font-medium text-sm">{spec.value}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="comparison" className="space-y-4">
              {/* Comparison Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left p-4 font-medium">Feature</th>
                      <th className="p-4">
                        <div className="text-center">
                          <div className="font-medium">{product.title}</div>
                          <div className="text-sm text-muted-foreground">{product.brand}</div>
                        </div>
                      </th>
                      {comparisonData.map((competitor) => (
                        <th key={competitor.competitor} className="p-4">
                          <div className="text-center">
                            <div className="font-medium">{competitor.competitor}</div>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {getComparisonSpecs().map((spec) => (
                      <tr key={spec} className="border-t">
                        <td className="p-4 font-medium text-sm">{spec}</td>
                        <td className="p-4">
                          <div className="text-center text-sm">
                            {specGroups
                              .flatMap(group => group.specs)
                              .find(item => item.label === spec)?.value || '-'}
                          </div>
                        </td>
                        {comparisonData.map((competitor) => (
                          <td key={competitor.competitor} className="p-4">
                            <div className="text-center text-sm">
                              {competitor.specs[spec] || '-'}
                            </div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Comparison Summary */}
              <div className="bg-muted rounded-lg p-4">
                <h4 className="font-medium mb-2">Why Choose This Product?</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span>Better value for money with premium features</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span>Superior build quality and materials</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span>Longer warranty period and better support</span>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Additional Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Warranty & Support</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Warranty Information</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>12-month manufacturer warranty</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>30-day money-back guarantee</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Free replacement for defective units</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Customer Support</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-blue-600" />
                  <span>24/7 online support</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-blue-600" />
                  <span>Free technical assistance</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-blue-600" />
                  <span>Extended warranty available</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}