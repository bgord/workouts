import * as bg from "@bgord/ui";
import type { PlanSection } from "../../modules/plans/queries/get-plan";
import { PlanSectionExerciseInstructionRow } from "./plan-section-exercise-instruction-row";

export function PlanSectionExerciseInstructionList(props: PlanSection) {
  const t = bg.useTranslations();

  if (props.exerciseInstructions.length === 0) return null;

  return (
    <ul aria-label={t("plan.section.exercises")} data-stack="y" data-width="100%">
      {props.exerciseInstructions.map((exerciseInstruction, position) => (
        <PlanSectionExerciseInstructionRow
          exerciseInstruction={exerciseInstruction}
          key={exerciseInstruction.id}
          position={position}
          section={props}
        />
      ))}
    </ul>
  );
}
