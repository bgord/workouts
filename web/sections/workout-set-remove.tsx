import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { X } from "lucide-react";
import type { ActionState } from "../../modules/action-state";
import type { LoggedSetType } from "../../modules/workouts/value-objects/logged-set";
import type { Workout, WorkoutExerciseWithSets } from "../../modules/workouts/value-objects/workout";
import { WorkoutStatusEnum } from "../../modules/workouts/value-objects/workout-status";
import { Dialog, DialogError, DialogFooter, DialogHeader, DialogInfo, DialogStatus } from "../components";
import { workoutRoute } from "../router";

export function WorkoutSetRemove(props: {
  workout: Workout;
  exercise: WorkoutExerciseWithSets;
  loggedSet: LoggedSetType;
  action: ActionState;
}) {
  const t = bg.useTranslations();
  const router = useRouter();
  const dialog = bg.useToggle({ name: `workout-set-remove-${props.loggedSet.id}` });
  const guarded = props.workout.status === WorkoutStatusEnum.completed;

  const confirm = (event: React.FormEvent) => {
    event.preventDefault();
    dialog.enable();
  };

  const mutation = bg.useMutation({
    perform: () =>
      fetch(`/api/workouts/${props.workout.id}/exercise/${props.exercise.id}/set/${props.loggedSet.id}`, {
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
        data-self="start"
        data-stack="x"
        data-wrap="nowrap"
        onSubmit={guarded ? confirm : mutation.handleSubmit}
      >
        <button
          className="c-button"
          data-color="neutral-400"
          data-hover-color="danger-400"
          data-px="0"
          data-shrink="0"
          data-variant="ghost"
          disabled={!props.action.enabled || mutation.isLoading}
          title={t("workout.set.remove.title", { setNumber: props.loggedSet.setNumber })}
          type="submit"
          {...bg.Rhythm().times(3).style.width}
          {...dialog.props.controller}
        >
          <X data-size="sm" />
        </button>
      </form>

      <Dialog {...dialog}>
        <DialogHeader disabled={mutation.isLoading} onClose={dialog.disable}>
          {t("workout.set.remove.header")}
        </DialogHeader>

        <div data-gap="3" data-stack="y">
          <DialogInfo>
            {t("workout.set.remove.info", {
              setNumber: props.loggedSet.setNumber,
              name: props.exercise.exerciseName,
            })}
          </DialogInfo>
          <DialogStatus variant="irreversible" />
        </div>

        <form aria-busy={mutation.isLoading} data-gap="8" data-stack="y" onSubmit={mutation.handleSubmit}>
          {mutation.isError && <DialogError>{t("workout.set.remove.error")}</DialogError>}

          <DialogFooter disabled={mutation.isLoading} onCancel={dialog.disable}>
            <button
              className="c-button"
              data-variant="destructive"
              disabled={mutation.isLoading}
              type="submit"
            >
              {t("workout.set.remove.cta")}
            </button>
          </DialogFooter>
        </form>
      </Dialog>
    </>
  );
}
