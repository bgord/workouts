import type * as Auth from "+auth";
import type { BodyPartIdType } from "./body-part-id";
import type { BodyPartMeasuredOnType } from "./body-part-measured-on";
import type { BodyPartMeasurementIdType } from "./body-part-measurement-id";
import type { BodyPartMeasurementValueType } from "./body-part-measurement-value";

export type BodyPartMeasurement = {
  id: BodyPartMeasurementIdType;
  bodyPartId: BodyPartIdType;
  value: BodyPartMeasurementValueType;
  measuredOn: BodyPartMeasuredOnType;
  userId: Auth.VO.UserIdType;
};
