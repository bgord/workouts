import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Check, Pencil, X } from "lucide-react";
import type { ActionState } from "../../modules/action-state";
import type { LoggedSetType } from "../../modules/workouts/value-objects/logged-set";
import type { Workout, WorkoutExerciseWithSets } from "../../modules/workouts/value-objects/workout";
import { ActionHint, RirSegments } from "../components";
import { workoutRoute } from "../router";
import { WeightFormat } from "../services/weight-format";

const number = { ...bg.Rhythm(40).times(1).width, paddingInline: 0, textAlign: "center" as const };
const weight = { ...bg.Rhythm(48).times(1).width, paddingInline: 0, textAlign: "center" as const };

export function WorkoutSetCorrect(props: {
  workout: Workout;
  exercise: WorkoutExerciseWithSets;
  loggedSet: LoggedSetType;
  action: ActionState;
  toggle: bg.UseToggleReturnType;
}) {
  const t = bg.useTranslations();
  const router = useRouter();
  const edit = props.toggle;

  const reps = bg.useNumberField<number>({
    name: `corrected-reps-${props.loggedSet.id}`,
    defaultValue: props.loggedSet.reps,
  });

  const load = bg.useNumberField<number>({
    name: `corrected-load-${props.loggedSet.id}`,
    defaultValue: WeightFormat.kilograms(props.loggedSet.load),
  });

  const rir = bg.useNumberField<number>({
    name: `corrected-rir-${props.loggedSet.id}`,
    defaultValue: props.loggedSet.rir,
  });

  const mutation = bg.useMutation({
    perform: () =>
      fetch(`/api/workouts/${props.workout.id}/exercise/${props.exercise.id}/set/${props.loggedSet.id}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...bg.WeakETag.fromRevision(props.workout.revision),
        },
        body: JSON.stringify({
          reps: reps.value,
          load: WeightFormat.grams(load.value ?? 0),
          rir: rir.value,
        }),
      }),
    onSuccess: async () => {
      edit.disable();
      await router.invalidate({ filter: (route) => route.id === workoutRoute.id, sync: true });
    },
  });

  if (edit.off) {
    return (
      <div data-cross="center" data-gap="3" data-stack="x" data-wrap="nowrap">
        <button
          className="c-button"
          data-color="neutral-400"
          data-hover-color="neutral-0"
          data-px="0"
          data-shrink="0"
          data-variant="ghost"
          disabled={!props.action.enabled}
          onClick={edit.enable}
          title={t("workout.set.correct.title", { setNumber: props.loggedSet.setNumber })}
          type="button"
          {...bg.Rhythm().times(3).style.width}
          {...edit.props.controller}
        >
          <Pencil data-size="sm" />
        </button>

        <ActionHint action={props.action} />
      </div>
    );
  }

  const cancel = bg.exec([reps.clear, load.clear, rir.clear, mutation.reset, edit.disable]);

  return (
    <form
      aria-busy={mutation.isLoading}
      data-cross="center"
      data-gap="1-5"
      data-grow="1"
      data-stack="x"
      onSubmit={mutation.handleSubmit}
      {...edit.props.target}
    >
      <input
        aria-label={t("workout.set.reps.label")}
        className="c-input"
        data-fw="medium"
        data-spin="none"
        data-transform="font-variant-numeric"
        data-variant="transparent"
        min="1"
        type="number"
        {...reps.input.props}
        style={number}
      />

      <span data-color="neutral-500" data-fs="sm">
        ×
      </span>

      <input
        aria-label={t("workout.set.load.label")}
        className="c-input"
        data-fw="medium"
        data-spin="none"
        data-transform="font-variant-numeric"
        data-variant="transparent"
        min="0"
        step="0.5"
        type="number"
        {...load.input.props}
        style={weight}
      />

      <span data-color="neutral-500" data-fs="sm" data-md-disp="none">
        kg
      </span>

      <RirSegments disabled={mutation.isLoading} field={rir} />

      <div data-cross="center" data-gap="1" data-ml="auto" data-shrink="0" data-stack="x" data-wrap="nowrap">
        <button
          aria-label={t("app.save")}
          className="c-button"
          data-color="positive-400"
          data-hover-color="positive-200"
          data-px="0"
          data-variant="ghost"
          disabled={
            reps.empty ||
            load.empty ||
            (reps.unchanged && load.unchanged && rir.unchanged) ||
            mutation.isLoading
          }
          title={t("app.save")}
          type="submit"
          {...bg.Rhythm().times(3).style.width}
        >
          <Check data-size="sm" />
        </button>

        <button
          aria-label={t("app.cancel")}
          className="c-button"
          data-color="neutral-400"
          data-hover-color="neutral-0"
          data-px="0"
          data-variant="ghost"
          onClick={cancel}
          title={t("app.cancel")}
          type="button"
          {...bg.Rhythm().times(3).style.width}
        >
          <X data-size="sm" />
        </button>
      </div>

      {mutation.isError && (
        <output data-color="danger-400" data-fs="xs" data-width="100%">
          {t("workout.set.correct.error")}
        </output>
      )}
    </form>
  );
}
