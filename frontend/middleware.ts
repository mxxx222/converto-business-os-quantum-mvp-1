import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['fi', 'en', 'sv', 'ru', 'et'],
  defaultLocale: 'fi',
});

export const config: { matcher: string[] } = {
  matcher: ['/', '/(fi|en|sv|ru|et)/:path*'],
};
