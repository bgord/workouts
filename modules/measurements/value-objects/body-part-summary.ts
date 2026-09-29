import type { BodyPart } from "./body-part";
import type { BodyPartMeasurement } from "./body-part-measurement";

export type BodyPartSummaryMeasurement = Omit<BodyPartMeasurement, "userId">;

export type BodyPartSummary = BodyPart & { measurements: ReadonlyArray<BodyPartSummaryMeasurement> };
