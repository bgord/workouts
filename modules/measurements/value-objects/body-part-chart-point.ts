import type { BodyPartMeasuredOnType } from "./body-part-measured-on";
import type { BodyPartMeasurementValueType } from "./body-part-measurement-value";

export type BodyPartChartPoint = {
  from: BodyPartMeasuredOnType;
  to: BodyPartMeasuredOnType;
  value: BodyPartMeasurementValueType;
  count: number;
};
