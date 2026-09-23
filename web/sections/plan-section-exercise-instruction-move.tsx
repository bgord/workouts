import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { PlanExerciseInstruction, PlanSection } from "../../modules/plans/queries/get-plan";
import * as ui from "../components";
import { planRoute } from "../router";

export function PlanSectionExerciseInstructionMove(props: {
  section: PlanSection;
  exerciseInstruction: PlanExerciseInstruction;
  position: number;
}) {
  const t = bg.useTranslations();
  const router = useRouter();
  const { plan } = planRoute.useLoaderData();

  const move = (position: number) =>
    fetch(
      `/api/plans/${plan.data.id}/section/${props.section.id}/exercise-instruction/${props.exerciseInstruction.id}/position`,
      {
        method: "PATCH",
        credentials: "include",
        headers: bg.WeakETag.fromRevision(plan.data.revision),
        body: JSON.stringify({ position }),
      },
    );

  const up = bg.useMutation({
    perform: () => move(props.position - 1),
    onSuccess: () => router.invalidate({ filter: (route) => route.id === planRoute.id, sync: true }),
  });
  const down = bg.useMutation({
    perform: () => move(props.position + 1),
    onSuccess: () => router.invalidate({ filter: (route) => route.id === planRoute.id, sync: true }),
  });

  if (!props.exerciseInstruction.actions.moveUp.available) {
    return <ui.RowIndex>{props.position + 1}</ui.RowIndex>;
  }

  const busy = up.isLoading || down.isLoading;

  return (
    <div data-cross="center" data-shrink="0" data-stack="y">
      <ui.IconButton
        aria-label={t("plan.section.exercise.move.up.title", {
          name: props.exerciseInstruction.exercise.name,
        })}
        data-width="auto"
        disabled={!props.exerciseInstruction.actions.moveUp.enabled || busy}
        onClick={() => up.mutate()}
        title={t("plan.section.exercise.move.up.title", { name: props.exerciseInstruction.exercise.name })}
        {...bg.Rhythm().times(2).style.height}
      >
        <ChevronUp data-size="sm" />
      </ui.IconButton>

      <ui.RowIndex>{props.position + 1}</ui.RowIndex>

      <ui.IconButton
        aria-label={t("plan.section.exercise.move.down.title", {
          name: props.exerciseInstruction.exercise.name,
        })}
        data-width="auto"
        disabled={!props.exerciseInstruction.actions.moveDown.enabled || busy}
        onClick={() => down.mutate()}
        title={t("plan.section.exercise.move.down.title", { name: props.exerciseInstruction.exercise.name })}
        {...bg.Rhythm().times(2).style.height}
      >
        <ChevronDown data-size="sm" />
      </ui.IconButton>

      {(up.isError || down.isError) && <ui.Output>{t("plan.section.exercise.move.error")}</ui.Output>}
    </div>
  );
}
