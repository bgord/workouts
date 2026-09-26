import * as bg from "@bgord/bun";
import * as v from "valibot";

export const BodyPartMeasurementId = v.pipe(bg.UUID, v.brand("BodyPartMeasurementId"));
export type BodyPartMeasurementIdType = v.InferOutput<typeof BodyPartMeasurementId>;
