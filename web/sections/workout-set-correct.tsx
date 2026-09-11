import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Check, Pencil, X } from "lucide-react";
import type { ActionState } from "../../modules/action-state";
import type { LoggedSetType } from "../../modules/workouts/value-objects/logged-set";
import { RirMax } from "../../modules/workouts/value-objects/rir-limit";
import type { Workout, WorkoutExerciseWithSets } from "../../modules/workouts/value-objects/workout";
import { ActionHint } from "../components";
import { workoutRoute } from "../router";
import { WeightFormat } from "../services/weight-format";

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

  const reps = bg.useNumberField({
    name: `corrected-reps-${props.loggedSet.id}`,
    defaultValue: props.loggedSet.reps,
  });

  const load = bg.useNumberField({
    name: `corrected-load-${props.loggedSet.id}`,
    defaultValue: WeightFormat.kilograms(props.loggedSet.load),
  });

  const rir = bg.useNumberField({
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
          data-variant="ghost"
          disabled={!props.action.enabled}
          onClick={edit.enable}
          title={t("workout.set.correct.title", { setNumber: props.loggedSet.setNumber })}
          type="button"
          {...edit.props.controller}
        >
          <Pencil data-size="sm" />
        </button>

        <ActionHint action={props.action} />
      </div>
    );
  }

  return (
    <form
      data-cross="center"
      data-gap="2"
      data-grow="1"
      data-stack="x"
      data-wrap="nowrap"
      onSubmit={mutation.handleSubmit}
      {...edit.props.target}
    >
      <input
        aria-label={t("workout.set.reps.label")}
        className="c-input"
        data-px="2"
        min="1"
        type="number"
        {...reps.input.props}
        {...bg.Rhythm(48).times(1).style.width}
      />

      <input
        aria-label={t("workout.set.load.label")}
        className="c-input"
        data-px="2"
        min="0"
        step="0.5"
        type="number"
        {...load.input.props}
        {...bg.Rhythm(64).times(1).style.width}
      />

      <input
        aria-label={t("workout.set.rir.label")}
        className="c-input"
        data-px="2"
        max={RirMax}
        min="0"
        placeholder={t("workout.set.rir.label")}
        type="number"
        {...rir.input.props}
        {...bg.Rhythm(56).times(1).style.width}
      />

      <button
        aria-label={t("app.save")}
        className="c-button"
        data-ml="auto"
        data-px="2"
        data-variant="secondary"
        disabled={reps.empty || load.empty || mutation.isLoading}
        title={t("app.save")}
        type="submit"
      >
        <Check data-size="sm" />
      </button>

      <button
        aria-label={t("app.cancel")}
        className="c-button"
        data-px="2"
        data-variant="ghost"
        onClick={edit.disable}
        title={t("app.cancel")}
        type="button"
      >
        <X data-size="sm" />
      </button>

      {mutation.isError && (
        <output data-color="danger-400" data-fs="sm">
          {t("workout.set.correct.error")}
        </output>
      )}
    </form>
  );
}
