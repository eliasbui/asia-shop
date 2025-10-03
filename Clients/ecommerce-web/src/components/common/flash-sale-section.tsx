"use client";

import { Countdown } from "./countdown";
import { ProductGrid } from "../product/product-grid";
import type { Product } from "@/lib/types";
import { Zap } from "lucide-react";

interface FlashSaleSectionProps {
  products: Product[];
  endDate: string;
}

export function FlashSaleSection({ products, endDate }: FlashSaleSectionProps) {
  return (
    <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 rounded-lg p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-500 rounded-lg">
            <Zap className="w-6 h-6 text-white fill-white" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-red-600 dark:text-red-400">
              Flash Sale
            </h2>
            <p className="text-sm text-muted-foreground">
              Limited time offers - Hurry up!
            </p>
          </div>
        </div>
        <Countdown endDate={endDate} />
      </div>
      <ProductGrid products={products} />
    </div>
  );
}
