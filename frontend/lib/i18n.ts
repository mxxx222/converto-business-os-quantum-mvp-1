import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

const locales: string[] = ['fi', 'en', 'sv', 'ru', 'et'];

export default getRequestConfig(async ({ locale }: { locale: string }): Promise<{ messages: Record<string, any> }> => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale)) notFound();

  return {
    messages: (await import(`../messages/${locale}.json`)).default
  };
});
