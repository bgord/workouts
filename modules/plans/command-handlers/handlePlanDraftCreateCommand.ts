import * as bg from "@bgord/bun";
import type * as Plans from "+plans";
import { PlanDraftCreatedEvent } from "../events/PLAN_DRAFT_CREATED_EVENT";
import { PlanLimitForOwner } from "../invariants/plan-limit-for-owner";
import { PlanNameIsUniqueForOwner } from "../invariants/plan-name-is-unique-for-owner";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  EventStore: bg.EventStorePort<Plans.Events.PlanDraftCreatedEventType>;
  GetPlanNameForOwnerCountQuery: Plans.Queries.GetPlanNameForOwnerCount;
  GetPlanForOwnerCountQuery: Plans.Queries.GetPlanForOwnerCount;
};

export const handlePlanDraftCreateCommand =
  (deps: Dependencies) => async (command: Plans.Commands.PlanDraftCreateCommandType) => {
    const planCount = await deps.GetPlanForOwnerCountQuery.execute(command.payload.ownerId);

    PlanLimitForOwner.enforce({ count: planCount });

    const planNameCount = await deps.GetPlanNameForOwnerCountQuery.execute(
      command.payload.name,
      command.payload.ownerId,
    );

    PlanNameIsUniqueForOwner.enforce({ count: planNameCount });

    const event = bg.event(
      PlanDraftCreatedEvent,
      `plan_${command.payload.id}`,
      { id: command.payload.id, name: command.payload.name, ownerId: command.payload.ownerId },
      deps,
    );

    await deps.EventStore.save([event]);
  };
