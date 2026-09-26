import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Auth from "+auth";
import { BodyPartId } from "../value-objects/body-part-id";
import { BodyPartMeasuredOn } from "../value-objects/body-part-measured-on";
import { BodyPartMeasurementId } from "../value-objects/body-part-measurement-id";
import { BodyPartMeasurementValue } from "../value-objects/body-part-measurement-value";

export const BODY_PART_MEASUREMENT_RECORD_COMMAND = "BODY_PART_MEASUREMENT_RECORD_COMMAND";
export const BodyPartMeasurementRecordCommand = v.object({
  ...bg.CommandEnvelopeSchema,
  name: v.literal(BODY_PART_MEASUREMENT_RECORD_COMMAND),
  payload: v.object({
    id: BodyPartMeasurementId,
    bodyPartId: BodyPartId,
    valueMm: BodyPartMeasurementValue,
    measuredOn: BodyPartMeasuredOn,
    userId: Auth.VO.UserId,
  }),
});
export type BodyPartMeasurementRecordCommandType = v.InferOutput<typeof BodyPartMeasurementRecordCommand>;
