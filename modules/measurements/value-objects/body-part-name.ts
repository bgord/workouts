import * as v from "valibot";
import { BodyPartNameMax, BodyPartNameMin } from "./body-part-name.validation";

export const BodyPartNameError = { Type: "body.part.name.type", Invalid: "body.part.name.invalid" };

export const BodyPartName = v.pipe(
  v.string(BodyPartNameError.Type),
  v.minLength(BodyPartNameMin, BodyPartNameError.Invalid),
  v.maxLength(BodyPartNameMax, BodyPartNameError.Invalid),
  // Stryker disable next-line StringLiteral
  v.brand("BodyPartName"),
);
export type BodyPartNameType = v.InferOutput<typeof BodyPartName>;
