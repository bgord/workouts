import * as bg from "@bgord/ui";
import { Download } from "lucide-react";
import { dailyStepsRoute } from "../router";

export function DailyStepsExport() {
  const t = bg.useTranslations();
  const { dailyStepsStats } = dailyStepsRoute.useLoaderData();

  if (!dailyStepsStats) return null;

  return (
    <bg.MenuLink download href="/api/measurements/daily-steps/export" rel="noopener" target="_blank">
      <Download data-size="sm" />
      {t("measurements.daily_steps.export.cta")}
    </bg.MenuLink>
  );
}
