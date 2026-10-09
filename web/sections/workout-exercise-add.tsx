import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { Form } from "../../app/services/workout-exercise-add-form";
import { RepsScheme } from "../../modules/plans/value-objects/reps-scheme";
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
  const workoutExercisePick = bg.useToggle({ name: `workout-exercise-add-pick-${workout.data.id}` });

  const exerciseId = bg.useTextField(Form.exerciseId.field);
  const query = bg.useTextField(Form.query.field);
  const sets = bg.useNumberField(Form.sets.field);
  const repsMin = bg.useNumberField(Form.repsMin.field);
  const repsMax = bg.useNumberField(Form.repsMax.field);
  const progression = bg.useTextField(Form.progression.field);
  const rir = bg.useNumberField(Form.rir.field);
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
    if (!RepsScheme.allowsRir(Reps.toggled)) rir.clear();
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
          rir: rir.value,
        }),
      }),
    onSuccess: async (_, context) => {
      workoutExerciseAdd.disable();
      workoutExercisePick.disable();
      await router.invalidate({ filter: (match) => match.routeId === workoutRoute.id, sync: true });
      bg.Fields.clearAll([exerciseId, query, sets, repsMin, repsMax, repsScheme, progression, rir]);
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
    rir.clear,
    mutation.reset,
  ]);
  const close = bg.exec([clear, workoutExercisePick.disable, workoutExerciseAdd.disable]);

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
        <ui.DialogHeader>{t("workout.exercise.add.cta")}</ui.DialogHeader>

        {(!exercise || workoutExercisePick.on) && catalog.exercises && (
          <>
            <div data-minh="0" data-stack="y">
              <ui.ExercisePicker
                exercises={catalog.exercises}
                name={exerciseId.input.props.name}
                onCancel={exercise && bg.exec([query.clear, workoutExercisePick.disable])}
                onChange={(exercise) => {
                  exerciseId.set(exercise.id);
                  progression.set(
                    ProgressionMethodChoice.keep(exercise.progressionMethods, scheme, progression.value),
                  );
                  workoutExercisePick.disable();
                }}
                query={query}
                value={exerciseId.value}
              />
            </div>

            {!exercise && <ui.DialogFooter onCancel={close} />}
          </>
        )}

        {exercise && workoutExercisePick.off && (
          <form
            aria-busy={mutation.isLoading}
            data-stack="y"
            onSubmit={mutation.handleSubmit}
            {...ui.Gap.stack}
          >
            <ui.ExercisePicked
              disabled={mutation.isLoading}
              exercise={exercise}
              onChange={bg.exec([catalog.load, workoutExercisePick.enable])}
            />

            <ui.Prescription data-cross="end">
              <div data-grow="1" data-stack="y" {...ui.Gap.field}>
                <span aria-hidden>{t("workout.exercise.add.sets.label")}</span>

                <ui.Stepper
                  aria-label={t("workout.exercise.add.sets.label")}
                  field={sets}
                  variant="fill"
                  {...Form.sets.pattern}
                />
              </div>

              <ui.Separator data-cross="center" data-stack="x" {...bg.Rhythm(34).times(1).style.height}>
                ×
              </ui.Separator>

              <div data-stack="y" style={{ flexGrow: 2 }} {...ui.Gap.field}>
                <div data-cross="center" data-main="between" data-stack="x" {...ui.Gap.cluster}>
                  <span aria-hidden>{t("workout.exercise.add.reps.label")}</span>

                  <ui.ChipButton onClick={toggleRepsScheme} pressed={scheme === RepsSchemeOptions.amrap}>
                    {t("workout.exercise.add.amrap")}
                  </ui.ChipButton>
                </div>

                <div data-cross="center" data-stack="x" {...ui.Gap.cluster}>
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
                </div>
              </div>
            </ui.Prescription>

            <ui.ProgressionMethodPicker
              field={progression}
              options={ProgressionMethodChoice.options(exercise.progressionMethods, scheme)}
            />

            {RepsScheme.allowsRir(scheme) && <ui.RirTargetPicker field={rir} />}

            {mutation.isError && <ui.DialogError>{t("workout.exercise.add.error")}</ui.DialogError>}

            <ui.DialogFooter
              disabled={mutation.isLoading}
              onCancel={close}
              start={<ui.ButtonClear onClick={clear} />}
            >
              <button
                className="c-button"
                data-variant="primary"
                disabled={sets.empty || repsMin.empty || !Reps.ready(repsMax) || mutation.isLoading}
                type="submit"
              >
                <Plus data-size="sm" />
                {t("workout.exercise.add.cta")}
              </button>
            </ui.DialogFooter>
          </form>
        )}
      </ui.Dialog>
    </div>
  );
}
