import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { startTransition, useRef } from "react";
import { Form } from "../../app/services/workout-target-form";
import type { LoggedSet, WorkoutExercise } from "../../modules/workouts/queries/get-workout";
import * as ui from "../components";
import { workoutRoute } from "../router";
import { WeightFormat } from "../services/weight-format";

export function WorkoutSetLog(props: { exercise: WorkoutExercise; onPending: (set: LoggedSet) => void }) {
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
    onSuccess: () => router.invalidate({ filter: (match) => match.routeId === workoutRoute.id, sync: true }),
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;

    startTransition(async () => {
      props.onPending({
        id: crypto.randomUUID() as LoggedSet["id"],
        setNumber: (props.exercise.loggedSets.length + 1) as LoggedSet["setNumber"],
        reps: reps.value as LoggedSet["reps"],
        load: WeightFormat.grams(load.value ?? 0) as LoggedSet["load"],
        rir: (rir.current ?? null) as LoggedSet["rir"],
        actions: {
          correct: { available: true, enabled: false, hints: [] },
          remove: { available: true, enabled: false, hints: [] },
        },
      });
      await mutation.mutate(form);
    });
  };

  if (!action.available) return null;

  const busy = !action.enabled || mutation.isLoading;

  return (
    <form
      aria-busy={mutation.isLoading}
      data-stack="x"
      data-wrap="wrap"
      onSubmit={handleSubmit}
      {...ui.Spacing.rowCompact}
    >
      <ui.RowIndex aria-hidden data-md-disp="none">
        {props.exercise.loggedSets.length + 1}
      </ui.RowIndex>

      <div data-md-grow="1" data-stack="x" {...ui.Gap.cluster}>
        <ui.Stepper
          disabled={busy}
          field={reps}
          label={t("workout.set.reps.label")}
          width={40}
          {...Form.reps.pattern}
        />

        <ui.Separator data-md-disp="none">×</ui.Separator>

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

      {mutation.isError && (
        <output aria-live="assertive" data-tone="danger">
          {t("workout.set.error")}
        </output>
      )}
    </form>
  );
}
