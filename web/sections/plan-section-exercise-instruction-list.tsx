import type { PlanSection } from "../../modules/plans/queries/get-plan";
import { PlanSectionExerciseInstructionRow } from "./plan-section-exercise-instruction-row";

export function PlanSectionExerciseInstructionList(props: PlanSection) {
  if (props.exerciseInstructions.length === 0) return null;

  return (
    <ul data-stack="y" data-width="100%">
      {props.exerciseInstructions.map((exerciseInstruction, position) => (
        <PlanSectionExerciseInstructionRow
          exerciseInstruction={exerciseInstruction}
          key={exerciseInstruction.id}
          position={position + 1}
          section={props}
        />
      ))}
    </ul>
  );
}
