import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { X } from "lucide-react";
import type { ActionState } from "../../modules/action-state";
import type { Workout, WorkoutExerciseWithSets } from "../../modules/workouts/value-objects/workout";
import * as ui from "../components";
import { workoutRoute } from "../router";

export function WorkoutExerciseRemove(props: {
  workout: Workout;
  exercise: WorkoutExerciseWithSets;
  action: ActionState;
}) {
  const t = bg.useTranslations();
  const router = useRouter();

  const workoutExerciseRemove = bg.useToggle({ name: `workout-exercise-remove-${props.exercise.id}` });
  const guarded = props.exercise.loggedSets.length > 0;

  const confirm = (event: React.FormEvent) => {
    event.preventDefault();
    workoutExerciseRemove.enable();
  };

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
    <>
      <form
        data-cross="center"
        data-stack="x"
        data-wrap="nowrap"
        onSubmit={guarded ? confirm : mutation.handleSubmit}
        {...ui.Spacing.related}
      >
        <ui.IconButton
          disabled={!props.action.enabled || mutation.isLoading}
          title={t("workout.exercise.remove.title", { name: props.exercise.exerciseName })}
          tone="danger"
          type="submit"
          {...workoutExerciseRemove.props.controller}
        >
          <X data-size="sm" />
        </ui.IconButton>

        <ui.ActionHint {...props.action} />
      </form>

      <ui.Dialog {...workoutExerciseRemove}>
        <ui.DialogHeader disabled={mutation.isLoading} onClose={workoutExerciseRemove.disable}>
          {t("workout.exercise.remove.header")}
        </ui.DialogHeader>

        <div data-stack="y" {...ui.Spacing.related}>
          <ui.DialogInfo>
            {t("workout.exercise.remove.info", { name: props.exercise.exerciseName })}
          </ui.DialogInfo>
          <ui.DialogStatus variant="irreversible" />
        </div>

        <form aria-busy={mutation.isLoading} data-stack="y" onSubmit={mutation.handleSubmit} {...ui.Spacing.stack}>
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
