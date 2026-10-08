import type * as tools from "@bgord/tools";
import type * as Exercises from "+exercises";
import type { ExerciseInstructionIdType } from "./exercise-instruction-id";
import type { PlanDescriptionType } from "./plan-description";
import type { PlanIdType } from "./plan-id";
import type { PlanNameType } from "./plan-name";
import type { PlanSectionCooldownType } from "./plan-section-cooldown";
import type { PlanSectionIdType } from "./plan-section-id";
import type { PlanSectionNameType } from "./plan-section-name";
import type { PlanSectionWarmupType } from "./plan-section-warmup";
import type { PlanStatusEnum } from "./plan-status";
import type { ProgressionMethodType } from "./progression-method";
import type { RepsRangeType } from "./reps-range";
import type { RirTargetType } from "./rir-target";
import type { SetsType } from "./sets";

export type ExerciseInstructionSnapshot = {
  id: ExerciseInstructionIdType;
  exercise: Exercises.VO.Exercise;
  sets: SetsType;
  reps: RepsRangeType;
  progression: ProgressionMethodType;
  rir: RirTargetType | null;
};

export type PlanSectionSnapshot = {
  id: PlanSectionIdType;
  name: PlanSectionNameType;
  warmup: PlanSectionWarmupType | null;
  cooldown: PlanSectionCooldownType | null;
  exerciseInstructions: Array<ExerciseInstructionSnapshot>;
};

export type PlanSnapshot = {
  id: PlanIdType;
  name: PlanNameType;
  description: PlanDescriptionType | null;
  status: PlanStatusEnum;
  revision: tools.RevisionValueType;
  updatedAt: tools.TimestampValueType;
  sections: Array<PlanSectionSnapshot>;
};
