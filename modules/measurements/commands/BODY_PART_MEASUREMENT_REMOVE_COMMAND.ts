import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Auth from "+auth";
import { BodyPartMeasurementId } from "../value-objects/body-part-measurement-id";

export const BODY_PART_MEASUREMENT_REMOVE_COMMAND = "BODY_PART_MEASUREMENT_REMOVE_COMMAND";
export const BodyPartMeasurementRemoveCommand = v.object({
  ...bg.CommandEnvelopeSchema,
  name: v.literal(BODY_PART_MEASUREMENT_REMOVE_COMMAND),
  payload: v.object({ id: BodyPartMeasurementId, requesterId: Auth.VO.UserId }),
});
export type BodyPartMeasurementRemoveCommandType = v.InferOutput<typeof BodyPartMeasurementRemoveCommand>;
