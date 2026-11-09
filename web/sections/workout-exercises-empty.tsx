import * as bg from "@bgord/ui";
import * as ui from "../components";
import { Dumbbell } from "../icons";
import { workoutRoute } from "../router";

export function WorkoutExercisesEmpty() {
  const t = bg.useTranslations();
  const { workout } = workoutRoute.useLoaderData();

  if (workout.data.exercises.length > 0) return null;

  return (
    <ui.EmptyState>
      <ui.EmptyStateIcon icon={Dumbbell} />

      <ui.EmptyStateMessage>{t("workout.exercise.list.empty")}</ui.EmptyStateMessage>
    </ui.EmptyState>
  );
}
