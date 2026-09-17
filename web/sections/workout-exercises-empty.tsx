// fallow-ignore-file unused-export
import * as bg from "@bgord/ui";
import { Dumbbell } from "lucide-react";
import * as ui from "../components";
import { workoutRoute } from "../router";

export function WorkoutExercisesEmpty() {
  const t = bg.useTranslations();
  const { workout } = workoutRoute.useLoaderData();

  const empty = workout.data.exercises.length === 0;

  if (!empty) return null;

  return (
    <ui.EmptyState>
      <ui.EmptyStateIcon icon={Dumbbell} />

      <ui.EmptyStateMessage>{t("workout.exercise.list.empty")}</ui.EmptyStateMessage>
    </ui.EmptyState>
  );
}
