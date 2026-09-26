import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Auth from "+auth";
import { BodyPartId } from "../value-objects/body-part-id";
import { BodyPartName } from "../value-objects/body-part-name";

export const BODY_PART_RENAME_COMMAND = "BODY_PART_RENAME_COMMAND";
export const BodyPartRenameCommand = v.object({
  ...bg.CommandEnvelopeSchema,
  name: v.literal(BODY_PART_RENAME_COMMAND),
  payload: v.object({ id: BodyPartId, name: BodyPartName, requesterId: Auth.VO.UserId }),
});
export type BodyPartRenameCommandType = v.InferOutput<typeof BodyPartRenameCommand>;
