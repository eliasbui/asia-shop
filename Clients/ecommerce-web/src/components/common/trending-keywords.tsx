import { Link } from './link';
import { TrendingUp } from 'lucide-react';
import { Badge } from './badge';

interface TrendingKeywordsProps {
  keywords: string[];
}

export function TrendingKeywords({ keywords }: TrendingKeywordsProps) {
  if (keywords.length === 0) return null;

  return (
    <div className="bg-muted/50 rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Trending Searches</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {keywords.map((keyword) => (
          <Link key={keyword} href={`/s?q=${encodeURIComponent(keyword)}`}>
            <Badge
              variant="secondary"
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors px-4 py-2 text-sm"
            >
              {keyword}
            </Badge>
          </Link>
        ))}
      </div>
    </div>
  );
}

