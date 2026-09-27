import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Auth from "+auth";
import { BodyPartCircumference } from "../value-objects/body-part-circumference";
import { BodyPartId } from "../value-objects/body-part-id";
import { BodyPartMeasuredOn } from "../value-objects/body-part-measured-on";
import { BodyPartMeasurementId } from "../value-objects/body-part-measurement-id";

// Stryker disable next-line StringLiteral
export const BODY_PARTS_MEASURE_COMMAND = "BODY_PARTS_MEASURE_COMMAND";

export const BodyPartsMeasureCommand = v.object({
  ...bg.CommandEnvelopeSchema,
  name: v.literal(BODY_PARTS_MEASURE_COMMAND),
  payload: v.object({
    measuredOn: BodyPartMeasuredOn,
    measurements: v.array(
      v.object({ id: BodyPartMeasurementId, bodyPartId: BodyPartId, value: BodyPartCircumference }),
    ),
    userId: Auth.VO.UserId,
  }),
});

export type BodyPartsMeasureCommandType = v.InferOutput<typeof BodyPartsMeasureCommand>;
