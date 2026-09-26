import * as tools from "@bgord/tools";
import * as v from "valibot";

// Stryker disable next-line StringLiteral
export const BodyPartMeasuredOn = v.pipe(tools.DayIsoId, v.brand("BodyPartMeasuredOn"));
export type BodyPartMeasuredOnType = v.InferOutput<typeof BodyPartMeasuredOn>;
