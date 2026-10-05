import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { ArrowLeftRight, Pencil } from "lucide-react";
import { useState } from "react";
import { Form } from "../../app/services/plan-section-exercise-instruction-add-form";
import type { ExerciseWithCategories } from "../../modules/exercises/value-objects/exercise-with-categories";
import type { PlanExerciseInstruction, PlanSection } from "../../modules/plans/queries/get-plan";
import { applicableProgressionMethod } from "../../modules/plans/value-objects/progression-method-applicability";
import type { ProgressionMethodOptions } from "../../modules/plans/value-objects/progression-method-options";
import * as ui from "../components";
import { useExerciseCatalog } from "../hooks/use-exercise-catalog";
import { planRoute } from "../router";

export function PlanSectionExerciseInstructionEdit(props: {
  section: PlanSection;
  exerciseInstruction: PlanExerciseInstruction;
}) {
  const t = bg.useTranslations();
  const router = useRouter();
  const { plan } = planRoute.useLoaderData();
  const catalog = useExerciseCatalog();
  const [picked, setPicked] = useState<ExerciseWithCategories | null>(null);
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
    defaultValue: exerciseInstruction.reps.max,
  });

  const progression = bg.useTextField<ProgressionMethodOptions>({
    name: `${Form.progression.field.name}-${exerciseInstruction.id}`,
    defaultValue: exerciseInstruction.progression,
  });

  const exercise = [exerciseInstruction.exercise, picked].find(
    (candidate) => candidate?.id === exerciseId.value,
  );

  const instructionUnchanged =
    sets.unchanged && repsMin.unchanged && repsMax.unchanged && progression.unchanged;

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
            reps: { min: repsMin.value, max: repsMax.value },
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
        onClick={planSectionExerciseInstructionEdit.enable}
        title={t("plan.section.exercise.edit.cta")}
        {...planSectionExerciseInstructionEdit.props.controller}
      >
        <Pencil data-size="sm" />
      </ui.IconButton>

      <ui.Dialog {...planSectionExerciseInstructionEdit}>
        <ui.DialogHeader disabled={mutation.isLoading} onClose={close}>
          {t("plan.section.exercise.edit.cta")}
          <small data-ml="2">· {props.section.name}</small>
        </ui.DialogHeader>

        <form
          aria-busy={mutation.isLoading}
          data-minh="0"
          data-stack="y"
          onSubmit={mutation.handleSubmit}
          {...ui.Gap.section}
        >
          {planSectionExerciseInstructionPick.off && exercise && (
            <button
              aria-label={t("plan.section.exercise.edit.change", { name: exercise.name })}
              data-bc="alpha-medium"
              data-br="md"
              data-bw="hairline"
              data-color="neutral-100"
              data-cursor={actions.update.enabled ? "pointer" : undefined}
              data-hover-bc={actions.update.enabled ? "brand-500" : undefined}
              data-px="3"
              data-stack="x"
              disabled={!actions.update.enabled}
              onClick={bg.exec([catalog.load, planSectionExerciseInstructionPick.enable])}
              onFocus={catalog.load}
              onPointerEnter={catalog.load}
              title={t("plan.section.exercise.edit.change", { name: exercise.name })}
              type="button"
              {...ui.Spacing.rowCompact}
              {...planSectionExerciseInstructionPick.props.controller}
            >
              <span data-shrink="0" data-stack="x">
                <ui.ExerciseImage size={ui.ExerciseImageSize.xs} {...exercise} />
              </span>

              <span data-grow="1" data-transform="truncate" title={exercise.name}>
                {exercise.name}
              </span>

              <ArrowLeftRight data-color="neutral-500" data-shrink="0" data-size="sm" />
            </button>
          )}

          {planSectionExerciseInstructionPick.on && catalog.exercises && (
            <div data-minh="0" {...planSectionExerciseInstructionPick.props.target}>
              <ui.ExercisePicker
                exercises={catalog.exercises}
                name={exerciseId.input.props.name}
                onCancel={bg.exec([query.clear, planSectionExerciseInstructionPick.disable])}
                onChange={(exercise) => {
                  setPicked(exercise);
                  exerciseId.set(exercise.id);
                  progression.set(applicableProgressionMethod(exercise.resistance, progression.value));
                  planSectionExerciseInstructionPick.disable();
                }}
                query={query}
                value={exerciseId.value}
              />
            </div>
          )}

          <ui.Prescription>
            <ui.Stepper
              disabled={!actions.update.enabled}
              field={sets}
              label={t("plan.section.exercise.add.sets.label")}
              variant="fill"
              {...Form.sets.pattern}
            />

            <ui.Separator>×</ui.Separator>

            <ui.Stepper
              disabled={!actions.update.enabled}
              field={repsMin}
              label={t("plan.section.exercise.add.reps.label")}
              variant="fill"
              {...Form.repsMin.pattern}
            />

            <ui.Separator>–</ui.Separator>

            <ui.Stepper
              disabled={!actions.update.enabled}
              field={repsMax}
              label={t("plan.section.exercise.add.reps.max.label")}
              variant="fill"
              {...Form.repsMax.pattern}
              min={repsMin.value ?? Form.repsMax.pattern.min}
            />
          </ui.Prescription>

          <ui.ProgressionMethodSelect
            disabled={!actions.update.enabled}
            field={progression}
            resistance={exercise?.resistance}
          />

          {mutation.isError && <ui.DialogError>{t("plan.section.exercise.edit.error")}</ui.DialogError>}

          <ui.DialogFooter disabled={mutation.isLoading} onCancel={close}>
            <ui.ButtonClear
              disabled={exerciseId.unchanged && query.empty && instructionUnchanged}
              onClick={bg.exec([clear, planSectionExerciseInstructionPick.disable])}
            />

            <button
              className="c-button"
              data-variant="primary"
              disabled={
                (exerciseId.unchanged && instructionUnchanged) ||
                sets.empty ||
                repsMin.empty ||
                repsMax.empty ||
                mutation.isLoading
              }
              type="submit"
            >
              {t("app.save")}
            </button>
          </ui.DialogFooter>
        </form>
      </ui.Dialog>
    </>
  );
}
