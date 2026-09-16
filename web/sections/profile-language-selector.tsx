import { useTranslations } from "@bgord/ui";
import { Languages } from "lucide-react";
import { LanguageSelector, SectionHeading } from "../components";

export function ProfileLanguageSelector() {
  const t = useTranslations();

  return (
    <section className="c-card" data-gap="4" data-p="4" data-variant="flat">
      <div data-cross="center" data-gap="3" data-stack="x">
        <Languages data-color="neutral-400" data-size="sm" />
        <SectionHeading>{t("profile.change_language.header")}</SectionHeading>
      </div>

      <LanguageSelector />
    </section>
  );
}
