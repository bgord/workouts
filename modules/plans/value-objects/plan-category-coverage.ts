import type * as Exercises from "+exercises";

export type PlanCategoryCoverageEntry = {
  category: Exercises.VO.ExerciseCategory;
  primarySets: number;
  secondarySets: number;
  total: number;
  primaryShare: number;
  secondaryShare: number;
};

export type PlanCategoryCoverage = ReadonlyArray<PlanCategoryCoverageEntry>;
