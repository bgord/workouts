import type { BodyPartMeasurement } from "./body-part-measurement";

export type BodyPartStats = {
  latest: BodyPartMeasurement;
  previous?: BodyPartMeasurement;
  baseline: BodyPartMeasurement;
  week: { average: number; count: number };
  previousWeek?: { average: number };
};
