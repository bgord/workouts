import type * as tools from "@bgord/tools";
import type * as Exercises from "+exercises";

export type PlanCategoryCoverageEntry = {
  category: Exercises.VO.ExerciseCategory;
  primarySets: tools.IntegerNonNegativeType;
  secondarySets: tools.IntegerNonNegativeType;
  total: number;
  primaryShare: number;
  secondaryShare: number;
};

export type PlanCategoryCoverage = ReadonlyArray<PlanCategoryCoverageEntry>;
