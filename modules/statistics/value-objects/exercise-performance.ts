import type * as tools from "@bgord/tools";
import type * as Workouts from "+workouts";
import type * as VO from "+statistics/value-objects";

export type ExercisePerformanceSet = {
  setNumber: Workouts.VO.SetNumberType;
  reps: Workouts.VO.RepsType;
  load: Workouts.VO.LoadType;
  rir?: Workouts.VO.RirType;
  estimate: VO.OneRepMaxEstimateType;
};

export type ExercisePerformance = {
  workoutId: Workouts.VO.WorkoutIdType;
  scheduledFor: tools.DayIsoIdType;
  sets: Array<ExercisePerformanceSet>;
  volume: tools.WeightGramsType;
  bestSet: ExercisePerformanceSet;
  bestEstimate: VO.OneRepMaxEstimateType;
};
