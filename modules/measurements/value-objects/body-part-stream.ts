import * as bg from "@bgord/bun";
import * as v from "valibot";
import type { BodyPartIdType } from "./body-part-id";

export const BodyPartStream = {
  of: (id: BodyPartIdType) => v.parse(bg.EventStream, `body_part_${id}`),
};
