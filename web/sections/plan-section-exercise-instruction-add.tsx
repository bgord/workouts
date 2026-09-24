import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { Form } from "../../app/services/plan-section-exercise-instruction-add-form";
import type { PlanSection } from "../../modules/plans/queries/get-plan";
import * as ui from "../components";
import { useExerciseCatalog } from "../hooks/use-exercise-catalog";
import { planRoute } from "../router";

export function PlanSectionExerciseInstructionAdd(props: PlanSection) {
  const t = bg.useTranslations();
  const router = useRouter();
  const { plan } = planRoute.useLoaderData();
  const catalog = useExerciseCatalog();

  const planSectionExerciseInstructionAdd = bg.useToggle({
    name: `plan-section-exercise-instruction-add-${props.id}`,
  });

  const exerciseId = bg.useTextField(Form.exerciseId.field);
  const query = bg.useTextField(Form.query.field);
  const sets = bg.useNumberField(Form.sets.field);
  const repsMin = bg.useNumberField(Form.repsMin.field);
  const repsMax = bg.useNumberField(Form.repsMax.field);
  const progression = bg.useTextField(Form.progression.field);

  const mutation = bg.useMutation({
    perform: () =>
      fetch(`/api/plans/${plan.data.id}/section/${props.id}/exercise-instruction`, {
        method: "POST",
        credentials: "include",
        headers: bg.WeakETag.fromRevision(plan.data.revision),
        body: JSON.stringify({
          exerciseId: exerciseId.value,
          sets: sets.value,
          reps: { min: repsMin.value, max: repsMax.value },
          progression: progression.value,
        }),
      }),
    onSuccess: async (_, context) => {
      planSectionExerciseInstructionAdd.disable();
      await router.invalidate({ filter: (match) => match.routeId === planRoute.id, sync: true });
      bg.Fields.clearAll([exerciseId, query, sets, repsMin, repsMax, progression]);
      context.form?.reset();
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

  if (!props.actions.exerciseInstructionAdd.available) return null;

  return (
    <>
      <ui.HairlineBlock data-ml="1-5" data-stack="x" tone="subtle" {...ui.Spacing.rowCompact}>
        <ui.AddButton
          disabled={!props.actions.exerciseInstructionAdd.enabled}
          onClick={bg.exec([catalog.load, planSectionExerciseInstructionAdd.enable])}
          onFocus={catalog.load}
          onPointerEnter={catalog.load}
          {...planSectionExerciseInstructionAdd.props.controller}
        >
          <ui.RowIndex aria-hidden>{props.exerciseInstructions.length + 1}</ui.RowIndex>

          <ui.AddPlaceholder />

          {t("plan.section.exercise.add.cta")}
        </ui.AddButton>

        <ui.ActionHint {...props.actions.exerciseInstructionAdd} data-shrink="0" />
      </ui.HairlineBlock>

      <ui.Dialog {...planSectionExerciseInstructionAdd}>
        <ui.DialogHeader
          disabled={mutation.isLoading}
          onClose={bg.exec([clear, planSectionExerciseInstructionAdd.disable])}
        >
          {t("plan.section.exercise.add.cta")}
          <small data-ml="2">· {props.name}</small>
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
              onChange={(exercise) => exerciseId.set(exercise.id)}
              query={query}
              value={exerciseId.value}
            />
          )}

          <ui.Prescription>
            <ui.Stepper
              field={sets}
              label={t("plan.section.exercise.add.sets.label")}
              variant="fill"
              {...Form.sets.pattern}
            />

            <ui.Separator>×</ui.Separator>

            <ui.Stepper
              field={repsMin}
              label={t("plan.section.exercise.add.reps.label")}
              variant="fill"
              {...Form.repsMin.pattern}
            />

            <ui.Separator>–</ui.Separator>

            <ui.Stepper
              field={repsMax}
              label={t("plan.section.exercise.add.reps.max.label")}
              variant="fill"
              {...Form.repsMax.pattern}
              min={repsMin.value ?? Form.repsMax.pattern.min}
            />
          </ui.Prescription>

          <ui.ProgressionMethodSelect field={progression} />

          {mutation.isError && <ui.DialogError>{t("plan.section.exercise.add.error")}</ui.DialogError>}

          <ui.DialogFooter
            disabled={mutation.isLoading}
            onCancel={bg.exec([clear, planSectionExerciseInstructionAdd.disable])}
          >
            <ui.ButtonClear
              disabled={
                exerciseId.empty &&
                query.empty &&
                sets.unchanged &&
                repsMin.unchanged &&
                repsMax.unchanged &&
                progression.unchanged
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
              {t("plan.section.exercise.add.cta")}
            </button>
          </ui.DialogFooter>
        </form>
      </ui.Dialog>
    </>
  );
}
