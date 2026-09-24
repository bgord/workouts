import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { useRef } from "react";
import { Form } from "../../app/services/workout-target-form";
import type { WorkoutExercise } from "../../modules/workouts/queries/get-workout";
import * as ui from "../components";
import { workoutRoute } from "../router";
import { WeightFormat } from "../services/weight-format";

export function WorkoutSetLog(props: WorkoutExercise) {
  const t = bg.useTranslations();
  const router = useRouter();
  const { workout } = workoutRoute.useLoaderData();
  const action = props.actions.setLog;

  const reps = bg.useNumberField<number>({
    name: `logged-reps-${props.id}`,
    defaultValue: props.target?.reps,
  });

  const load = bg.useNumberField<number>({
    name: `logged-load-${props.id}`,
    defaultValue: props.target ? WeightFormat.kilograms(props.target.load) : bg.NumberField.EMPTY,
  });

  const rir = useRef<number | undefined>(undefined);

  const mutation = bg.useMutation({
    perform: () =>
      fetch(`/api/workouts/${workout.data.id}/exercise/${props.id}/set`, {
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

  if (!action.available) return null;

  const busy = !action.enabled || mutation.isLoading;

  return (
    <form
      aria-busy={mutation.isLoading}
      data-stack="x"
      data-wrap="wrap"
      onSubmit={mutation.handleSubmit}
      {...ui.Spacing.rowCompact}
    >
      <ui.RowIndex aria-hidden data-md-disp="none">
        {props.loggedSets.length + 1}
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

      {mutation.isError && <ui.Output>{t("workout.set.error")}</ui.Output>}
    </form>
  );
}
