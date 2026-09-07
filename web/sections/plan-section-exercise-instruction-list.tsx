import { useTranslations } from "@bgord/ui";
import type { Plan, PlanSectionWithExercises } from "../../modules/plans/value-objects/plan";
import { PlanStatusEnum } from "../../modules/plans/value-objects/plan-status";
import { PlanSectionExerciseInstructionRow } from "./plan-section-exercise-instruction-row";

export function PlanSectionExerciseInstructionList(props: { plan: Plan; section: PlanSectionWithExercises }) {
  const t = useTranslations();

  const editable = props.plan.status === PlanStatusEnum.draft;

  if (props.section.exerciseInstructions.length === 0) {
    return (
      <div data-color="neutral-400" data-fs="sm">
        {t("plan.section.exercise.list.empty")}
      </div>
    );
  }

  return (
    <ul
      data-bct="alpha-subtle"
      data-bst="solid"
      data-bwt="hairline"
      data-gap="2"
      data-pt="3"
      data-stack="y"
      data-width="100%"
    >
      {props.section.exerciseInstructions.map((exerciseInstruction) => (
        <PlanSectionExerciseInstructionRow
          editable={editable}
          exerciseInstruction={exerciseInstruction}
          key={exerciseInstruction.id}
          plan={props.plan}
          section={props.section}
        />
      ))}
    </ul>
  );
}
