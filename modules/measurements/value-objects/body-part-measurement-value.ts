import * as v from "valibot";

export const BodyPartMeasurementValueError = {
  Type: "body.part.measurement.value.type",
  Invalid: "body.part.measurement.value.invalid",
};

export const BodyPartMeasurementValue = v.pipe(
  v.number(BodyPartMeasurementValueError.Type),
  v.safeInteger(BodyPartMeasurementValueError.Type),
  v.minValue(0, BodyPartMeasurementValueError.Invalid),
  // Stryker disable next-line StringLiteral
  v.brand("BodyPartMeasurementValue"),
);

export type BodyPartMeasurementValueType = v.InferOutput<typeof BodyPartMeasurementValue>;
