import type * as tools from "@bgord/tools";
import type * as Workouts from "+workouts";
import type * as VO from "+statistics/value-objects";

export type ExercisePerformanceStatisticsSet = {
  setNumber: Workouts.VO.SetNumberType;
  reps: Workouts.VO.RepsType;
  load: Workouts.VO.LoadType;
  rir: Workouts.VO.RirType | null;
  estimate: VO.OneRepMaxEstimateType;
};

export type ExercisePerformanceStatistics = {
  workoutId: Workouts.VO.WorkoutIdType;
  scheduledFor: tools.DayIsoIdType;
  sets: Array<ExercisePerformanceStatisticsSet>;
  volume: tools.WeightGramsType;
  bestSet: ExercisePerformanceStatisticsSet;
  bestEstimate: VO.OneRepMaxEstimateType;
};
