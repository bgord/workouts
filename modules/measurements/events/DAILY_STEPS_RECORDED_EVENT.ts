import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Auth from "+auth";
import * as VO from "+measurements/value-objects";

export const DAILY_STEPS_RECORDED_EVENT = "DAILY_STEPS_RECORDED_EVENT";

export const DailyStepsRecordedEvent = v.object({
  ...bg.EventEnvelopeSchema,
  name: v.literal(DAILY_STEPS_RECORDED_EVENT),
  payload: v.object({
    userId: Auth.VO.UserId,
    day: VO.StepsDay,
    count: VO.StepsCount,
    source: VO.StepsSource,
  }),
});

export type DailyStepsRecordedEventType = v.InferOutput<typeof DailyStepsRecordedEvent>;
