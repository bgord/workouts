// cSpell:ignore brzycki
import type * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Statistics from "+statistics";

type OneRepEstimatorBrzyckiConfig = { rounding: tools.RoundingStrategy };

export class OneRepEstimatorBrzycki implements Statistics.Ports.OneRepEstimatorPort {
  constructor(private readonly config: OneRepEstimatorBrzyckiConfig) {}

  estimate(set: Statistics.Ports.OneRepEstimatorSetType): Statistics.VO.OneRepMaxEstimateType {
    return v.parse(
      Statistics.VO.OneRepMaxEstimate,
      this.config.rounding.round((set.load * 36) / (37 - set.reps)),
    );
  }
}
