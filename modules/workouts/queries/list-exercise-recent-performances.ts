import type * as tools from "@bgord/tools";
import type * as Auth from "+auth";
import type * as Exercises from "+exercises";
import type * as VO from "+workouts/value-objects";
import type { ExercisePreviousPerformanceReference } from "./get-exercise-previous-performance";
import type { ExercisePerformance } from "./list-exercise-performances";

export type ExerciseRecentPerformance = Pick<ExercisePerformance, "scheduledFor" | "sets"> & {
  prescription: VO.ExercisePrescriptionType;
};

export interface ListExerciseRecentPerformances {
  execute(
    userId: Auth.VO.UserIdType,
    exerciseId: Exercises.VO.ExerciseIdType,
    reference: ExercisePreviousPerformanceReference,
    limit: tools.IntegerPositiveType,
  ): Promise<Array<ExerciseRecentPerformance>>;
}
