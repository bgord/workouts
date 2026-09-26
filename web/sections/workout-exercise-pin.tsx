import * as bg from "@bgord/ui";
import { Pin } from "lucide-react";
import type { WorkoutExercise } from "../../modules/workouts/queries/get-workout";
import type { UsePinnedExerciseReturnType } from "../hooks/use-pinned-exercise";

export function WorkoutExercisePin(
  props: UsePinnedExerciseReturnType & { exercise: WorkoutExercise; children: React.ReactNode },
) {
  const t = bg.useTranslations();

  if (!props.exercise.actions.setLog.available) return props.children;

  const pinned = props.id === props.exercise.id;
  const title = pinned
    ? t("workout.exercise.unpin.title", { name: props.exercise.exerciseName })
    : t("workout.exercise.pin.title", { name: props.exercise.exerciseName });

  return (
    <div data-cross="center" data-shrink="0" data-stack="y">
      {props.children}

      <button
        aria-label={title}
        aria-pressed={pinned}
        data-color={pinned ? "brand-400" : "neutral-600"}
        data-cursor="pointer"
        data-hover-color={pinned ? "brand-300" : "neutral-200"}
        data-p="1-5"
        data-shrink="0"
        data-stack="x"
        onClick={() => (pinned ? props.unpin() : props.pin(props.exercise.id))}
        title={title}
        type="button"
      >
        <Pin data-size="xs" fill={pinned ? "currentColor" : "none"} />
      </button>
    </div>
  );
}
