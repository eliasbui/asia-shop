export const locales = ['en', 'vi'] as const;

export type AppLocale = (typeof locales)[number];

export const defaultLocale: AppLocale = 'en';
