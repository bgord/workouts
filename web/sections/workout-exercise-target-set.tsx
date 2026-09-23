import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Check, X } from "lucide-react";
import { Form } from "../../app/services/workout-target-form";
import type { WorkoutExercise } from "../../modules/workouts/queries/get-workout";
import * as ui from "../components";
import { workoutRoute } from "../router";
import { WeightFormat } from "../services/weight-format";
import { WorkoutExerciseTargetProgression } from "./workout-exercise-target-progression";

export function WorkoutExerciseTargetSet(props: { exercise: WorkoutExercise } & bg.UseToggleReturnType) {
  const t = bg.useTranslations();
  const router = useRouter();
  const { workout } = workoutRoute.useLoaderData();
  const { toggle } = bg.extractUseToggle(props);
  const action = props.exercise.actions.targetSet;
  const progression = props.exercise.targetProgression;

  const sets = bg.useNumberField<number>({
    name: `sets-${props.exercise.id}`,
    defaultValue: props.exercise.target?.sets ?? progression?.last.sets ?? props.exercise.prescription.sets,
  });

  const reps = bg.useNumberField<number>({
    name: `reps-${props.exercise.id}`,
    defaultValue:
      props.exercise.target?.reps ?? progression?.last.reps ?? props.exercise.prescription.reps.min,
  });

  const load = bg.useNumberField<number>({
    name: `load-${props.exercise.id}`,
    defaultValue: props.exercise.target
      ? WeightFormat.kilograms(props.exercise.target.load)
      : progression
        ? WeightFormat.kilograms(progression.last.load)
        : bg.NumberField.EMPTY,
  });

  const mutation = bg.useMutation({
    perform: () =>
      fetch(`/api/workouts/${workout.data.id}/exercise/${props.exercise.id}/target`, {
        method: "PATCH",
        credentials: "include",
        headers: bg.WeakETag.fromRevision(workout.data.revision),
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
  const unchanged = Boolean(props.exercise.target) && sets.unchanged && reps.unchanged && load.unchanged;

  if (!action.available || toggle.off) return null;

  return (
    <>
      <form
        aria-busy={mutation.isLoading}
        data-cross="center"
        data-md-ml="1"
        data-md-pl="8"
        data-pl="12"
        data-stack="x"
        data-wrap="wrap"
        onSubmit={mutation.handleSubmit}
        {...ui.Gap.related}
        {...toggle.props.target}
      >
        <div data-cross="center" data-stack="x" {...ui.Gap.cluster}>
          <ui.Stepper
            disabled={mutation.isLoading}
            field={sets}
            label={t("workout.target.sets.label")}
            variant="compact"
            width={40}
            {...Form.sets.pattern}
          />

          <ui.Separator>×</ui.Separator>

          <ui.Stepper
            disabled={mutation.isLoading}
            field={reps}
            label={t("workout.target.reps.label")}
            variant="compact"
            width={40}
            {...Form.reps.pattern}
          />

          <ui.Separator>@</ui.Separator>

          <ui.Stepper
            disabled={mutation.isLoading}
            field={load}
            label={t("workout.target.load.label")}
            unit="kg"
            variant="compact"
            width={52}
            {...Form.load.pattern}
          />
        </div>

        <div data-cross="center" data-ml="auto" data-shrink="0" data-stack="x" {...ui.Gap.inline}>
          <ui.IconButton
            aria-label={t("app.save")}
            disabled={
              !action.enabled || sets.empty || reps.empty || load.empty || unchanged || mutation.isLoading
            }
            title={t("app.save")}
            tone="positive"
            type="submit"
          >
            <Check data-size="sm" />
          </ui.IconButton>

          <ui.IconButton aria-label={t("app.cancel")} onClick={cancel} title={t("app.cancel")}>
            <X data-size="sm" />
          </ui.IconButton>
        </div>

        <ui.ActionHint {...action} />

        {mutation.isError && <ui.Output data-width="100%">{t("workout.target.error")}</ui.Output>}
      </form>

      {progression && (
        <WorkoutExerciseTargetProgression
          disabled={mutation.isLoading}
          load={load}
          method={props.exercise.prescription.progression}
          progression={progression}
          reps={reps}
          sets={sets}
        />
      )}
    </>
  );
}
