import type * as bg from "@bgord/bun";
import type * as Auth from "+auth";
import type * as VO from "+measurements/value-objects";

export type BodyPartListResponse = {
  data: ReadonlyArray<VO.BodyPartSummary>;
  actions: { import: bg.ActionState };
};

export interface ListBodyParts {
  execute(userId: Auth.VO.UserIdType): Promise<BodyPartListResponse>;
}
