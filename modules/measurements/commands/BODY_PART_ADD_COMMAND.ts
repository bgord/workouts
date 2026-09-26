import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Auth from "+auth";
import { BodyPartId } from "../value-objects/body-part-id";
import { BodyPartName } from "../value-objects/body-part-name";

export const BODY_PART_ADD_COMMAND = "BODY_PART_ADD_COMMAND";
export const BodyPartAddCommand = v.object({
  ...bg.CommandEnvelopeSchema,
  name: v.literal(BODY_PART_ADD_COMMAND),
  payload: v.object({ id: BodyPartId, name: BodyPartName, userId: Auth.VO.UserId }),
});
export type BodyPartAddCommandType = v.InferOutput<typeof BodyPartAddCommand>;
