import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { Form } from "../../app/services/plan-section-exercise-instruction-add-form";
import type { ActionState } from "../../modules/action-state";
import type { Plan, PlanSectionWithExercises } from "../../modules/plans/value-objects/plan";
import {
  ActionHint,
  ButtonClear,
  Dialog,
  DialogError,
  DialogFooter,
  DialogHeader,
  ExercisePicker,
  Stepper,
} from "../components";
import { planRoute } from "../router";

const placeholder = { ...bg.Rhythm().times(3).width, ...bg.Rhythm().times(3).height };
const shrinkable = { minHeight: 0 };

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
      <div
        data-bct="alpha-subtle"
        data-bst="solid"
        data-bwt="hairline"
        data-cross="center"
        data-gap="3"
        data-md-ml="3"
        data-ml="6"
        data-stack="x"
        data-wrap="nowrap"
      >
        <button
          data-color="neutral-400"
          data-cross="center"
          data-cursor="pointer"
          data-fs="sm"
          data-fw="medium"
          data-gap="3"
          data-grow="1"
          data-hover-color="neutral-0"
          data-py="2"
          data-stack="x"
          data-wrap="nowrap"
          disabled={!props.action.enabled}
          onClick={planSectionExerciseInstructionAdd.enable}
          type="button"
          {...planSectionExerciseInstructionAdd.props.controller}
        >
          <div aria-hidden data-color="neutral-600" data-fs="xs" data-transform="font-variant-numeric">
            {props.section.exerciseInstructions.length + 1}
          </div>

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

        <ActionHint {...props.action} data-shrink="0" />
      </div>
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
      <div
        data-bct="alpha-subtle"
        data-bst="solid"
        data-bwt="hairline"
        data-cross="center"
        data-gap="3"
        data-stack="x"
        data-wrap="nowrap"
      >
        <button
          data-color="neutral-400"
          data-cross="center"
          data-cursor="pointer"
          data-fs="sm"
          data-fw="medium"
          data-gap="3"
          data-grow="1"
          data-hover-color="neutral-0"
          data-py="2"
          data-stack="x"
          data-wrap="nowrap"
          disabled={!props.action.enabled}
          onClick={planSectionExerciseInstructionAdd.enable}
          type="button"
          {...planSectionExerciseInstructionAdd.props.controller}
        >
          <div aria-hidden data-color="neutral-600" data-fs="xs" data-transform="font-variant-numeric">
            {props.section.exerciseInstructions.length + 1}
          </div>

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

        <ActionHint {...props.action} data-shrink="0" />
      </div>

      <Dialog {...planSectionExerciseInstructionAdd}>
        <DialogHeader
          disabled={mutation.isLoading}
          onClose={bg.exec([clear, planSectionExerciseInstructionAdd.disable])}
        >
          {t("plan.section.exercise.add.cta")}
          <span data-color="neutral-500" data-fw="regular" data-ml="2">
            · {props.section.name}
          </span>
        </DialogHeader>

        <form
          aria-busy={mutation.isLoading}
          data-gap="6"
          data-stack="y"
          data-wrap="nowrap"
          onSubmit={mutation.handleSubmit}
          style={shrinkable}
        >
          <ExercisePicker
            exercises={exercises.data}
            name={exerciseId.input.props.name}
            onChange={exerciseId.set}
            query={query}
            value={exerciseId.value}
          />

          <div data-cross="center" data-gap="2" data-stack="x" data-wrap="nowrap" style={{ maxWidth: 336 }}>
            <Stepper
              field={sets}
              label={t("plan.section.exercise.add.sets.label")}
              max={Form.sets.pattern.max}
              min={Form.sets.pattern.min}
              step={1}
              variant="fill"
            />

            <span data-color="neutral-500" data-fs="sm">
              ×
            </span>

            <Stepper
              field={repsMin}
              label={t("plan.section.exercise.add.reps.label")}
              max={Form.repsMin.pattern.max}
              min={Form.repsMin.pattern.min}
              step={1}
              variant="fill"
            />

            <span data-color="neutral-500" data-fs="sm">
              –
            </span>

            <Stepper
              field={repsMax}
              label={t("plan.section.exercise.add.reps.max.label")}
              max={Form.repsMax.pattern.max}
              min={repsMin.value ?? Form.repsMax.pattern.min}
              step={1}
              variant="fill"
            />
          </div>

          {mutation.isError && <DialogError>{t("plan.section.exercise.add.error")}</DialogError>}

          <DialogFooter
            disabled={mutation.isLoading}
            onCancel={bg.exec([clear, planSectionExerciseInstructionAdd.disable])}
          >
            <ButtonClear
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
          </DialogFooter>
        </form>
      </Dialog>
    </>
  );
}
