import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { Form } from "../../app/services/workout-exercise-add-form";
import type { ActionState } from "../../modules/action-state";
import type { Workout } from "../../modules/workouts/value-objects/workout";
import { ActionHint, ButtonCancel } from "../components";
import { workoutRoute } from "../router";

export function WorkoutExerciseAdd(props: Workout & { action: ActionState }) {
  const t = bg.useTranslations();
  const router = useRouter();
  const { exercises } = workoutRoute.useLoaderData();
  const add = bg.useToggle({ name: `workout-exercise-add-${props.id}` });

  const exerciseName = bg.useTextField(Form.exerciseName.field);
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
          exerciseId: exercises.data.find((exercise) => exercise.name === exerciseName.value)?.id,
          sets: sets.value,
          reps: { min: repsMin.value, max: repsMax.value },
        }),
      }),
    onSuccess: async (_, context) => {
      add.disable();

      await router.invalidate({ filter: (route) => route.id === workoutRoute.id, sync: true });

      bg.Fields.clearAll([exerciseName, sets, repsMin, repsMax]);
      context.form?.reset();
    },
  });

  if (add.off) {
    return (
      <div data-cross="center" data-gap="3" data-stack="x">
        <ActionHint action={props.action} />

        <button
          className="c-button"
          data-variant="secondary"
          disabled={!props.action.enabled}
          onClick={add.enable}
          type="button"
          {...add.props.controller}
        >
          <Plus data-size="sm" />
          {t("workout.exercise.add.cta")}
        </button>
      </div>
    );
  }

  return (
    <form
      className="c-card"
      data-gap="2"
      data-md-p="2-5"
      data-p="4"
      data-stack="y"
      data-width="100%"
      onSubmit={mutation.handleSubmit}
      {...add.props.target}
    >
      <div data-cross="end" data-gap="3" data-stack="x">
        <div data-cross="start" data-gap="1" data-grow="1" data-md-width="100%" data-stack="y">
          <label className="c-label" {...exerciseName.label.props}>
            {t("workout.exercise.add.exercise.label")}
          </label>

          <input className="c-input" list="exercises" {...exerciseName.input.props} data-width="100%" />
          <datalist id="exercises">
            {exercises.data.map((exercise) => (
              <option value={exercise.name}>{exercise.name}</option>
            ))}
          </datalist>
        </div>

        <div data-cross="start" data-gap="1" data-stack="y">
          <label className="c-label" {...sets.label.props}>
            {t("workout.exercise.add.sets.label")}
          </label>

          <input
            className="c-input"
            type="number"
            {...Form.sets.pattern}
            {...sets.input.props}
            {...bg.Rhythm().times(5).style.width}
          />
        </div>

        <div data-cross="start" data-gap="1" data-stack="y">
          <label className="c-label" {...repsMin.label.props}>
            {t("workout.exercise.add.reps.label")}
          </label>

          <div data-cross="center" data-gap="2" data-stack="x">
            <input
              className="c-input"
              type="number"
              {...Form.repsMin.pattern}
              {...repsMin.input.props}
              {...bg.Rhythm().times(5).style.width}
            />

            <div data-color="neutral-400">-</div>

            <input
              aria-label={t("workout.exercise.add.reps.max.label")}
              className="c-input"
              type="number"
              {...Form.repsMax.pattern}
              min={repsMin.value}
              {...repsMax.input.props}
              {...bg.Rhythm().times(5).style.width}
            />
          </div>
        </div>

        <div data-cross="center" data-gap="1" data-md-width="100%" data-stack="x">
          <button
            className="c-button"
            data-md-grow="1"
            data-variant="secondary"
            disabled={
              exerciseName.empty || sets.empty || repsMin.empty || repsMax.empty || mutation.isLoading
            }
            type="submit"
          >
            {t("app.save")}
          </button>

          <ButtonCancel
            data-md-grow="1"
            onClick={bg.exec([
              exerciseName.clear,
              sets.clear,
              repsMin.clear,
              repsMax.clear,
              mutation.reset,
              add.disable,
            ])}
          />
        </div>
      </div>

      {mutation.isError && (
        <output data-color="danger-400" data-fs="sm">
          {t("workout.exercise.add.error")}
        </output>
      )}
    </form>
  );
}
