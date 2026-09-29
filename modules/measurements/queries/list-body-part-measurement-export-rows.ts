import type * as Auth from "+auth";
import type * as VO from "+measurements/value-objects";

export type BodyPartMeasurementExportRow = {
  id: VO.BodyPartMeasurementIdType;
  bodyPartName: VO.BodyPartNameType;
  value: VO.BodyPartCircumferenceType;
  measuredOn: VO.BodyPartMeasuredOnType;
};

export interface ListBodyPartMeasurementExportRows {
  execute(userId: Auth.VO.UserIdType): Promise<ReadonlyArray<BodyPartMeasurementExportRow>>;
}
