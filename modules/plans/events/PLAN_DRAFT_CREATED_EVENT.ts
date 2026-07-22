import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as VO from "+plans/value-objects";
import * as Auth from "+auth";

export const PLAN_DRAFT_CREATED_EVENT = "PLAN_DRAFT_CREATED_EVENT";

export const PlanDraftCreatedEvent = v.object({
  ...bg.EventEnvelopeSchema,
  name: v.literal(PLAN_DRAFT_CREATED_EVENT),
  payload: v.object({ id: VO.PlanId, name: VO.PlanName, ownerId: Auth.VO.UserId }),
});

export type PlanDraftCreatedEventType = v.InferOutput<typeof PlanDraftCreatedEvent>;
