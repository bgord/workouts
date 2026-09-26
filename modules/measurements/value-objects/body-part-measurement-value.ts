import * as v from "valibot";

export const BodyPartMeasurementValueError = {
  Type: "body.part.measurement.value.type",
  Invalid: "body.part.measurement.value.invalid",
};

export const BodyPartMeasurementValue = v.pipe(
  v.number(BodyPartMeasurementValueError.Type),
  v.integer(BodyPartMeasurementValueError.Invalid),
  v.minValue(1, BodyPartMeasurementValueError.Invalid),
  v.maxValue(3000, BodyPartMeasurementValueError.Invalid),
  v.brand("BodyPartMeasurementValue"),
);
export type BodyPartMeasurementValueType = v.InferOutput<typeof BodyPartMeasurementValue>;
