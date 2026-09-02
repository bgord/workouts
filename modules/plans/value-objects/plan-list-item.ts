import type { PlanIdType } from "./plan-id";
import type { PlanNameType } from "./plan-name";
import type { PlanStatusEnum } from "./plan-status";

export type PlanListItem = { id: PlanIdType; name: PlanNameType; status: PlanStatusEnum };
