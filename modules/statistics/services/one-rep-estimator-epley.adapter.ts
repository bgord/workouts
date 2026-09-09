// cSpell:ignore epley
import type * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Statistics from "+statistics";

type OneRepEstimatorEpleyConfig = { rounding: tools.RoundingStrategy };

export class OneRepEstimatorEpley implements Statistics.Ports.OneRepEstimatorPort {
  constructor(private readonly config: OneRepEstimatorEpleyConfig) {}

  estimate(set: Statistics.Ports.OneRepEstimatorSetType): Statistics.VO.OneRepMaxEstimateType {
    if (set.reps === 1) return v.parse(Statistics.VO.OneRepMaxEstimate, set.load);

    return v.parse(
      Statistics.VO.OneRepMaxEstimate,
      this.config.rounding.round(set.load * (1 + set.reps / 30)),
    );
  }
}
