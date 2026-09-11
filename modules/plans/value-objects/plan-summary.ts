import type * as tools from "@bgord/tools";
import type { PlanDescriptionType } from "./plan-description";
import type { PlanIdType } from "./plan-id";
import type { PlanNameType } from "./plan-name";
import type { PlanStatusEnum } from "./plan-status";

export type PlanSummary = {
  id: PlanIdType;
  name: PlanNameType;
  description?: PlanDescriptionType;
  status: PlanStatusEnum;
  revision: tools.RevisionValueType;
  updatedAt: tools.TimestampValueType;
  sections: tools.IntegerNonNegativeType;
};
