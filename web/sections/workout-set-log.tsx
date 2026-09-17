import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { useRef } from "react";
import type { ActionState } from "../../modules/action-state";
import type { Workout, WorkoutExerciseWithSets } from "../../modules/workouts/value-objects/workout";
import { ActionHint, RirSubmit, Stepper } from "../components";
import { workoutRoute } from "../router";
import { WeightFormat } from "../services/weight-format";

export function WorkoutSetLog(props: {
  workout: Workout;
  exercise: WorkoutExerciseWithSets;
  action: ActionState;
}) {
  const t = bg.useTranslations();
  const router = useRouter();

  const reps = bg.useNumberField<number>({
    name: `logged-reps-${props.exercise.id}`,
    defaultValue: props.exercise.target?.reps,
  });

  const load = bg.useNumberField<number>({
    name: `logged-load-${props.exercise.id}`,
    defaultValue: props.exercise.target
      ? WeightFormat.kilograms(props.exercise.target.load)
      : bg.NumberField.EMPTY,
  });

  const rir = useRef<number | undefined>(undefined);

  const mutation = bg.useMutation({
    perform: () =>
      fetch(`/api/workouts/${props.workout.id}/exercise/${props.exercise.id}/set`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json", ...bg.WeakETag.fromRevision(props.workout.revision) },
        body: JSON.stringify({
          reps: reps.value,
          load: WeightFormat.grams(load.value ?? 0),
          rir: rir.current,
        }),
      }),
    onSuccess: () => router.invalidate({ filter: (route) => route.id === workoutRoute.id, sync: true }),
  });

  const busy = !props.action.enabled || mutation.isLoading;

  return (
    <form
      aria-busy={mutation.isLoading}
      data-cross="center"
      data-gap="2-5"
      data-md-gap="1"
      data-mt="1"
      data-pt="2"
      data-stack="x"
      onSubmit={mutation.handleSubmit}
    >
      <div
        aria-hidden
        data-color="neutral-600"
        data-fs="xs"
        data-md-disp="none"
        data-transform="font-variant-numeric"
      >
        {props.exercise.loggedSets.length + 1}
      </div>

      <div
        data-cross="center"
        data-gap="2"
        data-md-gap="1"
        data-md-grow="1"
        data-stack="x"
        data-wrap="nowrap"
      >
        <Stepper
          disabled={busy}
          field={reps}
          label={t("workout.set.reps.label")}
          max={100}
          min={1}
          step={1}
          width={40}
        />

        <span data-color="neutral-500" data-fs="sm">
          ×
        </span>

        <Stepper
          disabled={busy}
          field={load}
          label={t("workout.set.load.label")}
          max={1000}
          min={0}
          step={0.5}
          unit="kg"
          width={52}
        />
      </div>

      <RirSubmit
        disabled={busy || reps.empty || load.empty}
        onSelect={(value) => {
          rir.current = value;
        }}
        variant="dense"
      />

      <ActionHint {...props.action} />

      {mutation.isError && (
        <output data-color="danger-400" data-fs="sm">
          {t("workout.set.error")}
        </output>
      )}
    </form>
  );
}
