import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { X } from "lucide-react";
import type { WorkoutExercise } from "../../modules/workouts/queries/get-workout";
import * as ui from "../components";
import { workoutRoute } from "../router";

export function WorkoutExerciseRemove(props: WorkoutExercise) {
  const t = bg.useTranslations();
  const router = useRouter();
  const { workout } = workoutRoute.useLoaderData();
  const action = props.actions.remove;

  const workoutExerciseRemove = bg.useToggle({ name: `workout-exercise-remove-${props.id}` });
  const guarded = props.loggedSets.length > 0;

  const confirm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    workoutExerciseRemove.enable();
  };

  const mutation = bg.useMutation({
    perform: () =>
      fetch(`/api/workouts/${workout.data.id}/exercise/${props.id}`, {
        method: "DELETE",
        credentials: "include",
        headers: bg.WeakETag.fromRevision(workout.data.revision),
      }),
    onSuccess: () => router.invalidate({ filter: (route) => route.id === workoutRoute.id, sync: true }),
  });

  if (!action.available) return null;

  return (
    <>
      <form
        aria-busy={mutation.isLoading}
        data-stack="x"
        onSubmit={guarded ? confirm : mutation.handleSubmit}
        {...ui.Gap.related}
      >
        <ui.IconButton
          aria-label={t("workout.exercise.remove.title", { name: props.exerciseName })}
          disabled={!action.enabled || mutation.isLoading}
          title={t("workout.exercise.remove.title", { name: props.exerciseName })}
          tone="danger"
          type="submit"
          {...workoutExerciseRemove.props.controller}
        >
          <X data-size="sm" />
        </ui.IconButton>

        <ui.ActionHint {...action} />

        {mutation.isError && <ui.Output>{t("workout.exercise.remove.error")}</ui.Output>}
      </form>

      <ui.Dialog {...workoutExerciseRemove}>
        <ui.DialogHeader disabled={mutation.isLoading} onClose={workoutExerciseRemove.disable}>
          {t("workout.exercise.remove.header")}
        </ui.DialogHeader>

        <ui.DialogBody>
          <ui.DialogInfo>{t("workout.exercise.remove.info", { name: props.exerciseName })}</ui.DialogInfo>
          <ui.DialogStatus variant="irreversible" />
        </ui.DialogBody>

        <form
          aria-busy={mutation.isLoading}
          data-stack="y"
          onSubmit={mutation.handleSubmit}
          {...ui.Gap.stack}
        >
          {mutation.isError && <ui.DialogError>{t("workout.exercise.remove.error")}</ui.DialogError>}

          <ui.DialogFooter disabled={mutation.isLoading} onCancel={workoutExerciseRemove.disable}>
            <button
              className="c-button"
              data-variant="destructive"
              disabled={mutation.isLoading}
              type="submit"
            >
              {t("workout.exercise.remove.cta")}
            </button>
          </ui.DialogFooter>
        </form>
      </ui.Dialog>
    </>
  );
}
