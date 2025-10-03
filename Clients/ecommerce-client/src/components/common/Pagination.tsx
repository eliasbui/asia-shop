'use client';

import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pages = [];
  const showPages = 5; // Number of page buttons to show

  // Calculate which pages to show
  let startPage = Math.max(1, currentPage - Math.floor(showPages / 2));
  let endPage = Math.min(totalPages, startPage + showPages - 1);

  // Adjust if we're near the end
  if (endPage - startPage + 1 < showPages) {
    startPage = Math.max(1, endPage - showPages + 1);
  }

  // Always show first page
  if (startPage > 1) {
    pages.push(1);
    if (startPage > 2) {
      pages.push('...');
    }
  }

  // Show range of pages
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  // Always show last page
  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      pages.push('...');
    }
    pages.push(totalPages);
  }

  return (
    <div className="flex items-center justify-center space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Previous</span>
      </Button>

      {pages.map((page, index) => {
        if (page === '...') {
          return (
            <div key={`ellipsis-${index}`} className="flex items-center justify-center w-9 h-9">
              <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
            </div>
          );
        }

        const isActive = page === currentPage;
        return (
          <Button
            key={page}
            variant={isActive ? 'default' : 'outline'}
            size="sm"
            onClick={() => onPageChange(page as number)}
            className="w-9 h-9"
          >
            {page}
          </Button>
        );
      })}

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Next</span>
      </Button>
    </div>
  );
}