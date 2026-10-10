import type * as Auth from "+auth";
import type { BodyPartDescriptionType } from "./body-part-description";
import type { BodyPartIdType } from "./body-part-id";
import type { BodyPartNameType } from "./body-part-name";

export type BodyPart = {
  id: BodyPartIdType;
  name: BodyPartNameType;
  description: BodyPartDescriptionType | null;
  userId: Auth.VO.UserIdType;
};
