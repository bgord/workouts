import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { Form } from "../../app/services/workout-exercise-add-form";
import { RepsSchemeOptions } from "../../modules/plans/value-objects/reps-scheme-options";
import * as ui from "../components";
import { useExerciseCatalog } from "../hooks/use-exercise-catalog";
import { RepsSchemeKit } from "../kits/reps-scheme.kit";
import { workoutRoute } from "../router";
import { ProgressionMethodChoice } from "../services/progression-method-choice";

export function WorkoutExerciseAdd() {
  const t = bg.useTranslations();
  const router = useRouter();
  const { workout } = workoutRoute.useLoaderData();
  const catalog = useExerciseCatalog();

  const workoutExerciseAdd = bg.useToggle({ name: `workout-exercise-add-${workout.data.id}` });

  const exerciseId = bg.useTextField(Form.exerciseId.field);
  const query = bg.useTextField(Form.query.field);
  const sets = bg.useNumberField(Form.sets.field);
  const repsMin = bg.useNumberField(Form.repsMin.field);
  const repsMax = bg.useNumberField(Form.repsMax.field);
  const progression = bg.useTextField(Form.progression.field);
  const repsScheme = bg.useTextField(Form.repsScheme.field);
  const exercise = catalog.find(exerciseId.value);
  const scheme = repsScheme.value ?? RepsSchemeOptions.range;
  const Reps = RepsSchemeKit[scheme];

  const toggleRepsScheme = () => {
    repsScheme.set(Reps.toggled);
    RepsSchemeKit[Reps.toggled].align(repsMin, repsMax);
    progression.set(
      ProgressionMethodChoice.keep(exercise?.progressionMethods, Reps.toggled, progression.value),
    );
  };

  const mutation = bg.useMutation({
    perform: () =>
      fetch(`/api/workouts/${workout.data.id}/exercise`, {
        method: "POST",
        credentials: "include",
        headers: bg.WeakETag.fromRevision(workout.data.revision),
        body: JSON.stringify({
          exerciseId: exerciseId.value,
          sets: sets.value,
          reps: Reps.payload(repsMin, repsMax),
          progression: progression.value,
        }),
      }),
    onSuccess: async (_, context) => {
      workoutExerciseAdd.disable();
      await router.invalidate({ filter: (match) => match.routeId === workoutRoute.id, sync: true });
      bg.Fields.clearAll([exerciseId, query, sets, repsMin, repsMax, repsScheme, progression]);
      context.form?.reset();
    },
  });

  const clear = bg.exec([
    exerciseId.clear,
    query.clear,
    sets.clear,
    repsMin.clear,
    repsMax.clear,
    repsScheme.clear,
    progression.clear,
    mutation.reset,
  ]);

  if (!workout.actions.exerciseAdd.available) return null;

  const first = workout.data.exercises.length === 0;

  return (
    <div data-stack="y" {...ui.Gap.cluster}>
      <ui.HairlineBlock data-stack="x" first={first} last {...ui.Spacing.row}>
        <ui.AddButton
          disabled={!workout.actions.exerciseAdd.enabled}
          onClick={bg.exec([catalog.load, workoutExerciseAdd.enable])}
          onFocus={catalog.load}
          onPointerEnter={catalog.load}
          {...ui.describedByHint(workout.actions.exerciseAdd, "workout-exercise-add-hint")}
          {...workoutExerciseAdd.props.controller}
        >
          <ui.AddPlaceholder />

          {t("workout.exercise.add.cta")}
        </ui.AddButton>

        <ui.ActionHint {...workout.actions.exerciseAdd} data-shrink="0" id="workout-exercise-add-hint" />
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
          {catalog.exercises && (
            <ui.ExercisePicker
              exercises={catalog.exercises}
              name={exerciseId.input.props.name}
              onChange={(exercise) => {
                exerciseId.set(exercise.id);
                progression.set(
                  ProgressionMethodChoice.keep(exercise.progressionMethods, scheme, progression.value),
                );
              }}
              query={query}
              value={exerciseId.value}
            />
          )}

          <ui.Prescription>
            <ui.Stepper
              aria-label={t("workout.exercise.add.sets.label")}
              field={sets}
              variant="fill"
              {...Form.sets.pattern}
            />

            <ui.Separator>×</ui.Separator>

            <ui.Stepper
              aria-label={t("workout.exercise.add.reps.label")}
              field={repsMin}
              variant="fill"
              {...Form.repsMin.pattern}
            />

            <Reps.Field
              aria-label={t("workout.exercise.add.reps.max.label")}
              field={repsMax}
              {...Form.repsMax.pattern}
              min={repsMin.value ?? Form.repsMax.pattern.min}
            />
          </ui.Prescription>

          <div data-stack="x">
            <ui.ChipButton onClick={toggleRepsScheme} pressed={scheme === RepsSchemeOptions.amrap}>
              {t("workout.exercise.add.amrap")}
            </ui.ChipButton>
          </div>

          <ui.ProgressionMethodSelect
            field={progression}
            options={ProgressionMethodChoice.options(exercise?.progressionMethods, scheme)}
          />

          {mutation.isError && <ui.DialogError>{t("workout.exercise.add.error")}</ui.DialogError>}

          <ui.DialogFooter
            disabled={mutation.isLoading}
            onCancel={bg.exec([clear, workoutExerciseAdd.disable])}
          >
            <ui.ButtonClear
              disabled={
                exerciseId.empty &&
                query.empty &&
                sets.unchanged &&
                repsMin.unchanged &&
                Reps.unchanged(repsMax) &&
                repsScheme.unchanged &&
                progression.unchanged
              }
              onClick={clear}
            />

            <button
              className="c-button"
              data-variant="primary"
              disabled={
                exerciseId.empty || sets.empty || repsMin.empty || !Reps.ready(repsMax) || mutation.isLoading
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
