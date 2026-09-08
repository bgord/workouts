import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { CircleCheck } from "lucide-react";
import type { ActionState } from "../../modules/action-state";
import type { Workout, WorkoutExerciseWithSets } from "../../modules/workouts/value-objects/workout";
import { ActionHint } from "../components";
import { workoutRoute } from "../router";

const GRAMS_IN_KILOGRAM = 1000;

export function WorkoutExerciseTargetSet(props: {
  workout: Workout;
  exercise: WorkoutExerciseWithSets;
  action: ActionState;
}) {
  const t = bg.useTranslations();
  const router = useRouter();

  const sets = bg.useNumberField({
    name: `sets-${props.exercise.id}`,
    defaultValue: props.exercise.target?.sets ?? props.exercise.prescription.sets,
  });

  const reps = bg.useNumberField({
    name: `reps-${props.exercise.id}`,
    defaultValue: props.exercise.target?.reps ?? props.exercise.prescription.reps.min,
  });

  const load = bg.useNumberField({
    name: `load-${props.exercise.id}`,
    defaultValue: props.exercise.target
      ? props.exercise.target.load / GRAMS_IN_KILOGRAM
      : bg.NumberField.EMPTY,
  });

  const mutation = bg.useMutation({
    perform: () =>
      fetch(`/api/workouts/${props.workout.id}/exercise/${props.exercise.id}/target`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json", ...bg.WeakETag.fromRevision(props.workout.revision) },
        body: JSON.stringify({
          sets: sets.value,
          reps: reps.value,
          load: Math.round((load.value ?? 0) * GRAMS_IN_KILOGRAM),
        }),
      }),
    onSuccess: () => router.invalidate({ filter: (route) => route.id === workoutRoute.id, sync: true }),
    autoResetDelayMs: 3000,
  });

  const incomplete = sets.empty || reps.empty || load.empty;

  return (
    <form
      aria-busy={mutation.isLoading}
      data-cross="end"
      data-gap="2"
      data-grow="1"
      data-stack="x"
      onSubmit={mutation.handleSubmit}
    >
      <div data-gap="1" data-stack="y">
        <label className="c-label" data-variant="inline" {...sets.label.props}>
          {t("workout.target.sets.label")}
        </label>

        <input
          className="c-input"
          min="1"
          type="number"
          {...sets.input.props}
          {...bg.Rhythm(64).times(1).style.width}
        />
      </div>

      <div data-gap="1" data-stack="y">
        <label className="c-label" data-variant="inline" {...reps.label.props}>
          {t("workout.target.reps.label")}
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
          {t("workout.target.load.label")}
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
        data-variant="secondary"
        disabled={!props.action.enabled || incomplete || mutation.isLoading}
        type="submit"
      >
        {t("workout.target.cta")}
      </button>

      <ActionHint action={props.action} />

      {mutation.isDone && (
        <output
          aria-live="polite"
          data-color="positive-400"
          data-cross="center"
          data-fs="sm"
          data-gap="2"
          data-mb="2"
          data-stack="x"
        >
          <CircleCheck data-size="sm" />
          {t("workout.target.saved")}
        </output>
      )}

      {mutation.isError && (
        <output data-color="danger-400" data-fs="sm" data-mb="2">
          {t("workout.target.error")}
        </output>
      )}
    </form>
  );
}
