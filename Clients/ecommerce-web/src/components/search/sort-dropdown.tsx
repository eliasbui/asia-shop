"use client";

interface SortDropdownProps {
  value?: string;
  onChange: (value: string) => void;
}

const sortOptions = [
  { value: "relevance", label: "Most Relevant" },
  { value: "price:asc", label: "Price: Low to High" },
  { value: "price:desc", label: "Price: High to Low" },
  { value: "rating:desc", label: "Highest Rated" },
  { value: "newest", label: "Newest First" },
  { value: "bestseller", label: "Best Sellers" },
];

export function SortDropdown({
  value = "relevance",
  onChange,
}: SortDropdownProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground whitespace-nowrap">
        Sort by:
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
