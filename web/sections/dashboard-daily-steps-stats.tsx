import * as bg from "@bgord/ui";
import * as ui from "../components";
import { dashboardRoute } from "../router";
import { DailyStepsStats } from "../sections/daily-steps-stats";

export function DashboardDailyStepsStats() {
  const t = bg.useTranslations();
  const { dailyStepsStats } = dashboardRoute.useLoaderData();

  if (!dailyStepsStats) return null;

  return (
    <div data-stack="y" {...ui.Gap.cluster}>
      <ui.EyebrowLink to="/measurements/daily-steps">{t("measurements.daily_steps.header")}</ui.EyebrowLink>

      <DailyStepsStats {...dailyStepsStats} />
    </div>
  );
}
