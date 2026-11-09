import * as bg from "@bgord/ui";
import * as ui from "../components";
import { Download } from "../icons";

export function ProfileWorkoutsExport() {
  const t = bg.useTranslations();

  return (
    <section className="c-card" data-variant="flat" {...ui.Spacing.surface} {...ui.Gap.related}>
      <div data-stack="x" {...ui.Gap.cluster}>
        <Download data-color="neutral-400" data-size="sm" />
        <h2>{t("profile.export_workouts.header")}</h2>
      </div>

      <div data-color="neutral-500">{t("profile.export_workouts.hint")}</div>

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
