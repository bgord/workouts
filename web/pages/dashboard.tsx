// fallow-ignore-file unused-export
import * as bg from "@bgord/ui";
import * as ui from "../components";
import { DashboardBodyWeightStats } from "../sections/dashboard-body-weight-stats";
import { DashboardEmpty } from "../sections/dashboard-empty";
import { DashboardWorkoutsFastCall } from "../sections/dashboard-workouts-fast-call";
import { DashboardWorkoutStats } from "../sections/dashboard-workouts-stats";

export function Dashboard() {
  const t = bg.useTranslations();

  return (
    <ui.Main>
      <ui.Header>{t("dashboard.header")}</ui.Header>

      <DashboardEmpty />

      <DashboardWorkoutsFastCall />

      <DashboardWorkoutStats />

      <DashboardBodyWeightStats />
    </ui.Main>
  );
}
