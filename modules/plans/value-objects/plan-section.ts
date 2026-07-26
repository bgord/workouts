import type { ExerciseInstructionType } from "./exercise-instruction";
import type { PlanSectionIdType } from "./plan-section-id";
import type { PlanSectionNameType } from "./plan-section-name";

export type PlanSection = {
  id: PlanSectionIdType;
  name: PlanSectionNameType;
  exerciseInstructions: Array<ExerciseInstructionType>;
};
