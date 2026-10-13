import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Auth from "+auth";
import * as VO from "+measurements/value-objects";

export const DAILY_STEPS_REMOVED_EVENT = "DAILY_STEPS_REMOVED_EVENT";

export const DailyStepsRemovedEvent = v.object({
  ...bg.EventEnvelopeSchema,
  name: v.literal(DAILY_STEPS_REMOVED_EVENT),
  payload: v.object({ userId: Auth.VO.UserId, day: VO.StepsDay }),
});

export type DailyStepsRemovedEventType = v.InferOutput<typeof DailyStepsRemovedEvent>;
