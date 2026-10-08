import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { startTransition, useRef } from "react";
import { Form } from "../../app/services/workout-target-form";
import type { LoggedSet, WorkoutExercise } from "../../modules/workouts/queries/get-workout";
import * as ui from "../components";
import { ResistanceKit } from "../kits/resistance.kit";
import { workoutRoute } from "../router";
import { WeightFormat } from "../services/weight-format";

export function WorkoutSetLog(props: {
  exercise: WorkoutExercise;
  onPending: (set: LoggedSet) => void;
  correcting: boolean;
}) {
  const t = bg.useTranslations();
  const router = useRouter();
  const { workout } = workoutRoute.useLoaderData();
  const action = props.exercise.actions.setLog;
  const Resistance = ResistanceKit[props.exercise.resistance];

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
          load: Resistance.payload(load),
          rir: rir.current,
        }),
      }),
    onSuccess: () => router.invalidate({ filter: (match) => match.routeId === workoutRoute.id, sync: true }),
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const request = mutation.mutate(event.currentTarget);

    startTransition(async () => {
      props.onPending({
        id: crypto.randomUUID() as LoggedSet["id"],
        setNumber: (props.exercise.loggedSets.length + 1) as LoggedSet["setNumber"],
        reps: reps.value as LoggedSet["reps"],
        load: Resistance.payload(load) as LoggedSet["load"],
        rir: (rir.current ?? null) as LoggedSet["rir"],
        rirBelowTarget: false,
        actions: {
          correct: { available: true, enabled: false, hints: [] },
          remove: { available: true, enabled: false, hints: [] },
        },
      });
      await request;
    });
  };

  if (!action.available) return null;

  const busy = !action.enabled || props.correcting || mutation.isLoading;

  return (
    <form
      aria-busy={mutation.isLoading}
      aria-label={t("workout.set.cta")}
      data-opacity={props.correcting ? "medium" : undefined}
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
          aria-label={t("workout.set.reps.label")}
          disabled={busy}
          field={reps}
          width={40}
          {...Form.reps.pattern}
        />

        <Resistance.Field
          aria-label={t("workout.set.load.label")}
          disabled={busy}
          field={load}
          separator={<ui.Separator data-md-disp="none">×</ui.Separator>}
        />
      </div>

      <ui.RirSubmit
        disabled={busy || reps.empty || !Resistance.ready(load)}
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
