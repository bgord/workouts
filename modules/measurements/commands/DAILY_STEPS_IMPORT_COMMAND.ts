import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Auth from "+auth";
import { DailyStepsDay } from "../value-objects/daily-steps-day";
import { StepsCount } from "../value-objects/steps-count";
import { StepsSource } from "../value-objects/steps-source";

// Stryker disable next-line StringLiteral
export const DAILY_STEPS_IMPORT_COMMAND = "DAILY_STEPS_IMPORT_COMMAND";

export const DailyStepsImportCommand = v.object({
  ...bg.CommandEnvelopeSchema,
  name: v.literal(DAILY_STEPS_IMPORT_COMMAND),
  payload: v.object({
    entries: v.array(v.object({ day: DailyStepsDay, count: StepsCount, source: StepsSource })),
    userId: Auth.VO.UserId,
  }),
});

export type DailyStepsImportCommandType = v.InferOutput<typeof DailyStepsImportCommand>;
