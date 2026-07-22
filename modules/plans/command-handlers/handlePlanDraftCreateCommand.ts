import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type * as Plans from "+plans";
import { PlanDraftCreatedEvent } from "../events/PLAN_DRAFT_CREATED_EVENT";
import { PlanNameIsUniquePerUser } from "../invariants/plan-name-is-unique-for-owner";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  EventStore: bg.EventStorePort<Plans.Events.PlanDraftCreatedEventType>;
};

export const handlePlanDraftCreateCommand =
  (deps: Dependencies) => async (command: Plans.Commands.PlanDraftCreateCommandType) => {
    PlanNameIsUniquePerUser.enforce({ count: tools.Int.nonNegative(0) });

    const event = bg.event(
      PlanDraftCreatedEvent,
      `plan_${command.payload.id}`,
      { id: command.payload.id, name: command.payload.name, ownerId: command.payload.ownerId },
      deps,
    );

    await deps.EventStore.save([event]);
  };
