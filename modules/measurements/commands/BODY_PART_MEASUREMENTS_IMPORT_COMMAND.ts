import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Auth from "+auth";
import { BodyPartId } from "../value-objects/body-part-id";
import { BodyPartMeasuredOn } from "../value-objects/body-part-measured-on";
import { BodyPartMeasurementId } from "../value-objects/body-part-measurement-id";
import { BodyPartMeasurementValue } from "../value-objects/body-part-measurement-value";

// Stryker disable next-line StringLiteral
export const BODY_PART_MEASUREMENTS_IMPORT_COMMAND = "BODY_PART_MEASUREMENTS_IMPORT_COMMAND";

export const BodyPartMeasurementsImportCommand = v.object({
  ...bg.CommandEnvelopeSchema,
  name: v.literal(BODY_PART_MEASUREMENTS_IMPORT_COMMAND),
  payload: v.object({
    measurements: v.array(
      v.object({
        id: BodyPartMeasurementId,
        bodyPartId: BodyPartId,
        value: BodyPartMeasurementValue,
        measuredOn: BodyPartMeasuredOn,
      }),
    ),
    userId: Auth.VO.UserId,
  }),
});

export type BodyPartMeasurementsImportCommandType = v.InferOutput<typeof BodyPartMeasurementsImportCommand>;
