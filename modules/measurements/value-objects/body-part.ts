import type * as tools from "@bgord/tools";
import type * as Auth from "+auth";
import type { BodyPartIdType } from "./body-part-id";
import type { BodyPartNameType } from "./body-part-name";

export type BodyPart = {
  id: BodyPartIdType;
  name: BodyPartNameType;
  userId: Auth.VO.UserIdType;
  archivedAt: tools.TimestampValueType | null;
};
