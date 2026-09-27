import type * as tools from "@bgord/tools";
import type * as Auth from "+auth";
import type * as VO from "+measurements/value-objects";

export interface GetBodyPartNameCount {
  execute(
    userId: Auth.VO.UserIdType,
    bodyPartName: VO.BodyPartNameType,
  ): Promise<tools.IntegerNonNegativeType>;
}
