// next.config.ts
import { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

// Eklentiye i18n.ts dosyasının yolunu doğrudan veriyoruz.
const withNextIntl = createNextIntlPlugin('./i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  // Projenize özel diğer Next.js yapılandırmaları buraya gelebilir.
};

export default withNextIntl(nextConfig);