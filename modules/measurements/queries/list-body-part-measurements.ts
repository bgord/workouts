import type * as Auth from "+auth";
import type * as VO from "+measurements/value-objects";

export interface ListBodyPartMeasurements {
  execute(
    userId: Auth.VO.UserIdType,
    bodyPartId: VO.BodyPartIdType,
  ): Promise<ReadonlyArray<VO.BodyPartMeasurement>>;
}
