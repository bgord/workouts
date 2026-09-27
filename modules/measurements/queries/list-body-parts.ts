import type * as Auth from "+auth";
import type * as VO from "+measurements/value-objects";

export interface ListBodyParts {
  execute(userId: Auth.VO.UserIdType): Promise<ReadonlyArray<VO.BodyPart>>;
}
