import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { ArrowLeftRight } from "lucide-react";
import { Form } from "../../app/services/plan-section-exercise-instruction-add-form";
import type {
  ExerciseInstructionWithExercise,
  Plan,
  PlanSectionWithExercises,
} from "../../modules/plans/value-objects/plan";
import { ButtonCancel } from "../components";
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

  const exerciseName = bg.useTextField({
    name: `${Form.exerciseName.field.name}-${props.exerciseInstruction.id}`,
  });

  const mutation = bg.useMutation({
    perform: () =>
      fetch(
        `/api/plans/${props.plan.id}/section/${props.section.id}/exercise-instruction/${props.exerciseInstruction.id}/exercise`,
        {
          method: "PATCH",
          credentials: "include",
          headers: bg.WeakETag.fromRevision(props.plan.revision),
          body: JSON.stringify({
            exerciseId: exercises.data.find((exercise) => exercise.name === exerciseName.value)?.id ?? "",
          }),
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
        aria-label={t("plan.section.exercise.change.title", {
          name: props.exerciseInstruction.exercise.name,
        })}
        className="c-button"
        data-interaction="subtle-scale"
        data-variant="icon"
        onClick={change.enable}
        title={t("plan.section.exercise.change.title", { name: props.exerciseInstruction.exercise.name })}
        type="button"
        {...change.props.controller}
      >
        <ArrowLeftRight data-size="sm" />
      </button>
    );
  }

  return (
    <form
      data-cross="center"
      data-gap="2"
      data-grow="1"
      data-stack="x"
      onSubmit={mutation.handleSubmit}
      {...change.props.target}
    >
      <input className="c-input" list="exercises" {...exerciseName.input.props} data-grow="1" />
      <datalist id="exercises">
        {exercises.data.map((exercise) => (
          <option value={exercise.name}>{exercise.name}</option>
        ))}
      </datalist>

      <div data-cross="center" data-gap="1" data-md-width="100%" data-stack="x">
        <button
          className="c-button"
          data-md-grow="1"
          data-variant="secondary"
          disabled={mutation.isLoading}
          type="submit"
        >
          {t("app.save")}
        </button>

        <ButtonCancel
          data-md-grow="1"
          onClick={bg.exec([exerciseName.clear, mutation.reset, change.disable])}
        />
      </div>

      {mutation.isError && (
        <output data-color="danger-400" data-fs="sm">
          {t("plan.section.exercise.change.error")}
        </output>
      )}
    </form>
  );
}
