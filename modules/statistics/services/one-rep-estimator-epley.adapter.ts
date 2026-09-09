// cSpell:ignore epley
import * as tools from "@bgord/tools";
import * as v from "valibot";
import type * as Ports from "+statistics/ports";
import * as VO from "+statistics/value-objects";

export class OneRepEstimatorEpley implements Ports.OneRepEstimatorPort {
  private readonly rounding = new tools.RoundingToNearestStrategy();

  estimate(set: Ports.OneRepEstimatorSetType): VO.OneRepMaxEstimateType {
    if (set.reps === 1) return v.parse(VO.OneRepMaxEstimate, set.load);

    return v.parse(VO.OneRepMaxEstimate, this.rounding.round(set.load * (1 + set.reps / 30)));
  }
}
