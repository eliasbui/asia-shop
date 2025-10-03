'use client';

import { useState, useEffect, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';

interface SearchResult {
  title: string;
  description: string;
  href: string;
  category: string;
}

interface HelpSearchProps {
  className?: string;
  onSearch?: (query: string) => void;
  placeholder?: string;
}

// Mock search data - in real app, this would come from an API
const mockSearchData: SearchResult[] = [
  {
    title: 'Làm thế nào để theo dõi đơn hàng?',
    description: 'Hướng dẫn chi tiết cách theo dõi tình trạng đơn hàng của bạn.',
    href: '/help/shipping',
    category: 'Vận chuyển',
  },
  {
    title: 'Chính sách đổi trả',
    description: 'Thông tin về điều kiện và quy trình đổi trả sản phẩm.',
    href: '/help/returns',
    category: 'Đổi trả',
  },
  {
    title: 'Phương thức thanh toán được chấp nhận',
    description: 'Danh sách các phương thức thanh toán có sẵn trên AsiaShop.',
    href: '/help/payment',
    category: 'Thanh toán',
  },
  {
    title: 'Bảo hành sản phẩm',
    description: 'Chính sách bảo hành cho các sản phẩm điện tử và gia dụng.',
    href: '/help/warranty',
    category: 'Bảo hành',
  },
  {
    title: 'Thời gian giao hàng dự kiến',
    description: 'Thông tin về thời gian giao hàng cho các khu vực khác nhau.',
    href: '/help/shipping',
    category: 'Vận chuyển',
  },
  {
    title: 'Làm thế nào để hủy đơn hàng?',
    description: 'Hướng dẫn hủy đơn hàng trước khi được giao.',
    href: '/help/shipping',
    category: 'Vận chuyển',
  },
  {
    title: 'Chính sách hoàn tiền',
    description: 'Quy trình và thời gian hoàn tiền khi đổi trả sản phẩm.',
    href: '/help/returns',
    category: 'Đổi trả',
  },
  {
    title: 'An toàn thanh toán',
    description: 'Các biện pháp bảo mật khi thanh toán trên AsiaShop.',
    href: '/help/payment',
    category: 'Thanh toán',
  },
];

export function HelpSearch({ className, onSearch, placeholder = 'Tìm kiếm câu hỏi thường gặp...' }: HelpSearchProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const filteredResults = useMemo(() => {
    if (!query.trim()) return [];

    const searchTerm = query.toLowerCase();
    return mockSearchData.filter(
      item =>
        item.title.toLowerCase().includes(searchTerm) ||
        item.description.toLowerCase().includes(searchTerm) ||
        item.category.toLowerCase().includes(searchTerm)
    ).slice(0, 6);
  }, [query]);

  useEffect(() => {
    if (query.trim() && filteredResults.length === 0) {
      setIsOpen(false);
    } else if (query.trim() && isFocused) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [query, filteredResults.length, isFocused]);

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      onSearch?.(searchQuery);
      setIsOpen(false);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    setQuery('');
    setIsOpen(false);
  };

  const clearSearch = () => {
    setQuery('');
    setIsOpen(false);
  };

  const highlightText = (text: string, highlight: string) => {
    if (!highlight.trim()) return text;

    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return (
      <>
        {parts.map((part, index) =>
          part.toLowerCase() === highlight.toLowerCase() ? (
            <mark key={index} className="bg-yellow-200 text-yellow-800 px-1 rounded">
              {part}
            </mark>
          ) : (
            <span key={index}>{part}</span>
          )
        )}
      </>
    );
  };

  return (
    <div className={cn('relative', className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            // Delay closing to allow clicking on results
            setTimeout(() => setIsFocused(false), 200);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch(query);
            } else if (e.key === 'Escape') {
              clearSearch();
            }
          }}
          placeholder={placeholder}
          className="pl-10 pr-10"
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-background border rounded-lg shadow-lg max-h-80 overflow-y-auto">
          {filteredResults.length > 0 ? (
            <div className="p-2">
              <div className="text-xs font-medium text-muted-foreground px-3 py-2">
                Kết quả tìm kiếm ({filteredResults.length})
              </div>
              {filteredResults.map((result, index) => (
                <a
                  key={index}
                  href={result.href}
                  onClick={() => handleResultClick(result)}
                  className="block px-3 py-2 rounded-md hover:bg-accent transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium">
                        {highlightText(result.title, query)}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {highlightText(result.description, query)}
                      </div>
                      <div className="text-xs text-primary mt-1">
                        {result.category}
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          ) : query.trim() ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Không tìm thấy kết quả cho "{query}"
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}