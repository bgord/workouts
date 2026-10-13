import type * as tools from "@bgord/tools";
import type * as Exercises from "+exercises";
import type * as Aggregates from "+plans/aggregates";
import type { ExerciseInstructionType } from "./exercise-instruction";
import type { ExerciseInstructionPositionType } from "./exercise-instruction-position";
import type { PlanNameType } from "./plan-name";
import type { PlanSectionNameType } from "./plan-section-name";

export type PlanHistoryEntryDetails = {
  planName?: PlanNameType;
  sectionName?: PlanSectionNameType;
  exerciseName?: Exercises.VO.ExerciseNameType | null;
  prescription?: Omit<ExerciseInstructionType, "id" | "exerciseId">;
  position?: ExerciseInstructionPositionType;
  text?: string | null;
};

export type PlanHistoryEntry = {
  name: Aggregates.PlanEventType["name"];
  details: PlanHistoryEntryDetails;
  sequence: tools.IntegerNonNegativeType;
  createdAt: tools.TimestampValueType;
};

export type PlanHistoryPage = {
  entries: ReadonlyArray<PlanHistoryEntry>;
  next: tools.IntegerNonNegativeType | null;
};

export type PlanHistoryPageConfig = {
  before?: tools.IntegerNonNegativeType;
  limit: tools.IntegerPositiveType;
};
