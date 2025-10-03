import { Link } from './link';
import { ChevronRight } from 'lucide-react';

interface SectionHeaderProps {
  title: string;
  description?: string;
  viewAllHref?: string;
  viewAllText?: string;
}

export function SectionHeader({
  title,
  description,
  viewAllHref,
  viewAllText = 'View all',
}: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
        {description && (
          <p className="text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      {viewAllHref && (
        <Link
          href={viewAllHref}
          className="flex items-center gap-1 text-primary hover:underline font-medium"
        >
          {viewAllText}
          <ChevronRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
}

