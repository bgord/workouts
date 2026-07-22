import * as bg from "@bgord/bun";
import type * as Plans from "+plans";
import { PlanDraftCreatedEvent } from "../events/PLAN_DRAFT_CREATED_EVENT";
import { PlanNameIsUniqueForOwner } from "../invariants/plan-name-is-unique-for-owner";
import { PlanLimitForOwner } from "../invariants/plan-limit-for-owner";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  EventStore: bg.EventStorePort<Plans.Events.PlanDraftCreatedEventType>;
  GetPlanNameForOwnerCountQuery: Plans.Queries.GetPlanNameForOwnerCount;
};

export const handlePlanDraftCreateCommand =
  (deps: Dependencies) => async (command: Plans.Commands.PlanDraftCreateCommandType) => {
    const count = await deps.GetPlanNameForOwnerCountQuery.execute(
      command.payload.name,
      command.payload.ownerId,
    );

    PlanNameIsUniqueForOwner.enforce({ count });

    PlanLimitForOwner.enforce({ count });

    const event = bg.event(
      PlanDraftCreatedEvent,
      `plan_${command.payload.id}`,
      { id: command.payload.id, name: command.payload.name, ownerId: command.payload.ownerId },
      deps,
    );

    await deps.EventStore.save([event]);
  };
