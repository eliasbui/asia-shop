import type { Money } from '@/lib/types';

/**
 * Format money amount with currency
 */
export function formatMoney(money: Money, locale: string = 'vi-VN'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: money.currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(money.amount);
}

/**
 * Format number with locale
 */
export function formatNumber(value: number, locale: string = 'vi-VN'): string {
  return new Intl.NumberFormat(locale).format(value);
}

/**
 * Format date with locale
 */
export function formatDate(
  date: string | Date,
  locale: string = 'vi-VN',
  options?: Intl.DateTimeFormatOptions
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, options).format(dateObj);
}

/**
 * Mask email address for privacy
 * Example: john.doe@example.com -> jo******@example.com
 */
export function maskEmail(email: string): string {
  const [localPart, domain] = email.split('@');
  if (localPart.length <= 2) {
    return `${localPart[0]}***@${domain}`;
  }
  const visibleChars = 2;
  const masked = localPart.slice(0, visibleChars) + '***';
  return `${masked}@${domain}`;
}

/**
 * Mask phone number for privacy
 * Example: 0901234567 -> 09******67
 */
export function maskPhone(phone: string): string {
  if (phone.length <= 4) {
    return phone;
  }
  const start = phone.slice(0, 2);
  const end = phone.slice(-2);
  const masked = '*'.repeat(Math.max(phone.length - 4, 6));
  return `${start}${masked}${end}`;
}

/**
 * Calculate discount percentage
 */
export function calculateDiscountPercent(
  originalPrice: number,
  salePrice: number
): number {
  if (originalPrice <= 0) return 0;
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
}

/**
 * Format relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(
  date: string | Date,
  locale: string = 'vi-VN'
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  if (diffInSeconds < 60) {
    return rtf.format(-diffInSeconds, 'second');
  } else if (diffInSeconds < 3600) {
    return rtf.format(-Math.floor(diffInSeconds / 60), 'minute');
  } else if (diffInSeconds < 86400) {
    return rtf.format(-Math.floor(diffInSeconds / 3600), 'hour');
  } else if (diffInSeconds < 2592000) {
    return rtf.format(-Math.floor(diffInSeconds / 86400), 'day');
  } else if (diffInSeconds < 31536000) {
    return rtf.format(-Math.floor(diffInSeconds / 2592000), 'month');
  } else {
    return rtf.format(-Math.floor(diffInSeconds / 31536000), 'year');
  }
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

/**
 * Generate slug from text
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

