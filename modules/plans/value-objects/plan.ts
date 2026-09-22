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
import type { RepsType } from "./reps";
import type { SetsType } from "./sets";

export type ExerciseInstructionWithExercise = {
  id: ExerciseInstructionIdType;
  exercise: Exercises.VO.Exercise;
  sets: SetsType;
  reps: RepsType;
  progression: ProgressionMethodType;
};

export type PlanSectionWithExercises = {
  id: PlanSectionIdType;
  name: PlanSectionNameType;
  warmup: PlanSectionWarmupType | null;
  cooldown: PlanSectionCooldownType | null;
  exerciseInstructions: Array<ExerciseInstructionWithExercise>;
};

export type Plan = {
  id: PlanIdType;
  name: PlanNameType;
  description: PlanDescriptionType | null;
  status: PlanStatusEnum;
  revision: tools.RevisionValueType;
  updatedAt: tools.TimestampValueType;
  sections: Array<PlanSectionWithExercises>;
};
