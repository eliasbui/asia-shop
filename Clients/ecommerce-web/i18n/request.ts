import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";

export const locales = ["vi", "en"] as const;
export const defaultLocale = "vi";

export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as any)) notFound();

  return {
    messages: (await import(`../src/messages/${locale}.json`)).default,
  };
});
