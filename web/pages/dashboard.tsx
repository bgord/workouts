import * as bg from "@bgord/ui";
import * as ui from "../components";
import { DashboardBodyWeightStats } from "../sections/dashboard-body-weight-stats";
import { DashboardDailyStepsStats } from "../sections/dashboard-daily-steps-stats";
import { DashboardEmpty } from "../sections/dashboard-empty";
import { DashboardWorkoutsFastCall } from "../sections/dashboard-workouts-fast-call";
import { DashboardWorkoutStats } from "../sections/dashboard-workouts-stats";

export function Dashboard() {
  const t = bg.useTranslations();

  return (
    <ui.Main>
      <h1>{t("dashboard.header")}</h1>

      <DashboardEmpty />

      <DashboardWorkoutsFastCall />

      <DashboardWorkoutStats />

      <DashboardBodyWeightStats />

      <DashboardDailyStepsStats />
    </ui.Main>
  );
}
