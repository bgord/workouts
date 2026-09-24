import type * as tools from "@bgord/tools";
import type * as Auth from "+auth";
import type * as VO from "+measurements/value-objects";

export interface ListBodyWeightMeasurementsForMonth {
  execute(
    userId: Auth.VO.UserIdType,
    month: tools.MonthIsoIdType,
  ): Promise<{
    measurements: ReadonlyArray<VO.BodyWeightMeasurement>;
    previous: VO.BodyWeightMeasurement | null;
  }>;
}
