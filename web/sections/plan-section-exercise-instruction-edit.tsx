import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Pencil } from "lucide-react";
import { Form } from "../../app/services/plan-section-exercise-instruction-add-form";
import type { PlanExerciseInstruction, PlanSection } from "../../modules/plans/queries/get-plan";
import type { ProgressionMethodOptions } from "../../modules/plans/value-objects/progression-method-options";
import { RepsScheme } from "../../modules/plans/value-objects/reps-scheme";
import { RepsSchemeOptions } from "../../modules/plans/value-objects/reps-scheme-options";
import * as ui from "../components";
import { useExerciseCatalog } from "../hooks/use-exercise-catalog";
import { RepsSchemeKit } from "../kits/reps-scheme.kit";
import { planRoute } from "../router";
import { ProgressionMethodChoice } from "../services/progression-method-choice";

export function PlanSectionExerciseInstructionEdit(props: {
  section: PlanSection;
  exerciseInstruction: PlanExerciseInstruction;
}) {
  const t = bg.useTranslations();
  const router = useRouter();
  const { plan } = planRoute.useLoaderData();
  const catalog = useExerciseCatalog();
  const { exerciseInstruction } = props;
  const { actions } = exerciseInstruction;

  const planSectionExerciseInstructionEdit = bg.useToggle({
    name: `plan-section-exercise-instruction-edit-${exerciseInstruction.id}`,
  });
  const planSectionExerciseInstructionPick = bg.useToggle({
    name: `plan-section-exercise-instruction-pick-${exerciseInstruction.id}`,
  });

  const exerciseId = bg.useTextField<string>({
    name: `${Form.exerciseId.field.name}-${exerciseInstruction.id}`,
    defaultValue: exerciseInstruction.exercise.id,
  });

  const query = bg.useTextField({ name: `${Form.query.field.name}-${exerciseInstruction.id}` });

  const sets = bg.useNumberField<number>({
    name: `${Form.sets.field.name}-${exerciseInstruction.id}`,
    defaultValue: exerciseInstruction.sets,
  });

  const repsMin = bg.useNumberField<number>({
    name: `${Form.repsMin.field.name}-${exerciseInstruction.id}`,
    defaultValue: exerciseInstruction.reps.min,
  });

  const repsMax = bg.useNumberField<number>({
    name: `${Form.repsMax.field.name}-${exerciseInstruction.id}`,
    defaultValue: exerciseInstruction.reps.max ?? Form.repsMax.field.defaultValue,
  });

  const repsScheme = bg.useTextField<RepsSchemeOptions>({
    name: `${Form.repsScheme.field.name}-${exerciseInstruction.id}`,
    defaultValue: RepsScheme.of(exerciseInstruction.reps),
  });

  const progression = bg.useTextField<ProgressionMethodOptions>({
    name: `${Form.progression.field.name}-${exerciseInstruction.id}`,
    defaultValue: exerciseInstruction.progression,
  });

  const exercise = catalog.find(exerciseId.value) ?? exerciseInstruction.exercise;
  const scheme = repsScheme.value ?? RepsSchemeOptions.range;
  const Reps = RepsSchemeKit[scheme];

  const instructionUnchanged =
    sets.unchanged &&
    repsMin.unchanged &&
    Reps.unchanged(repsMax) &&
    repsScheme.unchanged &&
    progression.unchanged;

  const toggleRepsScheme = () => {
    repsScheme.set(Reps.toggled);
    RepsSchemeKit[Reps.toggled].align(repsMin, repsMax);
    progression.set(
      ProgressionMethodChoice.keep(exercise.progressionMethods, Reps.toggled, progression.value),
    );
  };

  const mutation = bg.useMutation({
    perform: () =>
      fetch(
        `/api/plans/${plan.data.id}/section/${props.section.id}/exercise-instruction/${exerciseInstruction.id}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: bg.WeakETag.fromRevision(plan.data.revision),
          body: JSON.stringify({
            exerciseId: exerciseId.value,
            sets: sets.value,
            reps: Reps.payload(repsMin, repsMax),
            progression: progression.value,
          }),
        },
      ),
    onSuccess: async () => {
      planSectionExerciseInstructionEdit.disable();
      planSectionExerciseInstructionPick.disable();
      await router.invalidate({ filter: (match) => match.routeId === planRoute.id, sync: true });
    },
  });

  const clear = bg.exec([
    exerciseId.clear,
    query.clear,
    sets.clear,
    repsMin.clear,
    repsMax.clear,
    progression.clear,
    repsScheme.clear,
    mutation.reset,
  ]);
  const close = bg.exec([
    clear,
    planSectionExerciseInstructionPick.disable,
    planSectionExerciseInstructionEdit.disable,
  ]);

  if (!actions.update.available) return null;

  return (
    <>
      <ui.IconButton
        aria-label={t("plan.section.exercise.edit.cta")}
        onClick={bg.exec([catalog.load, planSectionExerciseInstructionEdit.enable])}
        title={t("plan.section.exercise.edit.cta")}
        {...planSectionExerciseInstructionEdit.props.controller}
      >
        <Pencil data-size="sm" />
      </ui.IconButton>

      <ui.Dialog {...planSectionExerciseInstructionEdit}>
        <ui.DialogHeader>
          {t("plan.section.exercise.edit.cta")}
          <small data-ml="2">· {props.section.name}</small>
        </ui.DialogHeader>

        {planSectionExerciseInstructionPick.on && catalog.exercises && (
          <div data-minh="0" data-stack="y">
            <ui.ExercisePicker
              exercises={catalog.exercises}
              name={exerciseId.input.props.name}
              onCancel={bg.exec([query.clear, planSectionExerciseInstructionPick.disable])}
              onChange={(exercise) => {
                exerciseId.set(exercise.id);
                progression.set(
                  ProgressionMethodChoice.keep(exercise.progressionMethods, scheme, progression.value),
                );
                planSectionExerciseInstructionPick.disable();
              }}
              query={query}
              value={exerciseId.value}
            />
          </div>
        )}

        {planSectionExerciseInstructionPick.off && (
          <form
            aria-busy={mutation.isLoading}
            data-stack="y"
            onSubmit={mutation.handleSubmit}
            {...ui.Gap.stack}
          >
            <ui.ExercisePicked
              disabled={!actions.update.enabled || mutation.isLoading}
              exercise={exercise}
              onChange={bg.exec([catalog.load, planSectionExerciseInstructionPick.enable])}
            />

            <ui.Prescription data-cross="end">
              <div data-grow="1" data-stack="y" {...ui.Gap.field}>
                <span aria-hidden>{t("plan.section.exercise.add.sets.label")}</span>

                <ui.Stepper
                  aria-label={t("plan.section.exercise.add.sets.label")}
                  disabled={!actions.update.enabled}
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
                  <span aria-hidden>{t("plan.section.exercise.add.reps.label")}</span>

                  <ui.ChipButton
                    disabled={!actions.update.enabled}
                    onClick={toggleRepsScheme}
                    pressed={scheme === RepsSchemeOptions.amrap}
                  >
                    {t("plan.section.exercise.add.amrap")}
                  </ui.ChipButton>
                </div>

                <div data-cross="center" data-stack="x" {...ui.Gap.cluster}>
                  <ui.Stepper
                    aria-label={t("plan.section.exercise.add.reps.label")}
                    disabled={!actions.update.enabled}
                    field={repsMin}
                    variant="fill"
                    {...Form.repsMin.pattern}
                  />

                  <Reps.Field
                    aria-label={t("plan.section.exercise.add.reps.max.label")}
                    disabled={!actions.update.enabled}
                    field={repsMax}
                    {...Form.repsMax.pattern}
                    min={repsMin.value ?? Form.repsMax.pattern.min}
                  />
                </div>
              </div>
            </ui.Prescription>

            <ui.ProgressionMethodPicker
              disabled={!actions.update.enabled}
              field={progression}
              options={ProgressionMethodChoice.options(exercise.progressionMethods, scheme)}
            />

            {mutation.isError && <ui.DialogError>{t("plan.section.exercise.edit.error")}</ui.DialogError>}

            <ui.DialogFooter disabled={mutation.isLoading} onCancel={close}>
              <ui.ButtonClear
                disabled={exerciseId.unchanged && query.empty && instructionUnchanged}
                onClick={clear}
              />

              <button
                className="c-button"
                data-variant="primary"
                disabled={
                  (exerciseId.unchanged && instructionUnchanged) ||
                  sets.empty ||
                  repsMin.empty ||
                  !Reps.ready(repsMax) ||
                  mutation.isLoading
                }
                type="submit"
              >
                {t("app.save")}
              </button>
            </ui.DialogFooter>
          </form>
        )}
      </ui.Dialog>
    </>
  );
}
