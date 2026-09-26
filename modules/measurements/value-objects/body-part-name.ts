import * as v from "valibot";

export const BodyPartNameError = {
  Type: "body.part.name.type",
  Invalid: "body.part.name.invalid",
};

export const BodyPartName = v.pipe(
  v.string(BodyPartNameError.Type),
  v.minLength(1, BodyPartNameError.Invalid),
  v.maxLength(64, BodyPartNameError.Invalid),
  v.check((value) => value.trim().length > 0, BodyPartNameError.Invalid),
  v.brand("BodyPartName"),
);
export type BodyPartNameType = v.InferOutput<typeof BodyPartName>;

export const normalizeBodyPartName = (value: string) => value.trim().replace(/\s+/g, " ");
