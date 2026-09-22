import type * as tools from "@bgord/tools";
import type * as Exercises from "+exercises";
import type * as Workouts from "+workouts";
import type { Comparison } from "./comparison";

export type WeeklySummaryNumbers = {
  workouts: tools.IntegerNonNegativeType;
  sets: tools.IntegerNonNegativeType;
  volume: tools.WeightGramsType;
};

export type WeeklySummaryNumbersComparison = {
  workouts: Comparison<tools.IntegerNonNegativeType>;
  sets: Comparison<tools.IntegerNonNegativeType>;
  volume: Comparison<tools.WeightGramsType>;
};

export type WeeklySummaryHighlight = {
  exerciseId: Exercises.VO.ExerciseIdType;
  exerciseName: Exercises.VO.ExerciseNameType;
  previous: Workouts.VO.ExerciseTargetType;
  current: Workouts.VO.ExerciseTargetType;
};

export type WeeklySummaryBodyWeight = {
  average: Comparison;
  count: tools.IntegerPositiveType;
};

export type WeeklySummary = {
  weekIsoId: tools.WeekIsoIdType;
  numbers: WeeklySummaryNumbersComparison;
  highlights: Array<WeeklySummaryHighlight>;
  bodyWeight?: WeeklySummaryBodyWeight;
};
