import * as v from "valibot";
import { BodyPartCircumference } from "./body-part-circumference";
import { BodyPartId } from "./body-part-id";
import { BodyPartMeasurementEntriesMin } from "./body-part-measurement-entries.validation";

export const BodyPartMeasurementEntriesError = {
  Type: "body.part.measurement.entries.type",
  Invalid: "body.part.measurement.entries.invalid",
  Duplicate: "body.part.measurement.entries.duplicate",
};

export const BodyPartMeasurementEntries = v.pipe(
  v.array(
    v.object({ bodyPartId: BodyPartId, value: BodyPartCircumference }, BodyPartMeasurementEntriesError.Type),
    BodyPartMeasurementEntriesError.Type,
  ),
  v.minLength(BodyPartMeasurementEntriesMin, BodyPartMeasurementEntriesError.Invalid),
  v.check(
    (entries) => new Set(entries.map((entry) => entry.bodyPartId)).size === entries.length,
    BodyPartMeasurementEntriesError.Duplicate,
  ),
);
export type BodyPartMeasurementEntriesType = v.InferOutput<typeof BodyPartMeasurementEntries>;
