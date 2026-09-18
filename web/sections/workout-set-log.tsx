import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { useRef } from "react";
import { Form } from "../../app/services/workout-target-form";
import type { WorkoutExercise } from "../../modules/workouts/queries/get-workout";
import * as ui from "../components";
import { workoutRoute } from "../router";
import { WeightFormat } from "../services/weight-format";

export function WorkoutSetLog(props: { exercise: WorkoutExercise }) {
  const t = bg.useTranslations();
  const router = useRouter();
  const { workout } = workoutRoute.useLoaderData();
  const action = props.exercise.actions.setLog;

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
      fetch(`/api/workouts/${workout.data.id}/exercise/${props.exercise.id}/set`, {
        method: "POST",
        credentials: "include",
        headers: bg.WeakETag.fromRevision(workout.data.revision),
        body: JSON.stringify({
          reps: reps.value,
          load: WeightFormat.grams(load.value ?? 0),
          rir: rir.current,
        }),
      }),
    onSuccess: () => router.invalidate({ filter: (route) => route.id === workoutRoute.id, sync: true }),
  });

  if (!action.available) return null;

  const busy = !action.enabled || mutation.isLoading;

  return (
    <form
      aria-busy={mutation.isLoading}
      data-cross="center"
      data-stack="x"
      onSubmit={mutation.handleSubmit}
      {...ui.Spacing.rowCompact}
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

      <div data-cross="center" data-md-grow="1" data-stack="x" data-wrap="nowrap" {...ui.Gap.cluster}>
        <ui.Stepper
          disabled={busy}
          field={reps}
          label={t("workout.set.reps.label")}
          width={40}
          {...Form.reps.pattern}
        />

        <ui.Separator>×</ui.Separator>

        <ui.Stepper
          disabled={busy}
          field={load}
          label={t("workout.set.load.label")}
          unit="kg"
          width={52}
          {...Form.load.pattern}
        />
      </div>

      <ui.RirSubmit
        disabled={busy || reps.empty || load.empty}
        onSelect={(value) => {
          rir.current = value;
        }}
        variant="dense"
      />

      <ui.ActionHint {...action} />

      {mutation.isError && <ui.Output>{t("workout.set.error")}</ui.Output>}
    </form>
  );
}
