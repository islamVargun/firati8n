// Konum: components/logout-button.tsx

"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "@/navigation";
import { createClient } from "@/lib/supabase/client";
import { useTranslations } from "next-intl"; // 1. Adım: useTranslations'ı import et

export function LogoutButton() {
  const router = useRouter();
  const t = useTranslations("LogoutButton"); // 2. Adım: İlgili çeviri grubunu seç

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  // 3. Adım: Sabit metni t() fonksiyonu ile değiştir
  return <Button onClick={logout}>{t("logout")}</Button>;
}
