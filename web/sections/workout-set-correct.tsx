import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Pencil, X } from "lucide-react";
import { useRef } from "react";
import { Form } from "../../app/services/workout-target-form";
import { ExerciseResistanceOptions } from "../../modules/exercises/value-objects/exercise-resistance-options";
import type { LoggedSet, WorkoutExercise } from "../../modules/workouts/queries/get-workout";
import * as ui from "../components";
import { ResistanceKit } from "../kits/resistance.kit";
import { workoutRoute } from "../router";
import { WeightFormat } from "../services/weight-format";

export function WorkoutSetCorrect(
  props: { exercise: WorkoutExercise; loggedSet: LoggedSet } & bg.UseToggleReturnType,
) {
  const t = bg.useTranslations();
  const router = useRouter();
  const { workout } = workoutRoute.useLoaderData();
  const { toggle } = bg.extractUseToggle(props);
  const action = props.loggedSet.actions.correct;
  const Resistance = ResistanceKit[props.exercise.resistance];
  const bodyweight = props.exercise.resistance === ExerciseResistanceOptions.bodyweight;

  const reps = bg.useNumberField<number>({
    name: `corrected-reps-${props.loggedSet.id}`,
    defaultValue: props.loggedSet.reps,
  });

  const load = bg.useNumberField<number>({
    name: `corrected-load-${props.loggedSet.id}`,
    defaultValue: WeightFormat.kilograms(props.loggedSet.load),
  });

  const rir = useRef<number | undefined>(props.loggedSet.rir ?? undefined);

  const mutation = bg.useMutation({
    perform: () =>
      fetch(`/api/workouts/${workout.data.id}/exercise/${props.exercise.id}/set/${props.loggedSet.id}`, {
        method: "PATCH",
        credentials: "include",
        headers: bg.WeakETag.fromRevision(workout.data.revision),
        body: JSON.stringify({
          reps: reps.value,
          load: Resistance.payload(load),
          rir: rir.current,
        }),
      }),
    onSuccess: async () => {
      toggle.disable();
      await router.invalidate({ filter: (match) => match.routeId === workoutRoute.id, sync: true });
    },
  });

  /* v8 ignore next */
  if (!action.available) return null;

  if (toggle.off) {
    return (
      <div data-stack="x" {...ui.Gap.related}>
        <ui.IconButton
          aria-label={t("workout.set.correct.title", { setNumber: props.loggedSet.setNumber })}
          disabled={!action.enabled}
          onClick={toggle.enable}
          title={t("workout.set.correct.title", { setNumber: props.loggedSet.setNumber })}
          {...ui.describedByHint(action, `workout-set-correct-hint-${props.loggedSet.id}`)}
          {...toggle.props.controller}
        >
          <Pencil data-size="sm" />
        </ui.IconButton>

        <ui.ActionHint {...action} id={`workout-set-correct-hint-${props.loggedSet.id}`} />
      </div>
    );
  }

  const cancel = bg.exec([reps.clear, load.clear, mutation.reset, toggle.disable]);

  return (
    <form
      aria-busy={mutation.isLoading}
      aria-label={t("workout.set.correct.title", { setNumber: props.loggedSet.setNumber })}
      data-grow="1"
      data-md-main="end"
      data-md-wrap="wrap"
      data-stack="x"
      onSubmit={mutation.handleSubmit}
      {...ui.Gap.cluster}
      {...toggle.props.target}
    >
      <div
        data-md-grow={bodyweight ? "1" : undefined}
        data-md-width={bodyweight ? undefined : "100%"}
        data-stack="x"
        {...ui.Gap.cluster}
      >
        <ui.Stepper
          aria-label={t("workout.set.reps.label")}
          disabled={mutation.isLoading}
          field={reps}
          width={40}
          {...Form.reps.pattern}
        />

        <Resistance.Field
          aria-label={t("workout.set.load.label")}
          disabled={mutation.isLoading}
          field={load}
          separator={<ui.Separator>×</ui.Separator>}
        />
      </div>

      <ui.RirSubmit
        disabled={reps.empty || !Resistance.ready(load) || mutation.isLoading}
        onSelect={(value) => {
          rir.current = value;
        }}
        value={props.loggedSet.rir ?? undefined}
        variant="dense"
      />

      <ui.IconButton aria-label={t("app.cancel")} onClick={cancel} title={t("app.cancel")}>
        <X data-size="sm" />
      </ui.IconButton>

      {mutation.isError && (
        <output aria-live="assertive" data-tone="danger" data-width="100%">
          {t("workout.set.correct.error")}
        </output>
      )}
    </form>
  );
}
