'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  title?: string;
  items: FAQItem[];
  maxItems?: number;
}

export function FAQSection({ title = "Câu hỏi thường gặp", items, maxItems }: FAQSectionProps) {
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  const toggleItem = (index: number) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const displayItems = maxItems ? items.slice(0, maxItems) : items;

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center space-x-2">
          <HelpCircle className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold">{title}</h2>
        </div>
        <p className="text-muted-foreground">
          Tìm câu trả lời cho các câu hỏi thường gặp của chúng tôi
        </p>
      </div>

      <div className="space-y-4">
        {displayItems.map((item, index) => (
          <Card key={index} className="overflow-hidden">
            <CardHeader className="pb-3">
              <Button
                variant="ghost"
                className="w-full justify-between p-0 h-auto text-left"
                onClick={() => toggleItem(index)}
              >
                <span className="font-medium">{item.question}</span>
                {expandedItems.has(index) ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </Button>
            </CardHeader>

            {expandedItems.has(index) && (
              <CardContent className="pt-0">
                <div className="prose prose-sm max-w-none">
                  <p>{item.answer}</p>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {maxItems && items.length > maxItems && (
        <div className="text-center">
          <Button variant="outline">
            Xem thêm câu hỏi ({items.length - maxItems} còn lại)
          </Button>
        </div>
      )}
    </div>
  );
}