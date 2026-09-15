import type { PlanGetResponse, PlanSection } from "../../modules/plans/queries/get-plan";
import { PlanSectionExerciseInstructionRow } from "./plan-section-exercise-instruction-row";

export function PlanSectionExerciseInstructionList(props: {
  plan: PlanGetResponse["data"];
  section: PlanSection;
}) {
  if (props.section.exerciseInstructions.length === 0) return null;

  return (
    <ul data-stack="y" data-width="100%">
      {props.section.exerciseInstructions.map((exerciseInstruction, position) => (
        <PlanSectionExerciseInstructionRow
          exerciseInstruction={exerciseInstruction}
          key={exerciseInstruction.id}
          plan={props.plan}
          position={position + 1}
          section={props.section}
        />
      ))}
    </ul>
  );
}
