import type * as tools from "@bgord/tools";
import type * as Exercises from "+exercises";
import type * as Workouts from "+workouts";
import type { Comparison } from "./comparison";

export enum WeeklySummarySectionKinds {
  numbers = "numbers",
  highlights = "highlights",
  bodyWeight = "body_weight",
}

export type WeeklySummaryNumbers = {
  workouts: tools.IntegerNonNegativeType;
  sets: tools.IntegerNonNegativeType;
  volume: tools.WeightGramsType;
};

export type WeeklySummaryHighlight = {
  exerciseId: Exercises.VO.ExerciseIdType;
  exerciseName: Exercises.VO.ExerciseNameType;
  previous: Workouts.VO.ExerciseTargetType;
  current: Workouts.VO.ExerciseTargetType;
};

export type WeeklySummaryNumbersSection = {
  kind: WeeklySummarySectionKinds.numbers;
  workouts: Comparison<tools.IntegerNonNegativeType>;
  sets: Comparison<tools.IntegerNonNegativeType>;
  volume: Comparison<tools.WeightGramsType>;
};

export type WeeklySummaryHighlightsSection = {
  kind: WeeklySummarySectionKinds.highlights;
  rows: ReadonlyArray<WeeklySummaryHighlight>;
};

export type WeeklySummaryBodyWeightSection = {
  kind: WeeklySummarySectionKinds.bodyWeight;
  average: Comparison;
  count: tools.IntegerPositiveType;
};

export type WeeklySummarySection =
  | WeeklySummaryNumbersSection
  | WeeklySummaryHighlightsSection
  | WeeklySummaryBodyWeightSection;

export type WeeklySummary = {
  weekIsoId: tools.WeekIsoIdType;
  sections: ReadonlyArray<WeeklySummarySection>;
};
