import { useTranslations } from "@bgord/ui";
import { Languages } from "lucide-react";
import { LanguageSelector } from "../components";

export function ProfileLanguageSelector() {
  const t = useTranslations();

  return (
    <section className="c-card" data-gap="5">
      <div data-cross="center" data-gap="3" data-stack="x">
        <Languages data-size="md" />
        <div className="c-card-title">{t("profile.change_language.header")}</div>
      </div>

      <LanguageSelector />
    </section>
  );
}
