import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import type { ActionState } from "../../modules/action-state";
import type { Workout, WorkoutExerciseWithSets } from "../../modules/workouts/value-objects/workout";
import { ActionHint } from "../components";
import { workoutRoute } from "../router";
import { WeightFormat } from "../services/weight-format";

export function WorkoutSetLog(props: {
  workout: Workout;
  exercise: WorkoutExerciseWithSets;
  action: ActionState;
}) {
  const t = bg.useTranslations();
  const router = useRouter();

  const reps = bg.useNumberField({
    name: `logged-reps-${props.exercise.id}`,
    defaultValue: props.exercise.target?.reps,
  });

  const load = bg.useNumberField({
    name: `logged-load-${props.exercise.id}`,
    defaultValue: props.exercise.target
      ? WeightFormat.kilograms(props.exercise.target.load)
      : bg.NumberField.EMPTY,
  });

  const mutation = bg.useMutation({
    perform: () =>
      fetch(`/api/workouts/${props.workout.id}/exercise/${props.exercise.id}/set`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json", ...bg.WeakETag.fromRevision(props.workout.revision) },
        body: JSON.stringify({
          reps: reps.value,
          load: WeightFormat.grams(load.value ?? 0),
        }),
      }),
    onSuccess: () => router.invalidate({ filter: (route) => route.id === workoutRoute.id, sync: true }),
  });

  const done = props.exercise.loggedSets.length;

  return (
    <form className="c-card-footer" data-cross="end" data-gap="3" onSubmit={mutation.handleSubmit}>
      <div data-gap="1" data-stack="y">
        <label className="c-label" data-variant="inline" {...reps.label.props}>
          {t("workout.set.reps.label")}
        </label>

        <input
          className="c-input"
          min="1"
          type="number"
          {...reps.input.props}
          {...bg.Rhythm(64).times(1).style.width}
        />
      </div>

      <div data-gap="1" data-stack="y">
        <label className="c-label" data-variant="inline" {...load.label.props}>
          {t("workout.set.load.label")}
        </label>

        <input
          className="c-input"
          min="0"
          step="0.5"
          type="number"
          {...load.input.props}
          {...bg.Rhythm(80).times(1).style.width}
        />
      </div>

      <div data-cross="center" data-gap="3" data-stack="x">
        <button
          aria-label={t("workout.set.cta")}
          className="c-button"
          data-variant="primary"
          disabled={!props.action.enabled || reps.empty || load.empty || mutation.isLoading}
          title={t("workout.set.cta")}
          type="submit"
        >
          <Plus data-size="sm" />
        </button>

        <ActionHint action={props.action} />

        {props.exercise.target && (
          <div data-color="neutral-400" data-fs="sm">
            {t("workout.set.progress", { done, target: props.exercise.target.sets })}
          </div>
        )}

        {mutation.isError && (
          <output data-color="danger-400" data-fs="sm">
            {t("workout.set.error")}
          </output>
        )}
      </div>
    </form>
  );
}
