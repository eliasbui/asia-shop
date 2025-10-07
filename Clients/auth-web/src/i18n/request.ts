import { getRequestConfig } from 'next-intl/server';
import { locales, Locale, defaultLocale } from './config';

export default getRequestConfig(async ({ locale }) => {
  // Ensure locale is defined and valid
  const validatedLocale = locale || defaultLocale;
  
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(validatedLocale as Locale)) {
    throw new Error(`Invalid locale: ${validatedLocale}`);
  }

  return {
    locale: validatedLocale,
    messages: (await import(`../../messages/${validatedLocale}.json`)).default
  };
});