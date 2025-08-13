"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Laptop, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const t = useTranslations("ThemeSwitcher");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Sunucu tarafında ve ilk istemci render'ında butonu boş göstermek
    // hidrasyon hatalarını önler.
    return <Button variant="ghost" size={"sm"} className="h-9 w-9" />;
  }

  const ICON_SIZE = 16;

  // Hangi ikonun gösterileceğini render etmeden önce belirleyelim.
  let ActiveIcon;
  if (theme === "light") {
    ActiveIcon = (
      <Sun key="light" size={ICON_SIZE} className="text-muted-foreground" />
    );
  } else if (theme === "dark") {
    ActiveIcon = (
      <Moon key="dark" size={ICON_SIZE} className="text-muted-foreground" />
    );
  } else {
    ActiveIcon = (
      <Laptop key="system" size={ICON_SIZE} className="text-muted-foreground" />
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size={"sm"}>
          {ActiveIcon}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-content" align="start">
        <DropdownMenuRadioGroup
          value={theme}
          onValueChange={(e) => setTheme(e)}
        >
          <DropdownMenuRadioItem className="flex gap-2" value="light">
            <Sun size={ICON_SIZE} className="text-muted-foreground" />{" "}
            <span>{t("light")}</span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem className="flex gap-2" value="dark">
            <Moon size={ICON_SIZE} className="text-muted-foreground" />{" "}
            <span>{t("dark")}</span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem className="flex gap-2" value="system">
            <Laptop size={ICON_SIZE} className="text-muted-foreground" />{" "}
            <span>{t("system")}</span>
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { ThemeSwitcher };
