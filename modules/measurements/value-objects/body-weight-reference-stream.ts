import * as bg from "@bgord/bun";
import * as v from "valibot";
import type * as Auth from "+auth";

export const BodyWeightReferenceStream = {
  of: (userId: Auth.VO.UserIdType) => v.parse(bg.EventStream, `body_weight_reference_${userId}`),
};
