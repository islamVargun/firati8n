import {
  createNavigation,
  Pathnames
} from 'next-intl/navigation';

export const locales = ['en', 'tr'] as const;
export const defaultLocale = 'tr' as const;
export const localePrefix = 'as-needed';

// Projedeki tüm ana yolları buraya ekliyoruz.
// Bu, next-intl'in diller arası geçişte doğru URL'leri oluşturmasını sağlar.
export const pathnames = {
  // Ana yollar
  '/': '/',
  '/protected': '/protected',

  // Kimlik doğrulama yolları
  '/auth/login': '/auth/login',
  '/auth/sign-up': '/auth/sign-up',
  '/auth/forgot-password': '/auth/forgot-password',
  '/auth/update-password': '/auth/update-password',
  '/auth/sign-up-success': '/auth/sign-up-success',
  '/auth/error': '/auth/error'

} satisfies Pathnames<typeof locales>;

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation({
    locales,
    localePrefix,
    pathnames,
    defaultLocale
  });
