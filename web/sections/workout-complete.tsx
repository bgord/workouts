import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import type { Workout } from "../../modules/workouts/value-objects/workout";
import { workoutRoute } from "../router";

export function WorkoutComplete(props: { workout: Workout }) {
  const t = bg.useTranslations();
  const router = useRouter();

  const mutation = bg.useMutation({
    perform: () =>
      fetch(`/api/workouts/${props.workout.id}/complete`, {
        method: "PATCH",
        credentials: "include",
        headers: bg.WeakETag.fromRevision(props.workout.revision),
      }),
    onSuccess: () => router.invalidate({ filter: (route) => route.id === workoutRoute.id, sync: true }),
  });

  return (
    <form data-cross="center" data-gap="3" data-stack="x" onSubmit={mutation.handleSubmit}>
      <button className="c-button" data-variant="primary" disabled={mutation.isLoading} type="submit">
        {t("workout.complete.cta")}
      </button>

      {mutation.isError && (
        <output data-color="danger-400" data-fs="sm">
          {t("workout.complete.error")}
        </output>
      )}
    </form>
  );
}
