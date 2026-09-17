import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { X } from "lucide-react";
import type {
  ExerciseInstructionWithExercise,
  Plan,
  PlanSectionWithExercises,
} from "../../modules/plans/value-objects/plan";
import * as ui from "../components";
import { planRoute } from "../router";

export function PlanSectionExerciseInstructionRemove(props: {
  plan: Plan;
  section: PlanSectionWithExercises;
  exerciseInstruction: ExerciseInstructionWithExercise;
}) {
  const t = bg.useTranslations();
  const router = useRouter();

  const mutation = bg.useMutation({
    perform: async () =>
      fetch(
        `/api/plans/${props.plan.id}/section/${props.section.id}/exercise-instruction/${props.exerciseInstruction.id}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: bg.WeakETag.fromRevision(props.plan.revision),
        },
      ),
    onSuccess: () => router.invalidate({ filter: (route) => route.id === planRoute.id, sync: true }),
  });

  return (
    <form data-cross="end" data-gap="1" data-stack="y" onSubmit={mutation.handleSubmit}>
      <ui.IconButton
        disabled={mutation.isLoading}
        title={t("plan.section.exercise.remove.title", { name: props.exerciseInstruction.exercise.name })}
        tone="danger"
        type="submit"
      >
        <X data-size="sm" />
      </ui.IconButton>

      {mutation.isError && <ui.Output>{t("plan.section.exercise.remove.error")}</ui.Output>}
    </form>
  );
}
