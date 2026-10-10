import * as v from "valibot";
import { BodyPartDescriptionMax, BodyPartDescriptionMin } from "./body-part-description.validation";

export const BodyPartDescriptionError = {
  Type: "body.part.description.type",
  Invalid: "body.part.description.invalid",
};

export const BodyPartDescription = v.pipe(
  v.string(BodyPartDescriptionError.Type),
  v.trim(),
  v.minLength(BodyPartDescriptionMin, BodyPartDescriptionError.Invalid),
  v.maxLength(BodyPartDescriptionMax, BodyPartDescriptionError.Invalid),
  // Stryker disable next-line StringLiteral
  v.brand("BodyPartDescription"),
);
export type BodyPartDescriptionType = v.InferOutput<typeof BodyPartDescription>;
