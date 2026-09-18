import * as bg from "@bgord/ui";
import { Dumbbell } from "lucide-react";
import * as ui from "../components";
import { exerciseRoute } from "../router";

export function ExercisePerformancesEmpty() {
  const t = bg.useTranslations();
  const { performances } = exerciseRoute.useLoaderData();

  if (performances.length > 0) return null;

  return (
    <ui.EmptyState>
      <ui.EmptyStateIcon icon={Dumbbell} />

      <ui.EmptyStateMessage>{t("statistics.exercise.history.empty")}</ui.EmptyStateMessage>

      <ui.Meta>{t("statistics.exercise.history.empty.hint")}</ui.Meta>
    </ui.EmptyState>
  );
}
