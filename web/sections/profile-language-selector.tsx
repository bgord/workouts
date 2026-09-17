import { useTranslations } from "@bgord/ui";
import { Languages } from "lucide-react";
import * as ui from "../components";

export function ProfileLanguageSelector() {
  const t = useTranslations();

  return (
    <section className="c-card" data-gap="4" data-p="4" data-variant="flat">
      <div data-cross="center" data-gap="3" data-stack="x">
        <Languages data-color="neutral-400" data-size="sm" />
        <ui.SectionHeading>{t("profile.change_language.header")}</ui.SectionHeading>
      </div>

      <ui.LanguageSelector />
    </section>
  );
}
