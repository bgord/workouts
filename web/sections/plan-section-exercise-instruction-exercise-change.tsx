import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Form } from "../../app/services/plan-section-exercise-instruction-add-form";
import type {
  ExerciseInstructionWithExercise,
  Plan,
  PlanSectionWithExercises,
} from "../../modules/plans/value-objects/plan";
import { ButtonCancel, Select } from "../components";
import { planRoute } from "../router";

export function PlanSectionExerciseInstructionExerciseChange(props: {
  plan: Plan;
  section: PlanSectionWithExercises;
  exerciseInstruction: ExerciseInstructionWithExercise;
  toggle: bg.UseToggleReturnType;
}) {
  const t = bg.useTranslations();
  const router = useRouter();
  const { exercises } = planRoute.useLoaderData();
  const change = props.toggle;

  const exerciseId = bg.useTextField({
    name: `${Form.exerciseId.field.name}-${props.exerciseInstruction.id}`,
    defaultValue: props.exerciseInstruction.exercise.id,
  });

  const mutation = bg.useMutation({
    perform: () =>
      fetch(
        `/api/plans/${props.plan.id}/section/${props.section.id}/exercise-instruction/${props.exerciseInstruction.id}/exercise`,
        {
          method: "PATCH",
          credentials: "include",
          headers: bg.WeakETag.fromRevision(props.plan.revision),
          body: JSON.stringify({ exerciseId: exerciseId.value }),
        },
      ),
    onSuccess: async () => {
      change.disable();

      await router.invalidate({ filter: (route) => route.id === planRoute.id, sync: true });
    },
  });

  if (change.off) {
    return (
      <button
        className="c-button"
        data-variant="bare"
        onClick={change.enable}
        title={t("plan.section.exercise.change.title", { name: props.exerciseInstruction.exercise.name })}
        type="button"
        {...change.props.controller}
      >
        {t("plan.section.exercise.change.cta")}
      </button>
    );
  }

  return (
    <form
      data-cross="center"
      data-gap="2"
      data-ml="auto"
      data-stack="x"
      onSubmit={mutation.handleSubmit}
      {...change.props.target}
    >
      <Select aria-label={t("plan.section.exercise.add.exercise.label")} {...exerciseId.input.props}>
        {exercises.map((exercise) => (
          <option key={exercise.id} value={exercise.id}>
            {exercise.name}
          </option>
        ))}
      </Select>

      <button className="c-button" data-variant="secondary" disabled={mutation.isLoading} type="submit">
        {t("app.save")}
      </button>

      <ButtonCancel onClick={bg.exec([exerciseId.clear, mutation.reset, change.disable])} />

      {mutation.isError && (
        <output data-color="danger-400" data-fs="sm">
          {t("plan.section.exercise.change.error")}
        </output>
      )}
    </form>
  );
}
