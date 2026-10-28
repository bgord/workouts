import * as bg from "@bgord/ui";
import { CalendarX, SearchX } from "lucide-react";
import * as WorkoutHistoryFiltersForm from "../../app/services/workout-history-filters-form";
import * as ui from "../components";
import { workoutsRoute } from "../router";

export function WorkoutHistoryEmpty() {
  const t = bg.useTranslations();
  const search = workoutsRoute.useSearch();

  if (WorkoutHistoryFiltersForm.Form.isDefault(search)) {
    return (
      <ui.EmptyState>
        <ui.EmptyStateIcon icon={CalendarX} />

        <ui.EmptyStateMessage>{t("workout.list.none_scheduled")}</ui.EmptyStateMessage>

        <small>{t("workout.list.none_scheduled.hint")}</small>
      </ui.EmptyState>
    );
  }

  return (
    <ui.EmptyState>
      <ui.EmptyStateIcon icon={SearchX} />

      <ui.EmptyStateMessage>{t("workout.list.no_matches")}</ui.EmptyStateMessage>

      <small>{t("workout.list.no_matches.hint")}</small>
    </ui.EmptyState>
  );
}
