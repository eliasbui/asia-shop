import { createSharedPathnamesNavigation } from "next-intl/navigation";
import { locales } from "@/lib/i18n/config";

const { Link: NextIntlLink } = createSharedPathnamesNavigation({ locales });

export { NextIntlLink as Link };
