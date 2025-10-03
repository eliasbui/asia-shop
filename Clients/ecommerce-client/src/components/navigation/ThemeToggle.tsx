'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import {
  Sun,
  Moon,
  Monitor,
  Palette,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu';

type Theme = 'light' | 'dark' | 'system';

interface ThemeToggleProps {
  className?: string;
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'default' | 'sm' | 'icon';
  showLabel?: boolean;
}

export function ThemeToggle({
  className = '',
  variant = 'ghost',
  size = 'default',
  showLabel = false
}: ThemeToggleProps) {
  const t = useTranslations('common');
  const [theme, setTheme] = useState<Theme>('system');
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const root = window.document.documentElement;

    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }

    localStorage.setItem('theme', theme);
  }, [theme, mounted]);

  // Listen for system theme changes
  useEffect(() => {
    if (!mounted || theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      const root = window.document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(mediaQuery.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, mounted]);

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    setIsOpen(false);
  };

  const getThemeIcon = (themeValue: Theme) => {
    switch (themeValue) {
      case 'light':
        return <Sun className="h-4 w-4" />;
      case 'dark':
        return <Moon className="h-4 w-4" />;
      case 'system':
        return <Monitor className="h-4 w-4" />;
      default:
        return <Palette className="h-4 w-4" />;
    }
  };

  const getCurrentThemeIcon = () => {
    if (!mounted) return <Palette className="h-4 w-4" />;

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return systemTheme ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />;
    }

    return getThemeIcon(theme);
  };

  const getThemeLabel = () => {
    switch (theme) {
      case 'light':
        return 'Light';
      case 'dark':
        return 'Dark';
      case 'system':
        return 'System';
      default:
        return 'Theme';
    }
  };

  const isIconSize = size === 'icon';

  if (!mounted) {
    return (
      <Button
        variant={variant}
        size={isIconSize ? 'icon' : size}
        className={className}
        disabled
      >
        <Palette className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size={isIconSize ? 'icon' : size}
          className={className}
          aria-label={`Current theme: ${getThemeLabel()}. Click to change theme.`}
        >
          {isIconSize ? (
            <Palette className="h-4 w-4" />
          ) : (
            <div className="flex items-center space-x-2">
              {getCurrentThemeIcon()}
              {showLabel && <span className="text-sm font-medium">{getThemeLabel()}</span>}
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <div className="px-2 py-1.5">
          <p className="text-xs font-medium text-muted-foreground">Theme</p>
        </div>
        <DropdownMenuSeparator />

        <DropdownMenuRadioGroup value={theme} onValueChange={(value) => handleThemeChange(value as Theme)}>
          <DropdownMenuRadioItem value="light" className="flex items-center space-x-2 cursor-pointer">
            <Sun className="h-4 w-4" />
            <span>Light</span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark" className="flex items-center space-x-2 cursor-pointer">
            <Moon className="h-4 w-4" />
            <span>Dark</span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="system" className="flex items-center space-x-2 cursor-pointer">
            <Monitor className="h-4 w-4" />
            <span>System</span>
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>

        <DropdownMenuSeparator />
        <div className="px-2 py-1.5">
          <p className="text-xs text-muted-foreground">
            {theme === 'system'
              ? 'Follows your system preference'
              : `Currently using ${getThemeLabel().toLowerCase()} theme`
            }
          </p>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Simple toggle button for switching between light and dark
export function ThemeToggleSimple({ className }: { className?: string }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      setTheme(systemTheme);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className={className} disabled>
        <Sun className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className={className}
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
    </Button>
  );
}

// Theme provider hook
export function useTheme() {
  const [theme, setTheme] = useState<Theme>('system');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }

    localStorage.setItem('theme', theme);
  }, [theme, mounted]);

  const changeTheme = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  const resolvedTheme = theme === 'system'
    ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : theme;

  return {
    theme,
    resolvedTheme,
    setTheme: changeTheme,
    isDark: resolvedTheme === 'dark',
    isLight: resolvedTheme === 'light'
  };
}

// Theme switcher with preview
export function ThemeToggleWithPreview({ className }: { className?: string }) {
  const { theme, resolvedTheme, setTheme, isDark } = useTheme();

  const themeOptions = [
    {
      value: 'light' as Theme,
      label: 'Light',
      description: 'Clean and bright interface',
      icon: <Sun className="h-4 w-4" />,
      preview: 'bg-white border-2 border-gray-200'
    },
    {
      value: 'dark' as Theme,
      label: 'Dark',
      description: 'Easy on the eyes',
      icon: <Moon className="h-4 w-4" />,
      preview: 'bg-gray-900 border-2 border-gray-700'
    },
    {
      value: 'system' as Theme,
      label: 'System',
      description: 'Follows your device setting',
      icon: <Monitor className="h-4 w-4" />,
      preview: 'bg-gradient-to-r from-white to-gray-900 border-2 border-gray-400'
    }
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="text-center">
        <p className="text-sm font-medium mb-2">Choose your theme</p>
        <p className="text-xs text-muted-foreground">
          Select how you want the interface to look
        </p>
      </div>

      <div className="grid gap-3">
        {themeOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setTheme(option.value)}
            className={`flex items-center space-x-3 p-3 rounded-lg border-2 transition-all ${
              theme === option.value
                ? 'border-primary bg-accent'
                : 'border-border hover:bg-accent/50'
            }`}
          >
            <div className={`w-12 h-8 rounded ${option.preview} flex items-center justify-center`}>
              {option.value === 'system' ? (
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <div className="w-2 h-2 bg-gray-800 rounded-full"></div>
                </div>
              ) : (
                <div className={`w-2 h-2 rounded-full ${
                  option.value === 'light' ? 'bg-gray-800' : 'bg-white'
                }`}></div>
              )}
            </div>
            <div className="flex-1 text-left">
              <div className="flex items-center space-x-2">
                {option.icon}
                <span className="font-medium">{option.label}</span>
                {theme === option.value && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </div>
              <p className="text-xs text-muted-foreground">{option.description}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="text-center">
        <p className="text-xs text-muted-foreground">
          {theme === 'system'
            ? `Currently using ${resolvedTheme} theme based on your system`
            : `Your preference will be saved for future visits`
          }
        </p>
      </div>
    </div>
  );
}