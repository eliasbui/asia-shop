'use client';

import React, { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import {
  Globe,
  ChevronDown,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  rtl?: boolean;
}

interface LanguageSwitcherProps {
  className?: string;
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'default' | 'sm' | 'icon';
  showFlag?: boolean;
  showNativeName?: boolean;
}

export function LanguageSwitcher({
  className = '',
  variant = 'ghost',
  size = 'default',
  showFlag = true,
  showNativeName = false
}: LanguageSwitcherProps) {
  const t = useTranslations('common');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Available languages
  const languages: Language[] = [
    {
      code: 'en',
      name: 'English',
      nativeName: 'English',
      flag: '🇺🇸'
    },
    {
      code: 'vi',
      name: 'Vietnamese',
      nativeName: 'Tiếng Việt',
      flag: '🇻🇳'
    },
    {
      code: 'zh',
      name: 'Chinese',
      nativeName: '中文',
      flag: '🇨🇳'
    },
    {
      code: 'ja',
      name: 'Japanese',
      nativeName: '日本語',
      flag: '🇯🇵'
    },
    {
      code: 'ko',
      name: 'Korean',
      nativeName: '한국어',
      flag: '🇰🇷'
    },
    {
      code: 'th',
      name: 'Thai',
      nativeName: 'ไทย',
      flag: '🇹🇭'
    },
    {
      code: 'ms',
      name: 'Malay',
      nativeName: 'Bahasa Melayu',
      flag: '🇲🇾'
    },
    {
      code: 'id',
      name: 'Indonesian',
      nativeName: 'Bahasa Indonesia',
      flag: '🇮🇩'
    },
    {
      code: 'fil',
      name: 'Filipino',
      nativeName: 'Filipino',
      flag: '🇵🇭'
    },
    {
      code: 'ar',
      name: 'Arabic',
      nativeName: 'العربية',
      flag: '🇸🇦',
      rtl: true
    }
  ];

  const currentLanguage = languages.find(lang => lang.code === locale) || languages[0];

  const handleLanguageChange = (languageCode: string) => {
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferred-language', languageCode);
    }

    // Navigate to the same path with new locale
    const newPath = pathname.replace(/^\/[^\/]+/, `/${languageCode}`);
    router.push(newPath);
    setIsOpen(false);
  };

  const getDisplayName = (language: Language) => {
    if (showNativeName) {
      return language.nativeName;
    }
    return language.name;
  };

  const isIconSize = size === 'icon';

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size={isIconSize ? 'icon' : size}
          className={className}
          aria-label={`Current language: ${currentLanguage.name}. Click to change language.`}
        >
          {isIconSize ? (
            <Globe className="h-4 w-4" />
          ) : (
            <div className="flex items-center space-x-2">
              {showFlag && <span className="text-lg">{currentLanguage.flag}</span>}
              <span className="text-sm font-medium">{getDisplayName(currentLanguage)}</span>
              <ChevronDown className="h-3 w-3" />
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <div className="px-2 py-1.5">
          <p className="text-xs font-medium text-muted-foreground">Select Language</p>
        </div>
        <DropdownMenuSeparator />

        {languages.map((language) => {
          const isSelected = language.code === locale;
          const isRTL = language.rtl;

          return (
            <DropdownMenuItem
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className={`flex items-center justify-between cursor-pointer ${
                isSelected ? 'bg-accent' : ''
              }`}
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              <div className="flex items-center space-x-2">
                {showFlag && <span className="text-base">{language.flag}</span>}
                <div className="flex flex-col">
                  <span className={`text-sm font-medium ${isSelected ? 'text-primary' : ''}`}>
                    {language.name}
                  </span>
                  {showNativeName && (
                    <span className="text-xs text-muted-foreground">
                      {language.nativeName}
                    </span>
                  )}
                </div>
              </div>
              {isSelected && (
                <Check className="h-4 w-4 text-primary" />
              )}
            </DropdownMenuItem>
          );
        })}

        <DropdownMenuSeparator />
        <div className="px-2 py-1.5">
          <p className="text-xs text-muted-foreground text-center">
            More languages coming soon
          </p>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Compact version for mobile
export function LanguageSwitcherCompact({ className }: { className?: string }) {
  return (
    <LanguageSwitcher
      className={className}
      size="icon"
      variant="ghost"
      showFlag={false}
      showNativeName={false}
    />
  );
}

// Text-only version
export function LanguageSwitcherText({ className }: { className?: string }) {
  return (
    <LanguageSwitcher
      className={className}
      variant="ghost"
      size="sm"
      showFlag={false}
      showNativeName={true}
    />
  );
}

// Dropdown with all languages expanded
export function LanguageSwitcherExpanded({ className }: { className?: string }) {
  const t = useTranslations('common');
  const locale = useLocale();

  const languages: Language[] = [
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
    { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
    { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
    { code: 'th', name: 'Thai', nativeName: 'ไทย', flag: '🇹🇭' },
    { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu', flag: '🇲🇾' },
    { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩' },
    { code: 'fil', name: 'Filipino', nativeName: 'Filipino', flag: '🇵🇭' },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', rtl: true }
  ];

  const currentLanguage = languages.find(lang => lang.code === locale) || languages[0];
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (languageCode: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferred-language', languageCode);
    }
    const newPath = pathname.replace(/^\/[^\/]+/, `/${languageCode}`);
    router.push(newPath);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="text-center">
        <p className="text-sm font-medium text-muted-foreground mb-4">Choose your language</p>
        <div className="text-2xl mb-2">{currentLanguage.flag}</div>
        <p className="text-lg font-semibold">{currentLanguage.name}</p>
        <p className="text-sm text-muted-foreground">{currentLanguage.nativeName}</p>
      </div>

      <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
        {languages.map((language) => {
          const isSelected = language.code === locale;
          const isRTL = language.rtl;

          return (
            <button
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className={`flex items-center space-x-2 p-3 border rounded-lg text-left hover:bg-accent transition-colors ${
                isSelected ? 'border-primary bg-accent' : 'border-border'
              }`}
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              <span className="text-xl">{language.flag}</span>
              <div className="flex-1 min-w-0">
                <div className={`text-sm font-medium truncate ${isSelected ? 'text-primary' : ''}`}>
                  {language.name}
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {language.nativeName}
                </div>
              </div>
              {isSelected && (
                <Check className="h-4 w-4 text-primary flex-shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      <div className="text-center">
        <p className="text-xs text-muted-foreground">
          Your language preference will be saved for future visits
        </p>
      </div>
    </div>
  );
}

// Hook to get current language info
export function useLanguage() {
  const locale = useLocale();

  const languages: Language[] = [
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
    { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
    { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' }
  ];

  const currentLanguage = languages.find(lang => lang.code === locale) || languages[0];

  return {
    currentLanguage,
    locale,
    isRTL: currentLanguage.rtl || false,
    languages
  };
}