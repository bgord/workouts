import type * as tools from "@bgord/tools";
import type * as Auth from "+auth";
import type * as Exercises from "+exercises";
import type * as VO from "+workouts/value-objects";

export type ExercisePerformance = {
  workoutId: VO.WorkoutIdType;
  performedAt: tools.TimestampValueType;
  sets: Array<{ setNumber: VO.SetNumberType; reps: VO.RepsType; load: VO.LoadType }>;
};

export interface ListExercisePerformances {
  execute(
    userId: Auth.VO.UserIdType,
    exerciseId: Exercises.VO.ExerciseIdType,
  ): Promise<Array<ExercisePerformance>>;
}
