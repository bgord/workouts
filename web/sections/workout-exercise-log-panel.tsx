import * as bg from "@bgord/ui";
import { PanelBottomOpen } from "lucide-react";
import type { WorkoutExercise } from "../../modules/workouts/queries/get-workout";
import { useLogPanel } from "../hooks/use-log-panel";

export function WorkoutExerciseLogPanel(props: { exercise: WorkoutExercise }) {
  const t = bg.useTranslations();
  const { open } = useLogPanel();

  const title = t("workout.exercise.log_panel.open.title", { name: props.exercise.exerciseName });

  return (
    <button
      aria-label={title}
      data-color="neutral-600"
      data-cursor="pointer"
      data-hover-color="neutral-200"
      data-p="1-5"
      data-shrink="0"
      data-stack="x"
      onClick={() => open(props.exercise.id)}
      title={title}
      type="button"
    >
      <PanelBottomOpen data-size="xs" />
    </button>
  );
}
