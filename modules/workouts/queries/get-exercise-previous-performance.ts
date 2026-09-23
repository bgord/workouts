import type * as Auth from "+auth";
import type * as Exercises from "+exercises";
import type * as VO from "+workouts/value-objects";
import type { ExercisePerformance } from "./list-exercise-performances";

export type ExercisePreviousPerformanceReference = Pick<VO.Workout, "scheduledFor" | "completedAt">;

export interface GetExercisePreviousPerformance {
  execute(
    userId: Auth.VO.UserIdType,
    exerciseId: Exercises.VO.ExerciseIdType,
    reference: ExercisePreviousPerformanceReference,
  ): Promise<Pick<ExercisePerformance, "scheduledFor" | "sets"> | null>;
}
