import type * as tools from "@bgord/tools";
import type * as Exercises from "+exercises";
import type * as Workouts from "+workouts";
import type * as VO from "+statistics/value-objects";

type ExercisePerformanceSet = Workouts.Queries.ExercisePerformance["sets"][number];

export type WeightedExercisePerformanceStatisticsSet = ExercisePerformanceSet & {
  estimate: VO.OneRepMaxEstimateType;
};

export type WeightedExercisePerformanceStatistics = {
  resistance: Exercises.VO.ExerciseResistanceOptions.weighted;
  laterality: Workouts.VO.WorkoutExerciseLateralityType;
  workoutId: Workouts.VO.WorkoutIdType;
  scheduledFor: tools.DayIsoIdType;
  sets: Array<WeightedExercisePerformanceStatisticsSet>;
  volume: tools.WeightGramsType;
  bestSet: WeightedExercisePerformanceStatisticsSet;
  bestEstimate: VO.OneRepMaxEstimateType;
};

export type BodyweightExercisePerformanceStatistics = {
  resistance: Exercises.VO.ExerciseResistanceOptions.bodyweight;
  laterality: Workouts.VO.WorkoutExerciseLateralityType;
  workoutId: Workouts.VO.WorkoutIdType;
  scheduledFor: tools.DayIsoIdType;
  sets: Array<ExercisePerformanceSet>;
  bestSet: ExercisePerformanceSet;
  totalReps: tools.IntegerPositiveType;
};

export type ExercisePerformanceStatistics =
  | WeightedExercisePerformanceStatistics
  | BodyweightExercisePerformanceStatistics;
