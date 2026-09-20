import type { ExerciseInstructionType } from "./exercise-instruction";
import type { PlanSectionIdType } from "./plan-section-id";
import type { PlanSectionNameType } from "./plan-section-name";
import type { PlanSectionWarmupType } from "./plan-section-warmup";

export type PlanSection = {
  id: PlanSectionIdType;
  name: PlanSectionNameType;
  warmup?: PlanSectionWarmupType;
  exerciseInstructions: Array<ExerciseInstructionType>;
};
