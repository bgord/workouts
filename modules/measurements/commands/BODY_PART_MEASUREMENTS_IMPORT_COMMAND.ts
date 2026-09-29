import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Auth from "+auth";
import { BodyPartCircumference } from "../value-objects/body-part-circumference";
import { BodyPartMeasuredOn } from "../value-objects/body-part-measured-on";
import { BodyPartMeasurementId } from "../value-objects/body-part-measurement-id";
import { BodyPartName } from "../value-objects/body-part-name";

// Stryker disable next-line StringLiteral
export const BODY_PART_MEASUREMENTS_IMPORT_COMMAND = "BODY_PART_MEASUREMENTS_IMPORT_COMMAND";

export const BodyPartMeasurementsImportCommand = v.object({
  ...bg.CommandEnvelopeSchema,
  name: v.literal(BODY_PART_MEASUREMENTS_IMPORT_COMMAND),
  payload: v.object({
    measurements: v.array(
      v.object({
        id: BodyPartMeasurementId,
        bodyPartName: BodyPartName,
        value: BodyPartCircumference,
        measuredOn: BodyPartMeasuredOn,
      }),
    ),
    userId: Auth.VO.UserId,
  }),
});

export type BodyPartMeasurementsImportCommandType = v.InferOutput<typeof BodyPartMeasurementsImportCommand>;
