import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Auth from "+auth";
import { BodyPartId } from "../value-objects/body-part-id";
import { BodyPartName } from "../value-objects/body-part-name";

// Stryker disable next-line StringLiteral
export const BODY_PART_DEFINE_COMMAND = "BODY_PART_DEFINE_COMMAND";

export const BodyPartDefineCommand = v.object({
  ...bg.CommandEnvelopeSchema,
  name: v.literal(BODY_PART_DEFINE_COMMAND),
  payload: v.object({
    id: BodyPartId,
    name: BodyPartName,
    userId: Auth.VO.UserId,
  }),
});

export type BodyPartDefineCommandType = v.InferOutput<typeof BodyPartDefineCommand>;
