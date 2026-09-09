// cSpell:ignore brzycki
import * as tools from "@bgord/tools";
import * as v from "valibot";
import type * as Ports from "+statistics/ports";
import * as VO from "+statistics/value-objects";

export class OneRepEstimatorBrzycki implements Ports.OneRepEstimatorPort {
  private readonly rounding = new tools.RoundingToNearestStrategy();

  estimate(set: Ports.OneRepEstimatorSetType): VO.OneRepMaxEstimateType {
    return v.parse(VO.OneRepMaxEstimate, this.rounding.round((set.load * 36) / (37 - set.reps)));
  }
}
