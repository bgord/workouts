import type * as tools from "@bgord/tools";
import type * as Exercises from "+exercises";
import type { ExerciseInstructionIdType } from "./exercise-instruction-id";
import type { PlanIdType } from "./plan-id";
import type { PlanNameType } from "./plan-name";
import type { PlanSectionIdType } from "./plan-section-id";
import type { PlanSectionNameType } from "./plan-section-name";
import type { PlanStatusEnum } from "./plan-status";
import type { RepsType } from "./reps";
import type { SetsType } from "./sets";

export type ExerciseInstructionWithExercise = {
  id: ExerciseInstructionIdType;
  exercise: Exercises.VO.Exercise;
  sets: SetsType;
  reps: RepsType;
};

export type PlanSectionWithExercises = {
  id: PlanSectionIdType;
  name: PlanSectionNameType;
  exerciseInstructions: Array<ExerciseInstructionWithExercise>;
};

export type Plan = {
  id: PlanIdType;
  name: PlanNameType;
  status: PlanStatusEnum;
  revision: tools.RevisionValueType;
  updatedAt: tools.TimestampValueType;
  sections: Array<PlanSectionWithExercises>;
};
