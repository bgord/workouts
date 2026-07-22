import type { Plan } from "+plans/aggregates";
import type * as VO from "+plans/value-objects";

export interface PlanRepositoryPort {
  load(id: VO.PlanIdType): Promise<Plan>;
  save(aggregate: Plan): Promise<void>;
}
