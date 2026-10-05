import * as tools from "@bgord/tools";
import * as v from "valibot";

export const BodyPartCircumferenceError = { Invalid: "body.part.circumference.invalid" };

export const BodyPartCircumference = v.pipe(
  tools.HeightMillimeters,
  v.check((value) => value > 0, BodyPartCircumferenceError.Invalid),
  // Stryker disable next-line StringLiteral
  v.brand("BodyPartCircumference"),
);
export type BodyPartCircumferenceType = v.InferOutput<typeof BodyPartCircumference>;
