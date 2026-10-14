import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Auth from "+auth";
import { DailyStepsDay } from "../value-objects/daily-steps-day";
import { StepsCount } from "../value-objects/steps-count";
import { StepsSource } from "../value-objects/steps-source";

// Stryker disable next-line StringLiteral
export const DAILY_STEPS_RECORD_COMMAND = "DAILY_STEPS_RECORD_COMMAND";

export const DailyStepsRecordCommand = v.object({
  ...bg.CommandEnvelopeSchema,
  name: v.literal(DAILY_STEPS_RECORD_COMMAND),
  payload: v.object({
    userId: Auth.VO.UserId,
    day: DailyStepsDay,
    count: StepsCount,
    source: StepsSource,
  }),
});

export type DailyStepsRecordCommandType = v.InferOutput<typeof DailyStepsRecordCommand>;
