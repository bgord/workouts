import { useTranslations } from "@bgord/ui";
import { Languages } from "lucide-react";
import * as ui from "../components";

export function ProfileLanguageSelector() {
  const t = useTranslations();

  return (
    <section className="c-card" data-variant="flat" {...ui.Spacing.surface} {...ui.Spacing.related}>
      <div data-cross="center" data-stack="x" {...ui.Spacing.cluster}>
        <Languages data-color="neutral-400" data-size="sm" />
        <ui.SectionHeading>{t("profile.change_language.header")}</ui.SectionHeading>
      </div>

      <ui.LanguageSelector />
    </section>
  );
}
