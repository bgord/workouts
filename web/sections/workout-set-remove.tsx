import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { X } from "lucide-react";
import type { LoggedSet, WorkoutExercise } from "../../modules/workouts/queries/get-workout";
import { WorkoutStatusEnum } from "../../modules/workouts/value-objects/workout-status";
import * as ui from "../components";
import { workoutRoute } from "../router";

export function WorkoutSetRemove(props: { exercise: WorkoutExercise; loggedSet: LoggedSet }) {
  const t = bg.useTranslations();
  const router = useRouter();
  const { workout } = workoutRoute.useLoaderData();
  const action = props.loggedSet.actions.remove;

  const workoutSetRemove = bg.useToggle({ name: `workout-set-remove-${props.loggedSet.id}` });

  const guarded = workout.data.status === WorkoutStatusEnum.completed;

  const confirm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    workoutSetRemove.enable();
  };

  const mutation = bg.useMutation({
    perform: () =>
      fetch(`/api/workouts/${workout.data.id}/exercise/${props.exercise.id}/set/${props.loggedSet.id}`, {
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
        data-cross="center"
        data-stack="x"
        onSubmit={guarded ? confirm : mutation.handleSubmit}
        {...ui.Gap.cluster}
      >
        <ui.IconButton
          aria-label={t("workout.set.remove.title", { setNumber: props.loggedSet.setNumber })}
          disabled={!action.enabled || mutation.isLoading}
          title={t("workout.set.remove.title", { setNumber: props.loggedSet.setNumber })}
          tone="danger"
          type="submit"
          {...workoutSetRemove.props.controller}
        >
          <X data-size="sm" />
        </ui.IconButton>

        {mutation.isError && <ui.Output>{t("workout.set.remove.error")}</ui.Output>}
      </form>

      <ui.Dialog {...workoutSetRemove}>
        <ui.DialogHeader disabled={mutation.isLoading} onClose={workoutSetRemove.disable}>
          {t("workout.set.remove.header")}
        </ui.DialogHeader>

        <ui.DialogBody>
          <ui.DialogInfo>
            {t("workout.set.remove.info", {
              setNumber: props.loggedSet.setNumber,
              name: props.exercise.exerciseName,
            })}
          </ui.DialogInfo>
          <ui.DialogStatus variant="irreversible" />
        </ui.DialogBody>

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
