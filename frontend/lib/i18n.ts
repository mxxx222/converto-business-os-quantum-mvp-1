import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

const locales: string[] = ['fi', 'en', 'sv', 'ru', 'et'];

export default getRequestConfig(async ({ locale }: { locale?: string }): Promise<{ locale: string; messages: Record<string, string> }> => {
  // Validate that the incoming `locale` parameter is valid
  if (!locale || !locales.includes(locale)) {
    notFound();
  }

  return {
    locale: locale || 'en', // Default to 'en' if locale is invalid
    messages: (await import(`../messages/${locale}.json`)).default
  };
});
