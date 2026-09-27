import * as bg from "@bgord/bun";
import type * as Measurements from "+measurements";
import { BodyPartDefinedEvent } from "../events/BODY_PART_DEFINED_EVENT";
import { BodyPartNameIsUnique } from "../invariants/body-part-name-is-unique";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommitConfig: bg.StaticConfigPort<bg.CommitShaValueType>;
  EventStore: bg.EventStorePort<Measurements.Events.BodyPartDefinedEventType>;
  GetBodyPartNameCountQuery: Measurements.Queries.GetBodyPartNameCount;
};

export const handleBodyPartDefineCommand =
  (deps: Dependencies) => async (command: Measurements.Commands.BodyPartDefineCommandType) => {
    const count = await deps.GetBodyPartNameCountQuery.execute(command.payload.userId, command.payload.name);

    BodyPartNameIsUnique.enforce({ count });

    const event = bg.event(
      BodyPartDefinedEvent,
      `body_part_${command.payload.id}`,
      { id: command.payload.id, name: command.payload.name, userId: command.payload.userId },
      deps,
    );

    await deps.EventStore.save([event]);
  };
