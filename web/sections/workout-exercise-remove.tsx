import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import type { Workout, WorkoutExerciseWithSets } from "../../modules/workouts/value-objects/workout";
import { workoutRoute } from "../router";

export function WorkoutExerciseRemove(props: { workout: Workout; exercise: WorkoutExerciseWithSets }) {
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
    <form onSubmit={mutation.handleSubmit}>
      <button
        className="c-button"
        data-color="danger-400"
        data-variant="bare"
        disabled={mutation.isLoading}
        title={t("workout.exercise.remove.title", { name: props.exercise.exerciseName })}
        type="submit"
      >
        {t("workout.exercise.remove.cta")}
      </button>
    </form>
  );
}
