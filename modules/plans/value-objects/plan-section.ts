import type { ExerciseInstructionType } from "./exercise-instruction";
import type { PlanSectionCooldownType } from "./plan-section-cooldown";
import type { PlanSectionIdType } from "./plan-section-id";
import type { PlanSectionNameType } from "./plan-section-name";
import type { PlanSectionWarmupType } from "./plan-section-warmup";

export type PlanSection = {
  id: PlanSectionIdType;
  name: PlanSectionNameType;
  warmup?: PlanSectionWarmupType;
  cooldown?: PlanSectionCooldownType;
  exerciseInstructions: Array<ExerciseInstructionType>;
};
