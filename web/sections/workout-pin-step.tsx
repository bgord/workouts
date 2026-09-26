import * as bg from "@bgord/ui";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { WorkoutExercise } from "../../modules/workouts/queries/get-workout";
import type { UsePinnedExerciseReturnType } from "../hooks/use-pinned-exercise";
import { workoutRoute } from "../router";

export function WorkoutPinStep(props: {
  exercise: WorkoutExercise;
  direction: "previous" | "next";
  onPin: UsePinnedExerciseReturnType["pin"];
}) {
  const t = bg.useTranslations();
  const { workout } = workoutRoute.useLoaderData();

  const exercises = workout.data.exercises.filter((exercise) => exercise.actions.setLog.available);
  const index = exercises.findIndex((exercise) => exercise.id === props.exercise.id);
  const sibling = exercises[props.direction === "previous" ? index - 1 : index + 1];

  const title = sibling
    ? t(`workout.pin.${props.direction}.title`, { name: sibling.exerciseName })
    : t(`workout.pin.${props.direction}`);

  return (
    <button
      aria-label={title}
      data-color={sibling ? "neutral-400" : "neutral-700"}
      data-cursor={sibling ? "pointer" : undefined}
      data-hover-color={sibling ? "neutral-0" : undefined}
      data-md-p="1"
      data-p="2-5"
      data-shrink="0"
      data-stack="x"
      disabled={!sibling}
      onClick={() => sibling && props.onPin(sibling.id)}
      title={title}
      type="button"
    >
      {props.direction === "previous" ? <ChevronLeft data-size="sm" /> : <ChevronRight data-size="sm" />}
    </button>
  );
}
