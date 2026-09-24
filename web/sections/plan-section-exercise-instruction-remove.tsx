import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { X } from "lucide-react";
import type { PlanExerciseInstruction, PlanSection } from "../../modules/plans/queries/get-plan";
import * as ui from "../components";
import { planRoute } from "../router";

export function PlanSectionExerciseInstructionRemove(props: {
  section: PlanSection;
  exerciseInstruction: PlanExerciseInstruction;
}) {
  const t = bg.useTranslations();
  const router = useRouter();
  const { plan } = planRoute.useLoaderData();

  const mutation = bg.useMutation({
    perform: () =>
      fetch(
        `/api/plans/${plan.data.id}/section/${props.section.id}/exercise-instruction/${props.exerciseInstruction.id}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: bg.WeakETag.fromRevision(plan.data.revision),
        },
      ),
    onSuccess: () => router.invalidate({ filter: (match) => match.routeId === planRoute.id, sync: true }),
  });

  if (!props.exerciseInstruction.actions.remove.available) return null;

  return (
    <form
      aria-busy={mutation.isLoading}
      data-cross="end"
      data-stack="y"
      onSubmit={mutation.handleSubmit}
      {...ui.Gap.inline}
    >
      <ui.IconButton
        aria-label={t("plan.section.exercise.remove.title", {
          name: props.exerciseInstruction.exercise.name,
        })}
        disabled={!props.exerciseInstruction.actions.remove.enabled || mutation.isLoading}
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
