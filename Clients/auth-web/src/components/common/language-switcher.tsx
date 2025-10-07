"use client";

import { usePathname, useRouter, useParams } from "next/navigation";
import { Languages } from "lucide-react";
import { Button } from "@/components/common/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const languages = [
  { code: "vi", name: "Tiếng Việt", flag: "🇻🇳" },
  { code: "en", name: "English", flag: "🇺🇸" },
];

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const currentLocale = (params?.locale as string) || 'vi';
  
  console.log('LanguageSwitcher render:', { currentLocale, pathname, params });

  const handleLanguageChange = (newLocale: string) => {
    if (newLocale === currentLocale) return; // Already on this locale
    
    // Remove current locale from the beginning of pathname
    let pathnameWithoutLocale = pathname;
    if (pathname.startsWith(`/${currentLocale}/`)) {
      pathnameWithoutLocale = pathname.slice(`/${currentLocale}`.length);
    } else if (pathname === `/${currentLocale}`) {
      pathnameWithoutLocale = '/';
    }
    
    // Build new path with new locale prefix
    const newPathname = `/${newLocale}${pathnameWithoutLocale}`;
    
    console.log('Language switch:', { 
      from: currentLocale, 
      to: newLocale, 
      oldPath: pathname, 
      newPath: newPathname 
    });
    
    router.push(newPathname);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="h-9 w-9">
          <Languages className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Switch language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={currentLocale === language.code ? "bg-accent" : ""}
          >
            <span className="mr-2">{language.flag}</span>
            <span>{language.name}</span>
            {currentLocale === language.code && (
              <span className="ml-auto text-xs">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
