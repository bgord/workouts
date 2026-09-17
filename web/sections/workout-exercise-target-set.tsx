import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Check, X } from "lucide-react";
import type { ActionState } from "../../modules/action-state";
import type { Workout, WorkoutExerciseWithSets } from "../../modules/workouts/value-objects/workout";
import { ActionHint, IconButton, Output, Stepper } from "../components";
import { workoutRoute } from "../router";
import { WeightFormat } from "../services/weight-format";

export function WorkoutExerciseTargetSet(
  props: {
    workout: Workout;
    exercise: WorkoutExerciseWithSets;
    action: ActionState;
  } & bg.UseToggleReturnType,
) {
  const t = bg.useTranslations();
  const router = useRouter();
  const { toggle } = bg.extractUseToggle(props);

  const sets = bg.useNumberField<number>({
    name: `sets-${props.exercise.id}`,
    defaultValue: props.exercise.target?.sets ?? props.exercise.prescription.sets,
  });

  const reps = bg.useNumberField<number>({
    name: `reps-${props.exercise.id}`,
    defaultValue: props.exercise.target?.reps ?? props.exercise.prescription.reps.min,
  });

  const load = bg.useNumberField<number>({
    name: `load-${props.exercise.id}`,
    defaultValue: props.exercise.target
      ? WeightFormat.kilograms(props.exercise.target.load)
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
          load: WeightFormat.grams(load.value ?? 0),
        }),
      }),
    onSuccess: async () => {
      toggle.disable();
      await router.invalidate({ filter: (route) => route.id === workoutRoute.id, sync: true });
    },
  });

  const cancel = bg.exec([sets.clear, reps.clear, load.clear, mutation.reset, toggle.disable]);
  const unchanged = props.exercise.target && sets.unchanged && reps.unchanged && load.unchanged;

  return (
    <form
      aria-busy={mutation.isLoading}
      data-cross="center"
      data-gap="2-5"
      data-md-gap="2"
      data-stack="x"
      onSubmit={mutation.handleSubmit}
      {...toggle.props.target}
    >
      <div data-cross="center" data-gap="2" data-md-gap="1" data-stack="x" data-wrap="nowrap">
        <Stepper
          disabled={mutation.isLoading}
          field={sets}
          label={t("workout.target.sets.label")}
          max={20}
          min={1}
          step={1}
          variant="compact"
          width={40}
        />

        <span data-color="neutral-500" data-fs="sm">
          ×
        </span>

        <Stepper
          disabled={mutation.isLoading}
          field={reps}
          label={t("workout.target.reps.label")}
          max={100}
          min={1}
          step={1}
          variant="compact"
          width={40}
        />

        <span data-color="neutral-500" data-fs="sm">
          @
        </span>

        <Stepper
          disabled={mutation.isLoading}
          field={load}
          label={t("workout.target.load.label")}
          max={1000}
          min={0}
          step={0.5}
          unit="kg"
          variant="compact"
          width={52}
        />
      </div>

      <div data-cross="center" data-gap="1" data-ml="auto" data-shrink="0" data-stack="x" data-wrap="nowrap">
        <IconButton
          aria-label={t("app.save")}
          disabled={
            !props.action.enabled || sets.empty || reps.empty || load.empty || unchanged || mutation.isLoading
          }
          title={t("app.save")}
          tone="positive"
          type="submit"
        >
          <Check data-size="sm" />
        </IconButton>

        <IconButton aria-label={t("app.cancel")} onClick={cancel} title={t("app.cancel")}>
          <X data-size="sm" />
        </IconButton>
      </div>

      <ActionHint {...props.action} />

      {mutation.isError && <Output data-width="100%">{t("workout.target.error")}</Output>}
    </form>
  );
}
