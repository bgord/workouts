import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { X } from "lucide-react";
import type { ActionState } from "../../modules/action-state";
import type { LoggedSetType } from "../../modules/workouts/value-objects/logged-set";
import type { Workout, WorkoutExerciseWithSets } from "../../modules/workouts/value-objects/workout";
import { WorkoutStatusEnum } from "../../modules/workouts/value-objects/workout-status";
import * as ui from "../components";
import { workoutRoute } from "../router";

export function WorkoutSetRemove(props: {
  workout: Workout;
  exercise: WorkoutExerciseWithSets;
  loggedSet: LoggedSetType;
  action: ActionState;
}) {
  const t = bg.useTranslations();
  const router = useRouter();

  const workoutSetRemove = bg.useToggle({ name: `workout-set-remove-${props.loggedSet.id}` });

  const guarded = props.workout.status === WorkoutStatusEnum.completed;

  const confirm = (event: React.FormEvent) => {
    event.preventDefault();
    workoutSetRemove.enable();
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
        aria-busy={mutation.isLoading}
        data-cross="center"
        data-self="start"
        data-stack="x"
        data-wrap="nowrap"
        onSubmit={guarded ? confirm : mutation.handleSubmit}
        {...ui.Gap.related}
      >
        <ui.IconButton
          disabled={!props.action.enabled || mutation.isLoading}
          title={t("workout.set.remove.title", { setNumber: props.loggedSet.setNumber })}
          tone="danger"
          type="submit"
          {...workoutSetRemove.props.controller}
        >
          <X data-size="sm" />
        </ui.IconButton>
      </form>

      <ui.Dialog {...workoutSetRemove}>
        <ui.DialogHeader disabled={mutation.isLoading} onClose={workoutSetRemove.disable}>
          {t("workout.set.remove.header")}
        </ui.DialogHeader>

        <div data-stack="y" {...ui.Gap.related}>
          <ui.DialogInfo>
            {t("workout.set.remove.info", {
              setNumber: props.loggedSet.setNumber,
              name: props.exercise.exerciseName,
            })}
          </ui.DialogInfo>
          <ui.DialogStatus variant="irreversible" />
        </div>

        <form
          aria-busy={mutation.isLoading}
          data-stack="y"
          onSubmit={mutation.handleSubmit}
          {...ui.Gap.stack}
        >
          {mutation.isError && <ui.DialogError>{t("workout.set.remove.error")}</ui.DialogError>}

          <ui.DialogFooter disabled={mutation.isLoading} onCancel={workoutSetRemove.disable}>
            <button
              className="c-button"
              data-variant="destructive"
              disabled={mutation.isLoading}
              type="submit"
            >
              {t("workout.set.remove.cta")}
            </button>
          </ui.DialogFooter>
        </form>
      </ui.Dialog>
    </>
  );
}
