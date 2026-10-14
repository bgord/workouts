import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Auth from "+auth";
import * as VO from "+measurements/value-objects";

export const DAILY_STEPS_GOAL_SET_EVENT = "DAILY_STEPS_GOAL_SET_EVENT";

export const DailyStepsGoalSetEvent = v.object({
  ...bg.EventEnvelopeSchema,
  name: v.literal(DAILY_STEPS_GOAL_SET_EVENT),
  payload: v.object({ userId: Auth.VO.UserId, goal: VO.StepsCount }),
});

export type DailyStepsGoalSetEventType = v.InferOutput<typeof DailyStepsGoalSetEvent>;
