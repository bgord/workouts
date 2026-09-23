import * as bg from "@bgord/ui";
import { SearchX } from "lucide-react";
import type { WorkoutSummary } from "../../modules/workouts/value-objects/workout-summary";
import * as ui from "../components";

export function WorkoutHistoryEmpty(props: { matching: Array<WorkoutSummary> }) {
  const t = bg.useTranslations();

  if (props.matching.length > 0) return null;

  return (
    <ui.EmptyState>
      <ui.EmptyStateIcon icon={SearchX} />

      <ui.EmptyStateMessage>{t("workout.list.no_matches")}</ui.EmptyStateMessage>

      <small>{t("workout.list.no_matches.hint")}</small>
    </ui.EmptyState>
  );
}
