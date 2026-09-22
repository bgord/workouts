import type * as tools from "@bgord/tools";
import type * as Exercises from "+exercises";
import type * as Measurements from "+measurements";
import type * as Workouts from "+workouts";

export type WeeklySummaryNumbers = {
  workouts: tools.IntegerNonNegativeType;
  sets: tools.IntegerNonNegativeType;
  volume: tools.WeightGramsType;
};

export type WeeklySummaryNumbersDelta = {
  workouts: tools.IntegerType;
  sets: tools.IntegerType;
  volume: tools.IntegerType;
};

export type WeeklySummaryHighlight = {
  exerciseId: Exercises.VO.ExerciseIdType;
  exerciseName: Exercises.VO.ExerciseNameType;
  previous: Workouts.VO.ExerciseTargetType;
  current: Workouts.VO.ExerciseTargetType;
};

export type WeeklySummaryBodyWeight = {
  average: number;
  count: tools.IntegerPositiveType;
  previousAverage?: number;
  goal?: Measurements.VO.BodyWeightGoalType;
};

export type WeeklySummary = {
  weekIsoId: tools.WeekIsoIdType;
  numbers: {
    current: WeeklySummaryNumbers;
    previous: WeeklySummaryNumbers;
    delta: WeeklySummaryNumbersDelta;
  };
  highlights: Array<WeeklySummaryHighlight>;
  bodyWeight?: WeeklySummaryBodyWeight;
};
