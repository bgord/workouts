import * as bg from "@bgord/bun";
import * as v from "valibot";

export const BodyPartId = v.pipe(bg.UUID, v.brand("BodyPartId"));
export type BodyPartIdType = v.InferOutput<typeof BodyPartId>;
