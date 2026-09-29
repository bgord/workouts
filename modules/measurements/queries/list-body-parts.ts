import type * as bg from "@bgord/bun";
import type * as Auth from "+auth";
import type * as VO from "+measurements/value-objects";

export type BodyPartActions = { rename: bg.ActionState; archive: bg.ActionState };

export type BodyPartListItem = VO.BodyPart & { actions: BodyPartActions };

export type BodyPartListResponse = {
  data: ReadonlyArray<BodyPartListItem>;
  actions: { measure: bg.ActionState };
};

export interface ListBodyParts {
  execute(userId: Auth.VO.UserIdType): Promise<BodyPartListResponse>;
}
