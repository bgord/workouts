import type * as tools from "@bgord/tools";
import type * as VO from "+statistics/value-objects";

export type OneRepEstimatorSetType = { reps: tools.IntegerPositiveType; load: tools.WeightGramsType };

export interface OneRepEstimatorPort {
  estimate(set: OneRepEstimatorSetType): VO.OneRepMaxEstimateType;
}
