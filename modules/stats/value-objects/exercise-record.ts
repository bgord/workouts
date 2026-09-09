import type * as tools from "@bgord/tools";
import type * as Workouts from "+workouts";
import type { PerformedSet } from "./performed-set";

export type ExerciseRecord = PerformedSet & {
  workoutId: Workouts.VO.WorkoutIdType;
  completedAt: tools.TimestampValueType;
};
