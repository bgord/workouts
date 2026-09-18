import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { ArrowLeftRight, Pencil } from "lucide-react";
import { Form } from "../../app/services/plan-section-exercise-instruction-add-form";
import type { PlanExerciseInstruction, PlanSection } from "../../modules/plans/queries/get-plan";
import type { Plan } from "../../modules/plans/value-objects/plan";
import { Plans } from "../api";
import * as ui from "../components";
import { planRoute } from "../router";

export function PlanSectionExerciseInstructionEdit(props: {
  plan: Plan;
  section: PlanSection;
  exerciseInstruction: PlanExerciseInstruction;
}) {
  const t = bg.useTranslations();
  const router = useRouter();
  const { exercises } = planRoute.useLoaderData();
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

  const exercise = exercises.data.find((candidate) => candidate.id === exerciseId.value);

  const instructionUnchanged = sets.unchanged && repsMin.unchanged && repsMax.unchanged;

  const base = `/api/plans/${props.plan.id}/section/${props.section.id}/exercise-instruction/${exerciseInstruction.id}`;

  const mutation = bg.useMutation({
    perform: async () => {
      let revision = props.plan.revision;

      if (!exerciseId.unchanged) {
        const response = await fetch(`${base}/exercise`, {
          method: "PATCH",
          credentials: "include",
          headers: bg.WeakETag.fromRevision(revision),
          body: JSON.stringify({ exerciseId: exerciseId.value }),
        });

        if (!response.ok || instructionUnchanged) return response;

        const plan = await Plans.get(null, { planId: props.plan.id });
        revision = plan?.data?.revision ?? revision;
      }

      return fetch(`${base}/instruction`, {
        method: "PATCH",
        credentials: "include",
        headers: bg.WeakETag.fromRevision(revision),
        body: JSON.stringify({ sets: sets.value, reps: { min: repsMin.value, max: repsMax.value } }),
      });
    },
    onSuccess: async () => {
      planSectionExerciseInstructionEdit.disable();
      planSectionExerciseInstructionPick.disable();

      await router.invalidate({ filter: (route) => route.id === planRoute.id, sync: true });
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
  const close = bg.exec([
    clear,
    planSectionExerciseInstructionPick.disable,
    planSectionExerciseInstructionEdit.disable,
  ]);

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
          {planSectionExerciseInstructionPick.off && exercise && (
            <button
              data-bc="neutral-800"
              data-br="md"
              data-bs="solid"
              data-bw="hairline"
              data-color="neutral-100"
              data-cross="center"
              data-cursor={actions.exerciseChange.enabled ? "pointer" : undefined}
              data-fs="sm"
              data-hover-bc={actions.exerciseChange.enabled ? "brand-500" : undefined}
              data-px="3"
              data-stack="x"
              data-transform="truncate"
              data-wrap="nowrap"
              disabled={!(actions.exerciseChange.available && actions.exerciseChange.enabled)}
              onClick={planSectionExerciseInstructionPick.enable}
              title={t("plan.section.exercise.edit.change")}
              {...ui.Spacing.rowCompact}
              type="button"
              {...planSectionExerciseInstructionPick.props.controller}
            >
              <span data-shrink="0" data-stack="x">
                <ui.ExerciseImage size={ui.ExerciseImageSize.xs} {...exercise} />
              </span>

              <span data-grow="1" data-transform="truncate" title={exercise.name}>
                {exercise.name}
              </span>

              {actions.exerciseChange.available && (
                <ArrowLeftRight data-color="neutral-500" data-shrink="0" data-size="sm" />
              )}
            </button>
          )}

          {planSectionExerciseInstructionPick.on && (
            <div
              data-minh="0"
              data-stack="y"
              data-wrap="nowrap"
              {...planSectionExerciseInstructionPick.props.target}
            >
              <ui.ExercisePicker
                exercises={exercises.data}
                name={exerciseId.input.props.name}
                onCancel={bg.exec([query.clear, planSectionExerciseInstructionPick.disable])}
                onChange={(id) => {
                  exerciseId.set(id);
                  planSectionExerciseInstructionPick.disable();
                }}
                query={query}
                value={exerciseId.value}
              />
            </div>
          )}

          {actions.update.available && (
            <div
              data-cross="center"
              data-stack="x"
              data-wrap="nowrap"
              style={{ maxWidth: 336 }}
              {...ui.Gap.cluster}
            >
              <ui.Stepper
                disabled={!actions.update.enabled}
                field={sets}
                label={t("plan.section.exercise.add.sets.label")}
                max={Form.sets.pattern.max}
                min={Form.sets.pattern.min}
                step={1}
                variant="fill"
              />

              <ui.Separator>×</ui.Separator>

              <ui.Stepper
                disabled={!actions.update.enabled}
                field={repsMin}
                label={t("plan.section.exercise.add.reps.label")}
                max={Form.repsMin.pattern.max}
                min={Form.repsMin.pattern.min}
                step={1}
                variant="fill"
              />

              <ui.Separator>–</ui.Separator>

              <ui.Stepper
                disabled={!actions.update.enabled}
                field={repsMax}
                label={t("plan.section.exercise.add.reps.max.label")}
                max={Form.repsMax.pattern.max}
                min={repsMin.value ?? Form.repsMax.pattern.min}
                step={1}
                variant="fill"
              />
            </div>
          )}

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
