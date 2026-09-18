import * as bg from "@bgord/ui";
import { CalendarOff } from "lucide-react";
import { Form as WorkoutHistoryFilters } from "../../app/services/workout-history-filters-form";
import * as ui from "../components";
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

      <ui.Meta>{t("dashboard.empty.hint")}</ui.Meta>

      <ui.EmptyStateLink search={WorkoutHistoryFilters.default} to="/workouts">
        {t("dashboard.empty.cta")}
      </ui.EmptyStateLink>
    </ui.EmptyState>
  );
}
