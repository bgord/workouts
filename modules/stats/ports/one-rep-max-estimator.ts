import type * as VO from "+stats/value-objects";

export const ONE_REP_MAX_REPS_LIMIT = 20;

export interface OneRepMaxEstimatorPort {
  estimate(set: VO.PerformedSet): VO.OneRepMaxEstimateType | undefined;
}
