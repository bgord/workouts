// cSpell:ignore epley
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Statistics from "+statistics";

export class OneRepEstimatorEpley implements Statistics.Ports.OneRepEstimatorPort {
  private readonly rounding = new tools.RoundingToNearestStrategy();

  estimate(set: Statistics.Ports.OneRepEstimatorSetType): Statistics.VO.OneRepMaxEstimateType {
    if (set.reps === 1) return v.parse(Statistics.VO.OneRepMaxEstimate, set.load);

    return v.parse(Statistics.VO.OneRepMaxEstimate, this.rounding.round(set.load * (1 + set.reps / 30)));
  }
}
