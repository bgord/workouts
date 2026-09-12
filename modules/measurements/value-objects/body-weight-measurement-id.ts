import * as bg from "@bgord/bun";
import * as v from "valibot";

// Stryker disable next-line StringLiteral
export const BodyWeightMeasurementId = v.pipe(bg.UUID, v.brand("BodyWeightMeasurementId"));
export type BodyWeightMeasurementIdType = v.InferOutput<typeof BodyWeightMeasurementId>;
