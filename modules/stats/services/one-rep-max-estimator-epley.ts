// cSpell:ignore epley
import * as v from "valibot";
import * as Ports from "+stats/ports";
import * as VO from "+stats/value-objects";

export class OneRepMaxEstimatorEpley implements Ports.OneRepMaxEstimatorPort {
  estimate(set: VO.PerformedSet): VO.OneRepMaxEstimateType | undefined {
    if (set.reps > Ports.ONE_REP_MAX_REPS_LIMIT) return undefined;

    if (set.reps === 1) return v.parse(VO.OneRepMaxEstimate, set.load);

    return v.parse(VO.OneRepMaxEstimate, Math.round(set.load * (1 + set.reps / 30)));
  }
}
