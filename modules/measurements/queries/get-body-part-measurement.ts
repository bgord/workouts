import type * as VO from "+measurements/value-objects";

export interface GetBodyPartMeasurement {
  execute(id: VO.BodyPartMeasurementIdType): Promise<VO.BodyPartMeasurement | null>;
}
