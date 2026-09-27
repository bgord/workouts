import * as tools from "@bgord/tools";
import * as v from "valibot";

// Stryker disable next-line StringLiteral
export const BodyPartCircumference = v.pipe(tools.HeightMillimeters, v.brand("BodyPartCircumference"));
export type BodyPartCircumferenceType = v.InferOutput<typeof BodyPartCircumference>;
