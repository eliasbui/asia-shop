"use client";

import { Star, StarHalf } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingProps {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  readonly?: boolean;
  onChange?: (value: number) => void;
  className?: string;
}

export function Rating({
  value,
  max = 5,
  size = "md",
  showValue = false,
  readonly = true,
  onChange,
  className,
}: RatingProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  const handleClick = (rating: number) => {
    if (!readonly && onChange) {
      onChange(rating);
    }
  };

  const renderStar = (index: number) => {
    const filled = value >= index + 1;
    const halfFilled = value > index && value < index + 1;

    return (
      <button
        key={index}
        type="button"
        onClick={() => handleClick(index + 1)}
        disabled={readonly}
        className={cn(
          "relative",
          readonly ? "cursor-default" : "cursor-pointer hover:scale-110",
          "transition-transform"
        )}
      >
        {halfFilled ? (
          <div className="relative">
            <Star
              className={cn(sizeClasses[size], "text-gray-300 fill-gray-300")}
            />
            <div className="absolute inset-0 overflow-hidden" style={{ width: "50%" }}>
              <Star
                className={cn(
                  sizeClasses[size],
                  "text-yellow-400 fill-yellow-400"
                )}
              />
            </div>
          </div>
        ) : (
          <Star
            className={cn(
              sizeClasses[size],
              filled
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300 fill-gray-300"
            )}
          />
        )}
      </button>
    );
  };

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex">
        {Array.from({ length: max }, (_, i) => renderStar(i))}
      </div>
      {showValue && (
        <span className="ml-2 text-sm text-muted-foreground">
          {value.toFixed(1)}
        </span>
      )}
    </div>
  );
}
