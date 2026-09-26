import * as bg from "@bgord/bun";
import * as v from "valibot";

// Stryker disable next-line StringLiteral
export const BodyPartMeasurementId = v.pipe(bg.UUID, v.brand("BodyPartMeasurementId"));
export type BodyPartMeasurementIdType = v.InferOutput<typeof BodyPartMeasurementId>;
