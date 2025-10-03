'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags?: string[];
  helpful?: number;
}

interface FAQSectionProps {
  faqs: FAQItem[];
  title?: string;
  categories?: string[];
  showSearch?: boolean;
  maxItems?: number;
}

export function FAQSection({
  faqs,
  title = "Câu hỏi thường gặp",
  categories,
  showSearch = false,
  maxItems
}: FAQSectionProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const toggleItem = (id: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = searchTerm === '' ||
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const displayFaqs = maxItems ? filteredFaqs.slice(0, maxItems) : filteredFaqs;
  const uniqueCategories = Array.from(new Set(faqs.map(faq => faq.category)));

  const handleHelpful = (id: string, helpful: boolean) => {
    // Here you would normally send this to your analytics/backend
    console.log(\`FAQ \${id} was \${helpful ? 'helpful' : 'not helpful'}\`);
  };

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

      {/* Search and Filters */}
      {(showSearch || categories) && (
        <Card className="p-4">
          <div className="space-y-4">
            {showSearch && (
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm câu hỏi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {categories && categories.length > 1 && (
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedCategory === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory('all')}
                >
                  Tất cả
                </Button>
                {uniqueCategories.map(category => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </Card>
      )}

      {/* FAQ Items */}
      <div className="space-y-4">
        {displayFaqs.map((faq) => (
          <Card key={faq.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <Button
                variant="ghost"
                className="w-full justify-between p-0 h-auto"
                onClick={() => toggleItem(faq.id)}
              >
                <div className="flex items-start space-x-3 text-left">
                  <span className="font-medium">{faq.question}</span>
                  {faq.tags && faq.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {faq.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">
                    {faq.category}
                  </Badge>
                  {expandedItems.has(faq.id) ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </div>
              </Button>
            </CardHeader>

            {expandedItems.has(faq.id) && (
              <CardContent className="pt-0">
                <div className="prose prose-sm max-w-none">
                  <p>{faq.answer}</p>
                </div>

                {/* Helpful buttons */}
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Câu trả lời này có hữu ích không?
                    </span>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleHelpful(faq.id, true)}
                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                      >
                        Có
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleHelpful(faq.id, false)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        Không
                      </Button>
                    </div>
                  </div>
                  {faq.helpful !== undefined && (
                    <div className="mt-2 text-xs text-muted-foreground">
                      {faq.helpful} người thấy hữu ích
                    </div>
                  )}
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {/* No Results */}
      {displayFaqs.length === 0 && (
        <Card className="p-8 text-center">
          <HelpCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-semibold mb-2">Không tìm thấy câu hỏi nào</h3>
          <p className="text-muted-foreground">
            Thử tìm kiếm với từ khóa khác hoặc liên hệ đội ngũ hỗ trợ của chúng tôi.
          </p>
        </Card>
      )}

      {/* Show More */}
      {maxItems && filteredFaqs.length > maxItems && (
        <div className="text-center">
          <Button variant="outline">
            Xem thêm câu hỏi ({filteredFaqs.length - maxItems} còn lại)
          </Button>
        </div>
      )}
    </div>
  );
}
