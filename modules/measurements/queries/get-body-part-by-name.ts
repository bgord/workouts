import type * as Auth from "+auth";
import type * as VO from "+measurements/value-objects";

export interface GetBodyPartByName {
  execute(userId: Auth.VO.UserIdType, bodyPartName: VO.BodyPartNameType): Promise<VO.BodyPart | null>;
}
