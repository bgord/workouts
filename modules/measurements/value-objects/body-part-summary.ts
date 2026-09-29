import type { BodyPart } from "./body-part";
import type { BodyPartMeasurement } from "./body-part-measurement";

export const BodyPartSummarySeriesSize = 8;

export type BodyPartRecentMeasurement = Pick<
  BodyPartMeasurement,
  "id" | "bodyPartId" | "value" | "measuredOn"
>;

export type BodyPartSummaryMeasurement = Pick<BodyPartMeasurement, "id" | "value" | "measuredOn">;

export type BodyPartSeriesPoint = Pick<BodyPartMeasurement, "value" | "measuredOn">;

export type BodyPartSummary = BodyPart & {
  latest: BodyPartSummaryMeasurement | null;
  previous: BodyPartSummaryMeasurement | null;
  delta: number | null;
  series: ReadonlyArray<BodyPartSeriesPoint>;
};

export type BodyPartMeasurementWithDelta = BodyPartMeasurement & { delta: number | null };
