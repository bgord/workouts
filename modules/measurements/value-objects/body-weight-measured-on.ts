import * as tools from "@bgord/tools";
import * as v from "valibot";

// Stryker disable next-line StringLiteral
export const BodyWeightMeasuredOn = v.pipe(tools.DayIsoId, v.brand("BodyWeightMeasuredOn"));
export type BodyWeightMeasuredOnType = v.InferOutput<typeof BodyWeightMeasuredOn>;
