import type * as Auth from "+auth";
import type { BodyWeightType } from "./body-weight";
import type { BodyWeightMeasuredOnType } from "./body-weight-measured-on";
import type { BodyWeightMeasurementIdType } from "./body-weight-measurement-id";

export type BodyWeightMeasurement = {
  id: BodyWeightMeasurementIdType;
  weight: BodyWeightType;
  measuredOn: BodyWeightMeasuredOnType;
  userId: Auth.VO.UserIdType;
};
