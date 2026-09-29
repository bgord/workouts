import type * as Auth from "+auth";
import type * as VO from "+measurements/value-objects";

export type BodyPartMeasurementListResponse = { data: ReadonlyArray<VO.BodyPartMeasurementWithDelta> };

export interface ListBodyPartMeasurements {
  execute(
    userId: Auth.VO.UserIdType,
    bodyPartId: VO.BodyPartIdType,
  ): Promise<BodyPartMeasurementListResponse>;
}
