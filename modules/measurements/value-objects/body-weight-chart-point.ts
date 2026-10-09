import type * as tools from "@bgord/tools";
import type { BodyWeightType } from "./body-weight";
import type { BodyWeightMeasuredOnType } from "./body-weight-measured-on";

export type BodyWeightChartPoint = {
  from: BodyWeightMeasuredOnType;
  to: BodyWeightMeasuredOnType;
  weight: BodyWeightType;
  count: tools.IntegerPositiveType;
  reference: boolean;
};
