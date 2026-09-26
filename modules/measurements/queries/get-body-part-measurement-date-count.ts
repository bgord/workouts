import type * as Auth from "+auth";
import type * as VO from "+measurements/value-objects";

export interface GetBodyPartMeasurementDateCount {
  execute(
    userId: Auth.VO.UserIdType,
    bodyPartId: VO.BodyPartIdType,
    measuredOn: VO.BodyPartMeasuredOnType,
    exceptId?: VO.BodyPartMeasurementIdType,
  ): Promise<number>;
}
