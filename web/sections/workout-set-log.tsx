import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import type { Workout, WorkoutExerciseWithSets } from "../../modules/workouts/value-objects/workout";
import { workoutRoute } from "../router";

const GRAMS_IN_KILOGRAM = 1000;

export function WorkoutSetLog(props: { workout: Workout; exercise: WorkoutExerciseWithSets }) {
  const t = bg.useTranslations();
  const router = useRouter();

  const reps = bg.useNumberField({
    name: `logged-reps-${props.exercise.id}`,
    defaultValue: props.exercise.target?.reps,
  });

  const load = bg.useNumberField({
    name: `logged-load-${props.exercise.id}`,
    defaultValue: props.exercise.target
      ? props.exercise.target.load / GRAMS_IN_KILOGRAM
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
          load: Math.round((load.value ?? 0) * GRAMS_IN_KILOGRAM),
        }),
      }),
    onSuccess: () => router.invalidate({ filter: (route) => route.id === workoutRoute.id, sync: true }),
  });

  const done = props.exercise.loggedSets.length;

  return (
    <form data-cross="end" data-gap="2" data-stack="x" onSubmit={mutation.handleSubmit}>
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

      <button
        className="c-button"
        data-variant="primary"
        disabled={reps.empty || load.empty || mutation.isLoading}
        type="submit"
      >
        {t("workout.set.cta")}
      </button>

      {props.exercise.target && (
        <div data-color="neutral-400" data-fs="sm" data-mb="2">
          {t("workout.set.progress", { done, target: props.exercise.target.sets })}
        </div>
      )}

      {mutation.isError && (
        <output data-color="danger-400" data-fs="sm" data-mb="2">
          {t("workout.set.error")}
        </output>
      )}
    </form>
  );
}
