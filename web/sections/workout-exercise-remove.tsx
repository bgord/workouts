import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { CircleX } from "lucide-react";
import type { ActionState } from "../../modules/action-state";
import type { Workout, WorkoutExerciseWithSets } from "../../modules/workouts/value-objects/workout";
import { ActionHint } from "../components";
import { workoutRoute } from "../router";

export function WorkoutExerciseRemove(props: {
  workout: Workout;
  exercise: WorkoutExerciseWithSets;
  action: ActionState;
}) {
  const t = bg.useTranslations();
  const router = useRouter();

  const mutation = bg.useMutation({
    perform: () =>
      fetch(`/api/workouts/${props.workout.id}/exercise/${props.exercise.id}`, {
        method: "DELETE",
        credentials: "include",
        headers: bg.WeakETag.fromRevision(props.workout.revision),
      }),
    onSuccess: () => router.invalidate({ filter: (route) => route.id === workoutRoute.id, sync: true }),
  });

  return (
    <form
      data-cross="center"
      data-gap="3"
      data-mb="auto"
      data-stack="x"
      data-wrap="nowrap"
      onSubmit={mutation.handleSubmit}
    >
      <button
        className="c-button"
        data-color="neutral-400"
        data-hover-color="danger-400"
        data-variant="ghost"
        disabled={!props.action.enabled || mutation.isLoading}
        title={t("workout.exercise.remove.title", { name: props.exercise.exerciseName })}
        type="submit"
      >
        <CircleX data-size="sm" />
      </button>

      <ActionHint action={props.action} />
    </form>
  );
}
