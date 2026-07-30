import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Auth from "+auth";
import * as VO from "+plans/value-objects";

export const PLAN_RENAMED_EVENT = "PLAN_RENAMED_EVENT";

export const PlanRenamedEvent = v.object({
  ...bg.EventEnvelopeSchema,
  name: v.literal(PLAN_RENAMED_EVENT),
  payload: v.object({ planId: VO.PlanId, planName: VO.PlanName, userId: Auth.VO.UserId }),
});

export type PlanRenamedEventType = v.InferOutput<typeof PlanRenamedEvent>;
