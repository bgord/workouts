import * as tools from "@bgord/tools";
import * as v from "valibot";

// Stryker disable next-line StringLiteral
export const WorkoutScheduledFor = v.pipe(tools.DayIsoId, v.brand("WorkoutScheduledFor"));
export type WorkoutScheduledForType = v.InferOutput<typeof WorkoutScheduledFor>;
