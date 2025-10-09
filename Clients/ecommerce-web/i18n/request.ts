import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";

export const locales = ["vi", "en"] as const;
export const defaultLocale = "vi";

export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ requestLocale }) => {
  // Get the locale from the request (it's already a Promise in next-intl 3.22+)
  let locale = await requestLocale;

  // Validate locale
  if (!locale || !locales.includes(locale as any)) {
    locale = defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../src/messages/${locale}.json`)).default,
  };
});
