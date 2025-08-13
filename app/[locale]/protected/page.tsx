import { redirect } from "@/navigation"; // Yönlendirmeyi @/navigation'dan al
import { createClient } from "@/lib/supabase/server";
import { InfoIcon } from "lucide-react";
import { FetchDataSteps } from "@/components/tutorial/fetch-data-steps";
import { getTranslations } from "next-intl/server"; // Çeviri için import et

export default async function ProtectedPage() {
  const supabase = await createClient();
  const t = await getTranslations("ProtectedPage"); // Çevirileri al

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/auth/login"); // Eğer kullanıcı yoksa giriş sayfasına yönlendir
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="w-full">
        <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
          <InfoIcon size="16" strokeWidth={2} />
          {t("info")}
        </div>
      </div>
      <div className="flex flex-col gap-2 items-start">
        <h2 className="font-bold text-2xl mb-4">{t("userDetails")}</h2>
        <pre className="text-xs font-mono p-3 rounded border max-h-32 overflow-auto">
          {JSON.stringify(user, null, 2)}
        </pre>
      </div>
      <div>
        <h2 className="font-bold text-2xl mb-4">{t("nextSteps")}</h2>
        <FetchDataSteps />
      </div>
    </div>
  );
}
