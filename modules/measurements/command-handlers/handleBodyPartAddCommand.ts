import * as bg from "@bgord/bun";
import type * as Measurements from "+measurements";
import { BodyPartAddedEvent } from "../events/BODY_PART_ADDED_EVENT";
import { BodyPartNameIsUnique } from "../invariants/body-part-name-is-unique";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommitConfig: bg.StaticConfigPort<bg.CommitShaValueType>;
  EventStore: bg.EventStorePort<Measurements.Events.BodyPartAddedEventType>;
  GetBodyPartNameCountQuery: Measurements.Queries.GetBodyPartNameCount;
};

export const handleBodyPartAddCommand =
  (deps: Dependencies) => async (command: Measurements.Commands.BodyPartAddCommandType) => {
    const count = await deps.GetBodyPartNameCountQuery.execute(command.payload.userId, command.payload.name);
    BodyPartNameIsUnique.enforce({ count });

    const event = bg.event(
      BodyPartAddedEvent,
      `body_part_${command.payload.id}`,
      { id: command.payload.id, name: command.payload.name, userId: command.payload.userId },
      deps,
    );

    await deps.EventStore.save([event]);
  };
