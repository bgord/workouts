import type { BodyWeightMeasurement } from "./body-weight-measurement";

export type BodyWeightStats = {
  latest: BodyWeightMeasurement;
  previous?: BodyWeightMeasurement;
  reference?: BodyWeightMeasurement;
  baseline: BodyWeightMeasurement;
  week: { average: number; count: number };
  previousWeek?: { average: number };
};
