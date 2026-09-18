import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { Form } from "../../app/services/workout-exercise-add-form";
import * as ui from "../components";
import { workoutRoute } from "../router";

export function WorkoutExerciseAdd() {
  const t = bg.useTranslations();
  const router = useRouter();
  const { workout, exercises } = workoutRoute.useLoaderData();

  const workoutExerciseAdd = bg.useToggle({ name: `workout-exercise-add-${workout.data.id}` });

  const exerciseId = bg.useTextField(Form.exerciseId.field);
  const query = bg.useTextField(Form.query.field);
  const sets = bg.useNumberField(Form.sets.field);
  const repsMin = bg.useNumberField(Form.repsMin.field);
  const repsMax = bg.useNumberField(Form.repsMax.field);

  const mutation = bg.useMutation({
    perform: () =>
      fetch(`/api/workouts/${workout.data.id}/exercise`, {
        method: "POST",
        credentials: "include",
        headers: bg.WeakETag.fromRevision(workout.data.revision),
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

  if (!workout.actions.exerciseAdd.available) return null;

  const first = workout.data.exercises.length === 0;

  return (
    <div data-stack="y" {...ui.Gap.cluster}>
      <ui.HairlineBlock
        data-cross="center"
        data-stack="x"
        data-wrap="nowrap"
        first={first}
        last
        {...ui.Spacing.row}
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
          disabled={!workout.actions.exerciseAdd.enabled}
          onClick={workoutExerciseAdd.enable}
          type="button"
          {...ui.Gap.related}
          {...workoutExerciseAdd.props.controller}
        >
          <ui.AddPlaceholder />

          {t("workout.exercise.add.cta")}
        </button>

        <ui.ActionHint {...workout.actions.exerciseAdd} data-shrink="0" />
      </ui.HairlineBlock>

      <ui.Dialog {...workoutExerciseAdd}>
        <ui.DialogHeader disabled={mutation.isLoading} onClose={bg.exec([clear, workoutExerciseAdd.disable])}>
          {t("workout.exercise.add.cta")}
        </ui.DialogHeader>

        <form
          aria-busy={mutation.isLoading}
          data-minh="0"
          data-stack="y"
          onSubmit={mutation.handleSubmit}
          {...ui.Gap.section}
        >
          <ui.ExercisePicker
            exercises={exercises.data}
            name={exerciseId.input.props.name}
            onChange={exerciseId.set}
            query={query}
            value={exerciseId.value}
          />

          <ui.Prescription>
            <ui.Stepper
              field={sets}
              label={t("workout.exercise.add.sets.label")}
              variant="fill"
              {...Form.sets.pattern}
            />

            <ui.Separator>×</ui.Separator>

            <ui.Stepper
              field={repsMin}
              label={t("workout.exercise.add.reps.label")}
              variant="fill"
              {...Form.repsMin.pattern}
            />

            <ui.Separator>–</ui.Separator>

            <ui.Stepper
              field={repsMax}
              label={t("workout.exercise.add.reps.max.label")}
              variant="fill"
              {...Form.repsMax.pattern}
              min={repsMin.value ?? Form.repsMax.pattern.min}
            />
          </ui.Prescription>

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
    </div>
  );
}
