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

type WeightedPerformanceStatistics = {
  workoutId: Workouts.VO.WorkoutIdType;
  scheduledFor: tools.DayIsoIdType;
  sets: Array<ExercisePerformanceStatisticsSet>;
  volume: tools.WeightGramsType;
  bestSet: ExercisePerformanceStatisticsSet;
  bestEstimate: VO.OneRepMaxEstimateType;
};

export type BodyweightPerformanceStatisticsSet = Omit<ExercisePerformanceStatisticsSet, "estimate">;

export type BodyweightPerformanceStatistics = {
  workoutId: Workouts.VO.WorkoutIdType;
  scheduledFor: tools.DayIsoIdType;
  sets: Array<BodyweightPerformanceStatisticsSet>;
  bestSet: BodyweightPerformanceStatisticsSet;
  totalReps: tools.IntegerPositiveType;
};

export type WeightedExercisePerformanceStatistics = {
  resistance: Exercises.VO.ExerciseResistanceOptions.weighted;
} & WeightedPerformanceStatistics;

export type BodyweightExercisePerformanceStatistics = {
  resistance: Exercises.VO.ExerciseResistanceOptions.bodyweight;
} & BodyweightPerformanceStatistics;

export type ExercisePerformanceStatistics =
  | WeightedExercisePerformanceStatistics
  | BodyweightExercisePerformanceStatistics;
