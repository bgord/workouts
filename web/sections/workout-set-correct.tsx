import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Pencil, X } from "lucide-react";
import { useRef } from "react";
import type { ActionState } from "../../modules/action-state";
import type { LoggedSetType } from "../../modules/workouts/value-objects/logged-set";
import type { Workout, WorkoutExerciseWithSets } from "../../modules/workouts/value-objects/workout";
import { ActionHint, IconButton, Output, RirSubmit, Stepper } from "../components";
import { workoutRoute } from "../router";
import { WeightFormat } from "../services/weight-format";

export function WorkoutSetCorrect(
  props: {
    workout: Workout;
    exercise: WorkoutExerciseWithSets;
    loggedSet: LoggedSetType;
    action: ActionState;
  } & bg.UseToggleReturnType,
) {
  const t = bg.useTranslations();
  const router = useRouter();
  const { toggle } = bg.extractUseToggle(props);

  const reps = bg.useNumberField<number>({
    name: `corrected-reps-${props.loggedSet.id}`,
    defaultValue: props.loggedSet.reps,
  });

  const load = bg.useNumberField<number>({
    name: `corrected-load-${props.loggedSet.id}`,
    defaultValue: WeightFormat.kilograms(props.loggedSet.load),
  });

  const rir = useRef<number | undefined>(props.loggedSet.rir);

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
          rir: rir.current,
        }),
      }),
    onSuccess: async () => {
      toggle.disable();
      await router.invalidate({ filter: (route) => route.id === workoutRoute.id, sync: true });
    },
  });

  if (toggle.off) {
    return (
      <div data-cross="center" data-gap="3" data-stack="x" data-wrap="nowrap">
        <IconButton
          disabled={!props.action.enabled}
          onClick={toggle.enable}
          title={t("workout.set.correct.title", { setNumber: props.loggedSet.setNumber })}
          {...toggle.props.controller}
        >
          <Pencil data-size="sm" />
        </IconButton>

        <ActionHint {...props.action} />
      </div>
    );
  }

  const cancel = bg.exec([reps.clear, load.clear, mutation.reset, toggle.disable]);

  return (
    <form
      aria-busy={mutation.isLoading}
      data-cross="center"
      data-gap="2"
      data-grow="1"
      data-md-gap="1"
      data-stack="x"
      onSubmit={mutation.handleSubmit}
      {...toggle.props.target}
    >
      <Stepper
        disabled={mutation.isLoading}
        field={reps}
        label={t("workout.set.reps.label")}
        max={100}
        min={1}
        step={1}
        width={40}
      />

      <span data-color="neutral-500" data-fs="sm" data-md-disp="none">
        ×
      </span>

      <Stepper
        disabled={mutation.isLoading}
        field={load}
        label={t("workout.set.load.label")}
        max={1000}
        min={0}
        step={0.5}
        unit="kg"
        width={52}
      />

      <RirSubmit
        disabled={reps.empty || load.empty || mutation.isLoading}
        onSelect={(value) => {
          rir.current = value;
        }}
        value={props.loggedSet.rir}
        variant="dense"
      />

      <IconButton aria-label={t("app.cancel")} onClick={cancel} title={t("app.cancel")}>
        <X data-size="sm" />
      </IconButton>

      {mutation.isError && <Output data-width="100%">{t("workout.set.correct.error")}</Output>}
    </form>
  );
}
