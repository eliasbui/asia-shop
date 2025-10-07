"use client";

import { Price } from "@/types/models";
import { cn, formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";

interface PriceBlockProps {
  price: Price;
  locale?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  showBadge?: boolean;
}

export function PriceBlock({
  price,
  locale = "vi",
  size = "md",
  className,
  showBadge = true,
}: PriceBlockProps) {
  const t = useTranslations();
  const currency = locale === "vi" ? "VND" : "USD";

  const sizeClasses = {
    sm: {
      sale: "text-base font-semibold",
      list: "text-sm line-through",
      single: "text-base font-semibold",
    },
    md: {
      sale: "text-lg font-bold",
      list: "text-base line-through",
      single: "text-lg font-bold",
    },
    lg: {
      sale: "text-2xl font-bold",
      list: "text-lg line-through",
      single: "text-2xl font-bold",
    },
  };

  const hasSale = !!price.sale;
  const isFlashSale = !!price.flashSale;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {hasSale ? (
        <>
          <span className={cn("text-red-600", sizeClasses[size].sale)}>
            {formatCurrency(price.sale!.amount, currency, locale)}
          </span>
          <span
            className={cn("text-muted-foreground", sizeClasses[size].list)}
          >
            {formatCurrency(price.list.amount, currency, locale)}
          </span>
          {showBadge && price.percentOff && (
            <Badge variant="destructive" className="ml-1">
              -{price.percentOff}%
            </Badge>
          )}
          {showBadge && isFlashSale && (
            <Badge variant="destructive" className="ml-1 animate-pulse">
              {t("common.flashSale")}
            </Badge>
          )}
        </>
      ) : (
        <span className={cn("", sizeClasses[size].single)}>
          {formatCurrency(price.list.amount, currency, locale)}
        </span>
      )}
    </div>
  );
}
