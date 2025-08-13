import { Link } from "@/navigation";
import { Button } from "./ui/button";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "./logout-button";
import { getTranslations } from "next-intl/server"; // Sunucu bileşenleri için 'getTranslations' import edilir

export async function AuthButton() {
  const supabase = await createClient();
  const t = await getTranslations("AuthButton"); // Çeviriler alınır

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user ? (
    <div className="flex items-center gap-4">
      {t("greeting", { email: user.email })}

      <LogoutButton />
    </div>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/auth/login">{t("signIn")}</Link>
      </Button>
      <Button asChild size="sm" variant={"default"}>
        <Link href="/auth/sign-up">{t("signUp")}</Link>
        {/* Çeviri kullanılır */}
      </Button>
    </div>
  );
}
