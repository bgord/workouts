import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { X } from "lucide-react";
import type { ActionState } from "../../modules/action-state";
import type { Workout, WorkoutExerciseWithSets } from "../../modules/workouts/value-objects/workout";
import {
  ActionHint,
  Dialog,
  DialogError,
  DialogFooter,
  DialogHeader,
  DialogInfo,
  DialogStatus,
  IconButton,
} from "../components";
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
        data-gap="3"
        data-stack="x"
        data-wrap="nowrap"
        onSubmit={guarded ? confirm : mutation.handleSubmit}
      >
        <IconButton
          disabled={!props.action.enabled || mutation.isLoading}
          title={t("workout.exercise.remove.title", { name: props.exercise.exerciseName })}
          tone="danger"
          type="submit"
          {...workoutExerciseRemove.props.controller}
        >
          <X data-size="sm" />
        </IconButton>

        <ActionHint {...props.action} />
      </form>

      <Dialog {...workoutExerciseRemove}>
        <DialogHeader disabled={mutation.isLoading} onClose={workoutExerciseRemove.disable}>
          {t("workout.exercise.remove.header")}
        </DialogHeader>

        <div data-gap="3" data-stack="y">
          <DialogInfo>{t("workout.exercise.remove.info", { name: props.exercise.exerciseName })}</DialogInfo>
          <DialogStatus variant="irreversible" />
        </div>

        <form aria-busy={mutation.isLoading} data-gap="8" data-stack="y" onSubmit={mutation.handleSubmit}>
          {mutation.isError && <DialogError>{t("workout.exercise.remove.error")}</DialogError>}

          <DialogFooter disabled={mutation.isLoading} onCancel={workoutExerciseRemove.disable}>
            <button
              className="c-button"
              data-variant="destructive"
              disabled={mutation.isLoading}
              type="submit"
            >
              {t("workout.exercise.remove.cta")}
            </button>
          </DialogFooter>
        </form>
      </Dialog>
    </>
  );
}
