// Konum: i18n.ts

import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";

// Desteklenen dillerin listesi
const locales = ["en", "tr"];

export default getRequestConfig(async ({ locale }) => {
  // Gelen 'locale' parametresinin geçerli olup olmadığını doğrula.
  if (!locales.includes(locale as any)) {
    notFound();
  }

  return {
    // Bu satırı güncelleyin
    messages: (await import(`./messages/${locale}.json`)).default,
    locale, // Bu satırı ekleyin
  };
});