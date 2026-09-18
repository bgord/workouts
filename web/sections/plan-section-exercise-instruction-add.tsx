import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { Form } from "../../app/services/plan-section-exercise-instruction-add-form";
import type { ActionState } from "../../modules/action-state";
import type { Plan, PlanSectionWithExercises } from "../../modules/plans/value-objects/plan";
import * as ui from "../components";
import { planRoute } from "../router";

const placeholder = { ...bg.Rhythm().times(3).width, ...bg.Rhythm().times(3).height };

export function PlanSectionExerciseInstructionAdd(props: {
  plan: Plan;
  section: PlanSectionWithExercises;
  action: ActionState;
}) {
  const t = bg.useTranslations();
  const router = useRouter();
  const { exercises } = planRoute.useLoaderData();

  const planSectionExerciseInstructionAdd = bg.useToggle({
    name: `plan-section-exercise-instruction-add-${props.section.id}`,
  });

  const exerciseId = bg.useTextField(Form.exerciseId.field);
  const query = bg.useTextField(Form.query.field);
  const sets = bg.useNumberField(Form.sets.field);
  const repsMin = bg.useNumberField(Form.repsMin.field);
  const repsMax = bg.useNumberField(Form.repsMax.field);

  const mutation = bg.useMutation({
    perform: () =>
      fetch(`/api/plans/${props.plan.id}/section/${props.section.id}/exercise-instruction`, {
        method: "POST",
        credentials: "include",
        headers: bg.WeakETag.fromRevision(props.plan.revision),
        body: JSON.stringify({
          exerciseId: exerciseId.value,
          sets: sets.value,
          reps: { min: repsMin.value, max: repsMax.value },
        }),
      }),
    onSuccess: async (_, context) => {
      planSectionExerciseInstructionAdd.disable();

      await router.invalidate({ filter: (route) => route.id === planRoute.id, sync: true });

      bg.Fields.clearAll([exerciseId, query, sets, repsMin, repsMax]);
      context.form?.reset();
    },
  });

  if (planSectionExerciseInstructionAdd.off) {
    return (
      <ui.HairlineBlock
        data-cross="center"
        data-stack="x"
        data-wrap="nowrap"
        tone="subtle"
        {...ui.Spacing.rowCompact}
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
          onClick={planSectionExerciseInstructionAdd.enable}
          type="button"
          {...ui.Gap.related}
          {...planSectionExerciseInstructionAdd.props.controller}
        >
          <ui.RowIndex aria-hidden>{props.section.exerciseInstructions.length + 1}</ui.RowIndex>

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

          {t("plan.section.exercise.add.cta")}
        </button>

        <ui.ActionHint {...props.action} data-shrink="0" />
      </ui.HairlineBlock>
    );
  }

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
        tone="subtle"
        {...ui.Spacing.rowCompact}
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
          onClick={planSectionExerciseInstructionAdd.enable}
          type="button"
          {...ui.Gap.related}
          {...planSectionExerciseInstructionAdd.props.controller}
        >
          <ui.RowIndex aria-hidden>{props.section.exerciseInstructions.length + 1}</ui.RowIndex>

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

          {t("plan.section.exercise.add.cta")}
        </button>

        <ui.ActionHint {...props.action} data-shrink="0" />
      </ui.HairlineBlock>

      <ui.Dialog {...planSectionExerciseInstructionAdd}>
        <ui.DialogHeader
          disabled={mutation.isLoading}
          onClose={bg.exec([clear, planSectionExerciseInstructionAdd.disable])}
        >
          {t("plan.section.exercise.add.cta")}
          <span data-color="neutral-500" data-fw="regular" data-ml="2">
            · {props.section.name}
          </span>
        </ui.DialogHeader>

        <form
          aria-busy={mutation.isLoading}
          data-minh="0"
          data-stack="y"
          {...ui.Gap.section}
          data-wrap="nowrap"
          onSubmit={mutation.handleSubmit}
        >
          <ui.ExercisePicker
            exercises={exercises.data}
            name={exerciseId.input.props.name}
            onChange={exerciseId.set}
            query={query}
            value={exerciseId.value}
          />

          <div
            data-cross="center"
            data-stack="x"
            data-wrap="nowrap"
            style={{ maxWidth: 336 }}
            {...ui.Gap.cluster}
          >
            <ui.Stepper
              field={sets}
              label={t("plan.section.exercise.add.sets.label")}
              max={Form.sets.pattern.max}
              min={Form.sets.pattern.min}
              step={1}
              variant="fill"
            />

            <ui.Separator>×</ui.Separator>

            <ui.Stepper
              field={repsMin}
              label={t("plan.section.exercise.add.reps.label")}
              max={Form.repsMin.pattern.max}
              min={Form.repsMin.pattern.min}
              step={1}
              variant="fill"
            />

            <ui.Separator>–</ui.Separator>

            <ui.Stepper
              field={repsMax}
              label={t("plan.section.exercise.add.reps.max.label")}
              max={Form.repsMax.pattern.max}
              min={repsMin.value ?? Form.repsMax.pattern.min}
              step={1}
              variant="fill"
            />
          </div>

          {mutation.isError && <ui.DialogError>{t("plan.section.exercise.add.error")}</ui.DialogError>}

          <ui.DialogFooter
            disabled={mutation.isLoading}
            onCancel={bg.exec([clear, planSectionExerciseInstructionAdd.disable])}
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
              {t("plan.section.exercise.add.cta")}
            </button>
          </ui.DialogFooter>
        </form>
      </ui.Dialog>
    </>
  );
}
