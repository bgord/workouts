import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Form } from "../../app/services/plan-section-exercise-instruction-add-form";
import type {
  ExerciseInstructionWithExercise,
  Plan,
  PlanSectionWithExercises,
} from "../../modules/plans/value-objects/plan";
import { ButtonCancel } from "../components";
import { SetsReps } from "../components/sets-reps";
import { planRoute } from "../router";

export function PlanSectionExerciseInstructionUpdate(props: {
  plan: Plan;
  section: PlanSectionWithExercises;
  exerciseInstruction: ExerciseInstructionWithExercise;
  toggle: bg.UseToggleReturnType;
}) {
  const t = bg.useTranslations();
  const router = useRouter();
  const update = props.toggle;

  const sets = bg.useNumberField({
    name: `${Form.sets.field.name}-${props.exerciseInstruction.id}`,
    defaultValue: props.exerciseInstruction.sets,
  });

  const repsMin = bg.useNumberField({
    name: `${Form.repsMin.field.name}-${props.exerciseInstruction.id}`,
    defaultValue: props.exerciseInstruction.reps.min,
  });

  const repsMax = bg.useNumberField({
    name: `${Form.repsMax.field.name}-${props.exerciseInstruction.id}`,
    defaultValue: props.exerciseInstruction.reps.max,
  });

  const mutation = bg.useMutation({
    perform: () =>
      fetch(
        `/api/plans/${props.plan.id}/section/${props.section.id}/exercise-instruction/${props.exerciseInstruction.id}/instruction`,
        {
          method: "PATCH",
          credentials: "include",
          headers: bg.WeakETag.fromRevision(props.plan.revision),
          body: JSON.stringify({ sets: sets.value, reps: { min: repsMin.value, max: repsMax.value } }),
        },
      ),
    onSuccess: async () => {
      update.disable();

      await router.invalidate({ filter: (route) => route.id === planRoute.id, sync: true });
    },
  });

  if (update.off) {
    return (
      <button
        data-color="neutral-300"
        data-cursor="pointer"
        data-fs="sm"
        data-hover-color="neutral-0"
        onClick={update.enable}
        title={t("plan.section.exercise.update.cta")}
        type="button"
        {...update.props.controller}
      >
        <SetsReps {...props.exerciseInstruction} />
      </button>
    );
  }

  return (
    <form
      data-cross="end"
      data-gap="1"
      data-stack="y"
      onSubmit={mutation.handleSubmit}
      {...update.props.target}
    >
      <div data-cross="center" data-gap="2" data-stack="x">
        <input
          aria-label={t("plan.section.exercise.add.sets.label")}
          className="c-input"
          type="number"
          {...Form.sets.pattern}
          {...sets.input.props}
          {...bg.Rhythm().times(5).style.width}
        />

        <div data-color="neutral-400">×</div>

        <input
          aria-label={t("plan.section.exercise.add.reps.label")}
          className="c-input"
          type="number"
          {...Form.repsMin.pattern}
          {...repsMin.input.props}
          {...bg.Rhythm().times(5).style.width}
        />

        <div data-color="neutral-400">-</div>

        <input
          aria-label={t("plan.section.exercise.add.reps.max.label")}
          className="c-input"
          type="number"
          {...Form.repsMax.pattern}
          min={repsMin.value}
          {...repsMax.input.props}
          {...bg.Rhythm().times(5).style.width}
        />

        <button className="c-button" data-variant="secondary" disabled={mutation.isLoading} type="submit">
          {t("app.save")}
        </button>

        <ButtonCancel
          onClick={bg.exec([sets.clear, repsMin.clear, repsMax.clear, mutation.reset, update.disable])}
        />
      </div>

      {mutation.isError && (
        <output data-color="danger-400" data-fs="sm">
          {t("plan.section.exercise.update.error")}
        </output>
      )}
    </form>
  );
}
