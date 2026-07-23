import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Auth from "+auth";
import * as VO from "+plans/value-objects";

export const PLAN_EDITING_ENABLED_EVENT = "PLAN_EDITING_ENABLED_EVENT";

export const PlanEditingEnabledEvent = v.object({
  ...bg.EventEnvelopeSchema,
  name: v.literal(PLAN_EDITING_ENABLED_EVENT),
  payload: v.object({ planId: VO.PlanId, ownerId: Auth.VO.UserId }),
});

export type PlanEditingEnabledEventType = v.InferOutput<typeof PlanEditingEnabledEvent>;
