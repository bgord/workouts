import * as bg from "@bgord/ui";
import { Pin } from "lucide-react";
import type { WorkoutExercise } from "../../modules/workouts/queries/get-workout";
import type { UsePinnedExerciseReturnType } from "../hooks/use-pinned-exercise";

export function WorkoutExercisePin(
  props: UsePinnedExerciseReturnType & { exercise: WorkoutExercise; children: React.ReactNode },
) {
  const t = bg.useTranslations();

  if (!props.exercise.actions.setLog.available) return props.children;

  if (props.isPinned(props.exercise)) {
    const title = t("workout.exercise.unpin.title", { name: props.exercise.exerciseName });

    return (
      <button
        aria-label={title}
        aria-pressed
        data-color="brand-400"
        data-cursor="pointer"
        data-hover-color="brand-300"
        data-md-p="1"
        data-p="2-5"
        data-shrink="0"
        data-stack="x"
        onClick={props.unpin}
        title={title}
        type="button"
      >
        <Pin data-size="sm" fill="currentColor" />
      </button>
    );
  }

  const title = t("workout.exercise.pin.title", { name: props.exercise.exerciseName });

  return (
    <div data-cross="center" data-shrink="0" data-stack="y">
      {props.children}

      <button
        aria-label={title}
        aria-pressed={false}
        data-color="neutral-600"
        data-cursor="pointer"
        data-hover-color="neutral-200"
        data-p="1-5"
        data-shrink="0"
        data-stack="x"
        onClick={() => props.pin(props.exercise.id)}
        title={title}
        type="button"
      >
        <Pin data-size="xs" />
      </button>
    </div>
  );
}
