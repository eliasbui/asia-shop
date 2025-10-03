import { getRequestConfig } from "next-intl/server";
import { locales, defaultLocale, type Locale } from "./config";

export default getRequestConfig(async ({ requestLocale }) => {
  // Get the locale from the request
  const locale = await requestLocale;

  // Validate that the incoming `locale` parameter is valid
  const isValidLocale = locales.some((l) => l === locale);
  const validLocale: Locale = isValidLocale
    ? (locale as Locale)
    : defaultLocale;

  return {
    locale: validLocale,
    messages: (await import(`../../../messages/${validLocale}.json`)).default,
  };
});
