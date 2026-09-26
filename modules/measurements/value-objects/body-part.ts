import type * as Auth from "+auth";
import type { BodyPartIdType } from "./body-part-id";
import type { BodyPartNameType } from "./body-part-name";

export type BodyPart = {
  id: BodyPartIdType;
  userId: Auth.VO.UserIdType;
  name: BodyPartNameType;
  archived: boolean;
};
