import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import type { Workout } from "../../modules/workouts/value-objects/workout";
import { WorkoutInProgressLimitForOwnerMax } from "../../modules/workouts/value-objects/workout-in-progress-limit-for-owner";
import { WorkoutStatusEnum } from "../../modules/workouts/value-objects/workout-status";
import { workoutRoute } from "../router";

export function WorkoutStart(props: { workout: Workout }) {
  const t = bg.useTranslations();
  const router = useRouter();
  const { workouts } = workoutRoute.useLoaderData();

  const mutation = bg.useMutation({
    perform: () =>
      fetch(`/api/workouts/${props.workout.id}/start`, {
        method: "PATCH",
        credentials: "include",
        headers: bg.WeakETag.fromRevision(props.workout.revision),
      }),
    onSuccess: () => router.invalidate({ filter: (route) => route.id === workoutRoute.id, sync: true }),
  });

  const withoutTarget = props.workout.exercises.filter((exercise) => exercise.target === undefined);

  const inProgress = workouts.filter((workout) => workout.status === WorkoutStatusEnum.in_progress).length;

  const hint =
    withoutTarget.length > 0
      ? t("workout.start.blocked.missing_targets", { count: withoutTarget.length })
      : inProgress >= WorkoutInProgressLimitForOwnerMax
        ? t("workout.start.blocked.in_progress_limit")
        : undefined;

  return (
    <form data-cross="center" data-gap="3" data-stack="x" onSubmit={mutation.handleSubmit}>
      <button
        className="c-button"
        data-variant="primary"
        disabled={Boolean(hint) || mutation.isLoading}
        type="submit"
      >
        {t("workout.start.cta")}
      </button>

      {hint && (
        <div data-color="neutral-500" data-fs="sm">
          {hint}
        </div>
      )}

      {mutation.isError && (
        <output data-color="danger-400" data-fs="sm">
          {t("workout.start.error")}
        </output>
      )}
    </form>
  );
}
