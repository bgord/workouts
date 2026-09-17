import { useTranslations } from "@bgord/ui";
import { Download } from "lucide-react";
import * as ui from "../components";

export function ProfileWorkoutsExport() {
  const t = useTranslations();

  return (
    <section className="c-card" data-gap="4" data-p="4" data-variant="flat">
      <div data-cross="center" data-gap="3" data-stack="x">
        <Download data-color="neutral-400" data-size="sm" />
        <ui.SectionHeading>{t("profile.export_workouts.header")}</ui.SectionHeading>
      </div>

      <div data-color="neutral-500" data-fs="sm">
        {t("profile.export_workouts.hint")}
      </div>

      <a
        className="c-button"
        data-self="start"
        data-variant="ghost"
        download
        href="/api/workouts/export"
        rel="noopener"
        target="_blank"
      >
        <Download data-size="sm" />
        {t("profile.export_workouts.cta")}
      </a>
    </section>
  );
}
