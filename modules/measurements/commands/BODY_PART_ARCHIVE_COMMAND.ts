import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Auth from "+auth";
import { BodyPartId } from "../value-objects/body-part-id";

export const BODY_PART_ARCHIVE_COMMAND = "BODY_PART_ARCHIVE_COMMAND";
export const BodyPartArchiveCommand = v.object({
  ...bg.CommandEnvelopeSchema,
  name: v.literal(BODY_PART_ARCHIVE_COMMAND),
  payload: v.object({ id: BodyPartId, requesterId: Auth.VO.UserId }),
});
export type BodyPartArchiveCommandType = v.InferOutput<typeof BodyPartArchiveCommand>;
