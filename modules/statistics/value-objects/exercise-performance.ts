import type * as tools from "@bgord/tools";
import type * as Workouts from "+workouts";
import type * as VO from "+statistics/value-objects";

export type ExercisePerformance = {
  workoutId: Workouts.VO.WorkoutIdType;
  performedAt: tools.TimestampValueType;
  sets: Array<{
    setNumber: Workouts.VO.SetNumberType;
    reps: Workouts.VO.RepsType;
    load: Workouts.VO.LoadType;
    estimate: VO.OneRepMaxEstimateType;
  }>;
  volume: tools.WeightGramsType;
  bestEstimate: VO.OneRepMaxEstimateType;
};
