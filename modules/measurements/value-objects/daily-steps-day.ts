import * as tools from "@bgord/tools";
import * as v from "valibot";

// Stryker disable next-line StringLiteral
export const DailyStepsDay = v.pipe(tools.DayIsoId, v.brand("DailyStepsDay"));
export type DailyStepsDayType = v.InferOutput<typeof DailyStepsDay>;
