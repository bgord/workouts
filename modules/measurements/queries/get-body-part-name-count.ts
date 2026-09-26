import type * as Auth from "+auth";
import type * as VO from "+measurements/value-objects";

export interface GetBodyPartNameCount {
  execute(
    userId: Auth.VO.UserIdType,
    name: VO.BodyPartNameType,
    exceptId?: VO.BodyPartIdType,
  ): Promise<number>;
}
