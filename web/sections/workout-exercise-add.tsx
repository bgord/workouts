import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { Form } from "../../app/services/workout-exercise-add-form";
import type { ActionState } from "../../modules/action-state";
import type { Workout } from "../../modules/workouts/value-objects/workout";
import * as ui from "../components";
import { workoutRoute } from "../router";

const placeholder = { ...bg.Rhythm().times(3).width, ...bg.Rhythm().times(3).height };
const shrinkable = { minHeight: 0 };

export function WorkoutExerciseAdd(props: Workout & { action: ActionState; first: boolean }) {
  const t = bg.useTranslations();
  const router = useRouter();
  const { exercises } = workoutRoute.useLoaderData();

  const workoutExerciseAdd = bg.useToggle({ name: `workout-exercise-add-${props.id}` });

  const exerciseId = bg.useTextField(Form.exerciseId.field);
  const query = bg.useTextField(Form.query.field);
  const sets = bg.useNumberField(Form.sets.field);
  const repsMin = bg.useNumberField(Form.repsMin.field);
  const repsMax = bg.useNumberField(Form.repsMax.field);

  const mutation = bg.useMutation({
    perform: () =>
      fetch(`/api/workouts/${props.id}/exercise`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json", ...bg.WeakETag.fromRevision(props.revision) },
        body: JSON.stringify({
          exerciseId: exerciseId.value,
          sets: sets.value,
          reps: { min: repsMin.value, max: repsMax.value },
        }),
      }),
    onSuccess: async (_, context) => {
      workoutExerciseAdd.disable();

      await router.invalidate({ filter: (route) => route.id === workoutRoute.id, sync: true });

      bg.Fields.clearAll([exerciseId, query, sets, repsMin, repsMax]);
      context.form?.reset();
    },
  });

  const clear = bg.exec([
    exerciseId.clear,
    query.clear,
    sets.clear,
    repsMin.clear,
    repsMax.clear,
    mutation.reset,
  ]);

  return (
    <>
      <ui.HairlineBlock
        data-cross="center"
        data-stack="x"
        data-wrap="nowrap"
        first={props.first}
        last
        {...ui.Spacing.row}
        {...ui.Spacing.related}
      >
        <button
          data-color="neutral-400"
          data-cross="center"
          data-cursor="pointer"
          data-fs="sm"
          data-fw="medium"
          data-grow="1"
          data-hover-color="neutral-0"
          data-stack="x"
          data-wrap="nowrap"
          disabled={!props.action.enabled}
          onClick={workoutExerciseAdd.enable}
          type="button"
          {...ui.Spacing.related}
          {...workoutExerciseAdd.props.controller}
        >
          <div
            data-bc="neutral-700"
            data-br="sm"
            data-bs="dashed"
            data-bw="hairline"
            data-color="neutral-500"
            data-cross="center"
            data-main="center"
            data-shrink="0"
            data-stack="x"
            style={placeholder}
          >
            <Plus data-size="sm" />
          </div>

          {t("workout.exercise.add.cta")}
        </button>

        <ui.ActionHint {...props.action} data-shrink="0" />
      </ui.HairlineBlock>

      <ui.Dialog {...workoutExerciseAdd}>
        <ui.DialogHeader disabled={mutation.isLoading} onClose={bg.exec([clear, workoutExerciseAdd.disable])}>
          {t("workout.exercise.add.cta")}
        </ui.DialogHeader>

        <form
          aria-busy={mutation.isLoading}
          data-stack="y"
          data-wrap="nowrap"
          onSubmit={mutation.handleSubmit}
          style={shrinkable}
          {...ui.Spacing.section}
        >
          <ui.ExercisePicker
            exercises={exercises.data}
            name={exerciseId.input.props.name}
            onChange={exerciseId.set}
            query={query}
            value={exerciseId.value}
          />

          <div data-cross="center" data-stack="x" data-wrap="nowrap" style={{ maxWidth: 336 }} {...ui.Spacing.cluster}>
            <ui.Stepper
              field={sets}
              label={t("workout.exercise.add.sets.label")}
              max={Form.sets.pattern.max}
              min={Form.sets.pattern.min}
              step={1}
              variant="fill"
            />

            <ui.Separator>×</ui.Separator>

            <ui.Stepper
              field={repsMin}
              label={t("workout.exercise.add.reps.label")}
              max={Form.repsMin.pattern.max}
              min={Form.repsMin.pattern.min}
              step={1}
              variant="fill"
            />

            <ui.Separator>–</ui.Separator>

            <ui.Stepper
              field={repsMax}
              label={t("workout.exercise.add.reps.max.label")}
              max={Form.repsMax.pattern.max}
              min={repsMin.value ?? Form.repsMax.pattern.min}
              step={1}
              variant="fill"
            />
          </div>

          {mutation.isError && <ui.DialogError>{t("workout.exercise.add.error")}</ui.DialogError>}

          <ui.DialogFooter
            disabled={mutation.isLoading}
            onCancel={bg.exec([clear, workoutExerciseAdd.disable])}
          >
            <ui.ButtonClear
              disabled={
                exerciseId.empty && query.empty && sets.unchanged && repsMin.unchanged && repsMax.unchanged
              }
              onClick={clear}
            />

            <button
              className="c-button"
              data-variant="primary"
              disabled={
                exerciseId.empty || sets.empty || repsMin.empty || repsMax.empty || mutation.isLoading
              }
              type="submit"
            >
              <Plus data-size="sm" />
              {t("workout.exercise.add.cta")}
            </button>
          </ui.DialogFooter>
        </form>
      </ui.Dialog>
    </>
  );
}
