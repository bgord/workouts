import type * as tools from "@bgord/tools";
import type { PlanIdType } from "./plan-id";
import type { PlanNameType } from "./plan-name";
import type { PlanStatusEnum } from "./plan-status";

export type PlanSummary = {
  id: PlanIdType;
  name: PlanNameType;
  status: PlanStatusEnum;
  revision: tools.RevisionValueType;
};
