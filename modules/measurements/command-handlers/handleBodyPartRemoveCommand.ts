import * as bg from "@bgord/bun";
import type * as Measurements from "+measurements";
import { BodyPartRemovedEvent } from "../events/BODY_PART_REMOVED_EVENT";
import { BodyPartBelongsToUser } from "../invariants/body-part-belongs-to-user";
import { BodyPartExists } from "../invariants/body-part-exists";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommitConfig: bg.StaticConfigPort<bg.CommitShaValueType>;
  EventStore: bg.EventStorePort<Measurements.Events.BodyPartRemovedEventType>;
  GetBodyPartQuery: Measurements.Queries.GetBodyPart;
};

export const handleBodyPartRemoveCommand =
  (deps: Dependencies) => async (command: Measurements.Commands.BodyPartRemoveCommandType) => {
    const bodyPart = await deps.GetBodyPartQuery.execute(command.payload.id);

    BodyPartExists.enforce({ bodyPart });
    BodyPartBelongsToUser.enforce({
      userId: bodyPart!.userId,
      requesterId: command.payload.requesterId,
    });

    const event = bg.event(
      BodyPartRemovedEvent,
      `body_part_${command.payload.id}`,
      { id: command.payload.id, requesterId: command.payload.requesterId },
      deps,
    );

    await deps.EventStore.save([event]);
  };
