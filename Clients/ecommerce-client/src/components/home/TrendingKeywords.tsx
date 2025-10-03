'use client';

import { Search, TrendingUp } from 'lucide-react';

const trendingKeywords = [
  'iPhone 15',
  'Samsung Galaxy S24',
  'iPad Pro',
  'MacBook Air M3',
  'Sony WH-1000XM5',
  'Nintendo Switch',
  'Xiaomi 14 Pro',
  'AirPods Pro 2',
  'Dell XPS 13',
  'PlayStation 5'
];

export function TrendingKeywords() {
  return (
    <section className="container mx-auto px-4">
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <TrendingUp className="h-5 w-5 text-orange-600" />
          <h3 className="text-lg font-semibold">Từ khóa thịnh hành</h3>
        </div>

        <div className="flex flex-wrap gap-2">
          {trendingKeywords.map((keyword, index) => (
            <button
              key={keyword}
              className="flex items-center space-x-2 px-3 py-1.5 bg-white rounded-full border hover:border-orange-300 hover:text-orange-600 transition-colors"
            >
              <Search className="h-3 w-3 text-gray-400" />
              <span className="text-sm">{keyword}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}