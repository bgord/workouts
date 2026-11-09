import * as bg from "@bgord/ui";
import * as ui from "../components";
import { CalendarOff } from "../icons";
import { dashboardRoute } from "../router";

export function DashboardEmpty() {
  const t = bg.useTranslations();
  const { dashboard } = dashboardRoute.useLoaderData();

  const upcoming = dashboard.inProgress ?? dashboard.nextUp;
  const empty = !(upcoming || dashboard.lastCompleted);

  if (!empty) return null;

  return (
    <ui.EmptyState>
      <ui.EmptyStateIcon icon={CalendarOff} />

      <ui.EmptyStateMessage>{t("dashboard.empty")}</ui.EmptyStateMessage>

      <small>{t("dashboard.empty.hint")}</small>

      <ui.EmptyStateLink to="/workouts">{t("dashboard.empty.cta")}</ui.EmptyStateLink>
    </ui.EmptyState>
  );
}
