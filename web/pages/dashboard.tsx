// fallow-ignore-file unused-export
import * as bg from "@bgord/ui";
import * as ui from "../components";
import * as Sections from "../sections";

export function Dashboard() {
  const t = bg.useTranslations();

  return (
    <ui.Main>
      <ui.Header>{t("dashboard.header")}</ui.Header>

      <Sections.DashboardEmpty />

      <Sections.DashboardWorkoutsFastCall />

      <Sections.DashboardWorkoutStats />

      <Sections.DashboardBodyWeightStats />
    </ui.Main>
  );
}
