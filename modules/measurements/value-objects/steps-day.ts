import * as tools from "@bgord/tools";
import * as v from "valibot";

// Stryker disable next-line StringLiteral
export const StepsDay = v.pipe(tools.DayIsoId, v.brand("StepsDay"));
export type StepsDayType = v.InferOutput<typeof StepsDay>;
