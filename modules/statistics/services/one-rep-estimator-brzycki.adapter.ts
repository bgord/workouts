// cSpell:ignore brzycki
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Statistics from "+statistics";

export class OneRepEstimatorBrzycki implements Statistics.Ports.OneRepEstimatorPort {
  private readonly rounding = new tools.RoundingToNearestStrategy();

  estimate(set: Statistics.Ports.OneRepEstimatorSetType): Statistics.VO.OneRepMaxEstimateType {
    return v.parse(Statistics.VO.OneRepMaxEstimate, this.rounding.round((set.load * 36) / (37 - set.reps)));
  }
}
