import type * as bg from "@bgord/bun";
import type * as Plans from "+plans";
import { GetPlanForOwnerCountQuery } from "./get-plan-for-owner-count.adapter";
import { GetPlanNameForOwnerCountQuery } from "./get-plan-name-for-user-count.adapter";
import { createPlanRepository } from "./plan-repository.adapter";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  EventStore: bg.EventStorePort<Plans.Aggregates.PlanEventType>;
  Logger: bg.LoggerPort;
};

export function createPlansAdapters(deps: Dependencies) {
  return {
    GetPlanNameForOwnerCountQuery,
    GetPlanForOwnerCountQuery,
    PlanRepository: createPlanRepository(deps),
  };
}
