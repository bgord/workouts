import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Auth from "+auth";
import { PlanId } from "../value-objects/plan-id";
import { PlanName } from "../value-objects/plan-name";

// Stryker disable next-line StringLiteral
export const PLAN_DRAFT_CREATE_COMMAND = "PLAN_DRAFT_CREATE_COMMAND";

export const PlanDraftCreateCommand = v.object({
  ...bg.CommandEnvelopeSchema,
  name: v.literal(PLAN_DRAFT_CREATE_COMMAND),
  payload: v.object({ id: PlanId, name: PlanName, ownerId: Auth.VO.UserId }),
});

export type PlanDraftCreateCommandType = v.InferOutput<typeof PlanDraftCreateCommand>;
