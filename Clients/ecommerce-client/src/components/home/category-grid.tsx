import Link from "next/link";
import Image from "next/image";
import * as Icons from "lucide-react";
import { categories } from "@/lib/mock-data";

export default function CategoryGrid() {
  const getIcon = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName];
    return IconComponent ? <IconComponent className="h-8 w-8" /> : null;
  };

  return (
    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/products?category=${category.slug}`}
          className="group flex flex-col items-center p-4 rounded-lg border bg-card hover:shadow-md transition-all duration-200"
        >
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-3 group-hover:bg-primary/10 transition-colors">
            <div className="text-primary">
              {getIcon(category.icon)}
            </div>
          </div>
          <h3 className="text-sm font-medium text-center group-hover:text-primary transition-colors">
            {category.name}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            {category.productCount} sản phẩm
          </p>
        </Link>
      ))}
    </div>
  );
}