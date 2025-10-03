// Main search components
export { AutosuggestInput } from './AutosuggestInput';
export { SearchResults } from './SearchResults';
export { TrendingSearches } from './TrendingSearches';
export { SearchHistory, SearchHistoryCompact } from './SearchHistory';

// Types
export type { AutosuggestInputProps, AutosuggestInputRef } from './AutosuggestInput';

// Re-export hooks for convenience
export { useSearch, useSearchHistory } from '@/lib/hooks/useSearch';

// Re-export API for convenience
export { searchApi } from '@/lib/api/search';
export type { SearchCache } from '@/lib/api/search';