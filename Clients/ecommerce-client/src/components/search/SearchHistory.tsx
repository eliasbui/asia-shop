'use client';

import React, { useState } from 'react';
import { Clock, X, Trash2, Search } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { useSearchHistory } from '@/lib/hooks/useSearch';

interface SearchHistoryProps {
  onSearchSelect?: (term: string) => void;
  maxItems?: number;
  showClearAll?: boolean;
  className?: string;
}

interface HistoryItemProps {
  term: string;
  index: number;
  onSelect: (term: string) => void;
  onRemove: (term: string) => void;
}

const HistoryItem: React.FC<HistoryItemProps> = ({ term, index, onSelect, onRemove }) => {
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRemoving(true);
    setTimeout(() => {
      onRemove(term);
    }, 150);
  };

  const handleSelect = () => {
    onSelect(term);
  };

  return (
    <button
      className={cn(
        'w-full p-3 text-left hover:bg-accent hover:text-accent-foreground transition-all duration-200 rounded-md group flex items-center gap-3',
        isRemoving && 'opacity-50 scale-95'
      )}
      onClick={handleSelect}
      disabled={isRemoving}
    >
      {/* Index */}
      <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
        {index + 1}
      </div>

      {/* Search Term */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          <span className="font-medium text-sm truncate group-hover:text-primary transition-colors">
            {term}
          </span>
        </div>
      </div>

      {/* Remove Button */}
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={handleRemove}
        aria-label={`Remove ${term} from history`}
      >
        <X className="h-3 w-3" />
      </Button>
    </button>
  );
};

export const SearchHistory: React.FC<SearchHistoryProps> = ({
  onSearchSelect,
  maxItems = 10,
  showClearAll = true,
  className
}) => {
  const { history, removeFromHistory, clearHistory } = useSearchHistory(maxItems);
  const [isClearDialogOpen, setIsClearDialogOpen] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const handleSearchSelect = (term: string) => {
    onSearchSelect?.(term);
  };

  const handleClearAll = async () => {
    setIsClearing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300)); // Simulate operation
      clearHistory();
      setIsClearDialogOpen(false);
    } finally {
      setIsClearing(false);
    }
  };

  const handleRemoveItem = (term: string) => {
    removeFromHistory(term);
  };

  if (history.length === 0) {
    return (
      <Card className={cn('w-full', className)}>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No search history</p>
            <p className="text-xs mt-1">Your recent searches will appear here</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Recent Searches
          </CardTitle>
          {showClearAll && history.length > 0 && (
            <Dialog open={isClearDialogOpen} onOpenChange={setIsClearDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Clear All
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Clear Search History?</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                  <p className="text-sm text-muted-foreground">
                    This will remove all {history.length} items from your search history. This action cannot be undone.
                  </p>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsClearDialogOpen(false)}
                    disabled={isClearing}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleClearAll}
                    disabled={isClearing}
                  >
                    {isClearing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                        Clearing...
                      </>
                    ) : (
                      'Clear All'
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-1">
        <div className="space-y-1 max-h-96 overflow-y-auto">
          {history.map((term, index) => (
            <HistoryItem
              key={term}
              term={term}
              index={index}
              onSelect={handleSearchSelect}
              onRemove={handleRemoveItem}
            />
          ))}
        </div>

        {history.length > 0 && (
          <div className="pt-2 mt-2 border-t">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{history.length} recent searches</span>
              <span>Local storage</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Compact version for inline display
export const SearchHistoryCompact: React.FC<{
  onSearchSelect?: (term: string) => void;
  maxItems?: number;
  className?: string;
}> = ({ onSearchSelect, maxItems = 5, className }) => {
  const { history, removeFromHistory } = useSearchHistory(maxItems);

  if (history.length === 0) {
    return null;
  }

  const handleSearchSelect = (term: string) => {
    onSearchSelect?.(term);
  };

  const handleRemoveItem = (e: React.MouseEvent, term: string) => {
    e.stopPropagation();
    removeFromHistory(term);
  };

  return (
    <div className={cn('space-y-1', className)}>
      <div className="flex items-center gap-2 px-2 py-1">
        <Clock className="h-4 w-4 text-muted-foreground" />
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Recent
        </span>
      </div>
      {history.slice(0, maxItems).map((term) => (
        <button
          key={term}
          className="w-full p-2 text-left hover:bg-accent hover:text-accent-foreground transition-colors rounded-md group flex items-center gap-2"
          onClick={() => handleSearchSelect(term)}
        >
          <Clock className="h-3 w-3 text-muted-foreground" />
          <span className="flex-1 text-sm truncate">{term}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => handleRemoveItem(e, term)}
          >
            <X className="h-3 w-3" />
          </Button>
        </button>
      ))}
    </div>
  );
};