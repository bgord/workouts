import type { PlanIdType } from "./plan-id";
import type { PlanNameType } from "./plan-name";
import type { PlanSection } from "./plan-section";
import type { PlanStatusEnum } from "./plan-status";

export type Plan = {
  id: PlanIdType;
  name: PlanNameType;
  status: PlanStatusEnum;
  sections: Array<PlanSection>;
};
