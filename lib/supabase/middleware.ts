import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { hasEnvVars } from "../utils";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  if (!hasEnvVars) {
    return supabaseResponse;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { pathname } = request.nextUrl;

  // Kimlik doğrulaması gerektirmeyen yolları kontrol et
  // Bu regex, /tr/auth/login, /en/auth/login ve /auth/login gibi tüm olasılıkları kapsar
  const isAuthRoute = /^\/(\w{2}\/)?auth(\/.*)?$/.test(pathname);
  // Ana sayfanın tüm versiyonlarını kontrol et (/, /tr, /en)
  const isRootRoute = /^\/(\w{2})?\/?$/.test(pathname);

  // Eğer kullanıcı giriş yapmamışsa VE erişmeye çalıştığı sayfa korumalıysa
  if (!user && !isAuthRoute && !isRootRoute) {
    // Mevcut dilden veya varsayılan dilden giriş sayfasına yönlendir
    const locale = pathname.split("/")[1]?.length === 2 ? pathname.split("/")[1] : "tr";
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = `/${locale}/auth/login`;
    return NextResponse.redirect(redirectUrl);
  }

  return supabaseResponse;
}
