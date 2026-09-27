import type * as Auth from "+auth";
import type { BodyPartCircumferenceType } from "./body-part-circumference";
import type { BodyPartIdType } from "./body-part-id";
import type { BodyPartMeasuredOnType } from "./body-part-measured-on";
import type { BodyPartMeasurementIdType } from "./body-part-measurement-id";

export type BodyPartMeasurement = {
  id: BodyPartMeasurementIdType;
  bodyPartId: BodyPartIdType;
  value: BodyPartCircumferenceType;
  measuredOn: BodyPartMeasuredOnType;
  userId: Auth.VO.UserIdType;
};
