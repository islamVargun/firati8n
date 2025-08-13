// Konum: middleware.ts (proje ana dizini)

import createIntlMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { hasEnvVars } from "@/lib/utils";

// next-intl middleware'ini yapılandır
const intlMiddleware = createIntlMiddleware({
  locales: ["en", "tr"],
  defaultLocale: "tr",
  localePrefix: "as-needed",
  // Tarayıcının dil tercihini (Accept-Language header) yok say.
  // Bu, her zaman defaultLocale'i ('tr') kullanmasını sağlar.
  localeDetection: false,
});

export async function middleware(request: NextRequest) {
  // 1. Adım: Önce uluslararasılaştırma (i18n) middleware'ini çalıştır.
  // Bu, URL'ye göre dil bilgisini belirler ve bir yanıt nesnesi oluşturur.
  const i18nResponse = intlMiddleware(request);

  // Eğer ortam değişkenleri yoksa, sadece i18n yanıtını döndür.
  if (!hasEnvVars) {
    return i18nResponse;
  }

  // Supabase istemcisini, i18n'den gelen yanıt (i18nResponse) üzerine
  // çerezleri (cookie) yazacak şekilde yapılandır.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value),
          );
          // Çerezleri hem gelen isteğe hem de giden yanıta ekle
          cookiesToSet.forEach(({ name, value, options }) =>
            i18nResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Kullanıcı oturumunu yenile ve kullanıcı bilgisini al
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // 2. Adım: Kimlik doğrulama ve rota koruma mantığını uygula
  const isAuthRoute = /^\/(tr|en)?\/auth(\/.*)?$/.test(pathname);
  const isRootRoute = /^\/(tr|en)?\/?$/.test(pathname);
  const isProtectedRoute = /^\/(tr|en)?\/protected(\/.*)?$/.test(pathname);

  // Eğer kullanıcı giriş yapmamışsa VE erişmeye çalıştığı sayfa korumalıysa,
  // onu giriş sayfasına yönlendir.
  if (!user && isProtectedRoute) {
    // Yönlendirme URL'sini, i18n middleware'inin belirlediği locale'e göre oluştur.
    const locale =
      i18nResponse.headers.get("x-next-intl-locale") || "tr";
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/auth/login`;
    return NextResponse.redirect(url);
  }

  // Hem i18n hem de Supabase tarafından güncellenmiş çerezleri içeren yanıtı döndür.
  return i18nResponse;
}

export const config = {
  // Middleware'in çalışmayacağı yolları belirtir.
  // api, _next/static, _next/image, ve favicon.ico dışındaki tüm yollarda çalışır.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};