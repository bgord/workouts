import { GetPlanForOwnerCountQuery } from "./get-plan-for-owner-count.adapter";
import { GetPlanNameForOwnerCountQuery } from "./get-plan-name-for-user-count.adapter";

export function createPlansAdapters() {
  return { GetPlanNameForOwnerCountQuery, GetPlanForOwnerCountQuery };
}
