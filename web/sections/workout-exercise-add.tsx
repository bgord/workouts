import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Form } from "../../app/services/workout-exercise-add-form";
import type { Workout } from "../../modules/workouts/value-objects/workout";
import { ButtonCancel, Select } from "../components";
import { workoutRoute } from "../router";

export function WorkoutExerciseAdd(props: { workout: Workout }) {
  const t = bg.useTranslations();
  const router = useRouter();
  const { exercises } = workoutRoute.useLoaderData();
  const add = bg.useToggle({ name: `workout-exercise-add-${props.workout.id}` });

  const exerciseId = bg.useTextField({ ...Form.exerciseId.field, defaultValue: exercises[0]?.id ?? "" });
  const sets = bg.useNumberField(Form.sets.field);
  const repsMin = bg.useNumberField(Form.repsMin.field);
  const repsMax = bg.useNumberField(Form.repsMax.field);

  const fields = [exerciseId, sets, repsMin, repsMax];

  const mutation = bg.useMutation({
    perform: () =>
      fetch(`/api/workouts/${props.workout.id}/exercise`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json", ...bg.WeakETag.fromRevision(props.workout.revision) },
        body: JSON.stringify({
          exerciseId: exerciseId.value,
          sets: sets.value,
          reps: { min: repsMin.value, max: repsMax.value },
        }),
      }),
    onSuccess: async (_, context) => {
      add.disable();

      await router.invalidate({ filter: (route) => route.id === workoutRoute.id, sync: true });

      bg.Fields.clearAll(fields);
      context.form?.reset();
    },
  });

  if (add.off) {
    return (
      <button
        className="c-button"
        data-mr="auto"
        data-variant="bare"
        onClick={add.enable}
        type="button"
        {...add.props.controller}
      >
        {t("workout.exercise.add.cta")}
      </button>
    );
  }

  return (
    <form data-gap="2" data-stack="y" onSubmit={mutation.handleSubmit} {...add.props.target}>
      <div data-cross="end" data-gap="3" data-stack="x">
        <div data-cross="start" data-gap="1" data-stack="y">
          <label className="c-label" {...exerciseId.label.props}>
            {t("workout.exercise.add.exercise.label")}
          </label>

          <Select {...exerciseId.input.props}>
            {exercises.map((exercise) => (
              <option key={exercise.id} value={exercise.id}>
                {exercise.name}
              </option>
            ))}
          </Select>
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

            <div data-color="neutral-500">-</div>

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

        <button className="c-button" data-variant="secondary" disabled={mutation.isLoading} type="submit">
          {t("app.save")}
        </button>

        <ButtonCancel onClick={bg.exec([mutation.reset, add.disable])} />
      </div>

      {mutation.isError && (
        <output data-color="danger-400" data-fs="sm">
          {t("workout.exercise.add.error")}
        </output>
      )}
    </form>
  );
}
