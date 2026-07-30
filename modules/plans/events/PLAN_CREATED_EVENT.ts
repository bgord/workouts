import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Auth from "+auth";
import * as VO from "+plans/value-objects";

export const PLAN_CREATED_EVENT = "PLAN_CREATED_EVENT";

export const PlanCreatedEvent = v.object({
  ...bg.EventEnvelopeSchema,
  name: v.literal(PLAN_CREATED_EVENT),
  payload: v.object({ planId: VO.PlanId, planName: VO.PlanName, userId: Auth.VO.UserId }),
});

export type PlanCreatedEventType = v.InferOutput<typeof PlanCreatedEvent>;
