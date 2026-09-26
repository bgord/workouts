import * as bg from "@bgord/ui";
import { PanelBottomClose, PanelBottomOpen } from "lucide-react";
import type { WorkoutExercise } from "../../modules/workouts/queries/get-workout";
import { usePinnedExercise } from "../hooks/use-pinned-exercise";

export function WorkoutExercisePin(props: { exercise: WorkoutExercise }) {
  const t = bg.useTranslations();
  const { pinned, pin, unpin } = usePinnedExercise();

  const isPinned = pinned?.id === props.exercise.id;

  const title = isPinned
    ? t("workout.exercise.unpin.title", { name: props.exercise.exerciseName })
    : t("workout.exercise.pin.title", { name: props.exercise.exerciseName });

  return (
    <button
      aria-label={title}
      aria-pressed={isPinned}
      data-color={isPinned ? "brand-400" : "neutral-600"}
      data-cursor="pointer"
      data-hover-color={isPinned ? "brand-300" : "neutral-200"}
      data-p="1-5"
      data-shrink="0"
      data-stack="x"
      onClick={isPinned ? unpin : () => pin(props.exercise.id)}
      title={title}
      type="button"
    >
      {isPinned ? <PanelBottomClose data-size="xs" /> : <PanelBottomOpen data-size="xs" />}
    </button>
  );
}
