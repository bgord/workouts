import * as bg from "@bgord/bun";
import * as Plans from "+plans";
import { GetFinalizedPlanQuery } from "./get-finalized-plan.adapter";
import { GetPlanQuery } from "./get-plan.adapter";
import { GetPlanEditableForOwnerCountQuery } from "./get-plan-editable-for-owner-count.adapter";
import { GetPlanNameForOwnerCountQuery } from "./get-plan-name-for-owner-count.adapter";
import { ListExerciseCatalogQuery } from "./list-exercise-catalog.adapter";
import { ListPlansQuery } from "./list-plans.adapter";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommitConfig: bg.StaticConfigPort<bg.CommitShaValueType>;
  EventStore: bg.EventStorePort<Plans.Aggregates.PlanEventType>;
};

export function createPlansAdapters(deps: Dependencies) {
  return {
    GetPlanNameForOwnerCountQuery,
    GetPlanEditableForOwnerCountQuery,
    GetPlanQuery,
    GetFinalizedPlanQuery,
    ListExerciseCatalogQuery,
    ListPlansQuery,
    PlanRepository: new bg.EventSourcedRepositoryAdapter({ aggregate: Plans.Aggregates.Plan }, deps),
  };
}
