import type * as tools from "@bgord/tools";
import type * as Exercises from "+exercises";
import type * as Workouts from "+workouts";
import type * as VO from "+statistics/value-objects";

export type ExercisePerformanceStatisticsSet = {
  setNumber: Workouts.VO.SetNumberType;
  reps: Workouts.VO.RepsType;
  load: Workouts.VO.LoadType;
  rir: Workouts.VO.RirType | null;
  estimate: VO.OneRepMaxEstimateType;
};

type LoadPerformanceStatistics = {
  workoutId: Workouts.VO.WorkoutIdType;
  scheduledFor: tools.DayIsoIdType;
  sets: Array<ExercisePerformanceStatisticsSet>;
  volume: tools.WeightGramsType;
  bestSet: ExercisePerformanceStatisticsSet;
  bestEstimate: VO.OneRepMaxEstimateType;
};

export type RepsPerformanceStatisticsSet = Omit<ExercisePerformanceStatisticsSet, "estimate">;

export type RepsPerformanceStatistics = {
  workoutId: Workouts.VO.WorkoutIdType;
  scheduledFor: tools.DayIsoIdType;
  sets: Array<RepsPerformanceStatisticsSet>;
  bestSet: RepsPerformanceStatisticsSet;
  totalReps: tools.IntegerPositiveType;
};

export type ExercisePerformanceStatistics = {
  loading: Exercises.VO.ExerciseLoadingOptions.external;
} & LoadPerformanceStatistics;
