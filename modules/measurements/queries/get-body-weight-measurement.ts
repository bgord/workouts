import type * as VO from "+measurements/value-objects";

export interface GetBodyWeightMeasurement {
  execute(id: VO.BodyWeightMeasurementIdType): Promise<VO.BodyWeightMeasurement | null>;
}
