// cSpell:ignore brzycki
import * as v from "valibot";
import * as Ports from "+stats/ports";
import * as VO from "+stats/value-objects";

export class OneRepMaxEstimatorBrzycki implements Ports.OneRepMaxEstimatorPort {
  estimate(set: VO.PerformedSet): VO.OneRepMaxEstimateType | undefined {
    if (set.reps > Ports.ONE_REP_MAX_REPS_LIMIT) return undefined;

    return v.parse(VO.OneRepMaxEstimate, Math.round((set.load * 36) / (37 - set.reps)));
  }
}
