import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Auth from "+auth";
import { PlanId } from "../value-objects/plan-id";
import { PlanName } from "../value-objects/plan-name";

// Stryker disable next-line StringLiteral
export const PLAN_CREATE_COMMAND = "PLAN_CREATE_COMMAND";

export const PlanCreateCommand = v.object({
  ...bg.CommandEnvelopeSchema,
  name: v.literal(PLAN_CREATE_COMMAND),
  payload: v.object({ id: PlanId, name: PlanName, ownerId: Auth.VO.UserId }),
});

export type PlanCreateCommandType = v.InferOutput<typeof PlanCreateCommand>;
