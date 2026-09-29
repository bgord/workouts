import * as bg from "@bgord/bun";
import type * as Measurements from "+measurements";
import { BodyPartArchivedEvent } from "../events/BODY_PART_ARCHIVED_EVENT";
import { BodyPartBelongsToUser } from "../invariants/body-part-belongs-to-user";
import { BodyPartExists } from "../invariants/body-part-exists";
import { BodyPartIsActive } from "../invariants/body-part-is-active";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommitConfig: bg.StaticConfigPort<bg.CommitShaValueType>;
  EventStore: bg.EventStorePort<Measurements.Events.BodyPartArchivedEventType>;
  GetBodyPartQuery: Measurements.Queries.GetBodyPart;
};

export const handleBodyPartArchiveCommand =
  (deps: Dependencies) => async (command: Measurements.Commands.BodyPartArchiveCommandType) => {
    const bodyPart = await deps.GetBodyPartQuery.execute(command.payload.id);

    BodyPartExists.enforce({ bodyPart });
    BodyPartBelongsToUser.enforce({ userId: bodyPart!.userId, requesterId: command.payload.requesterId });
    BodyPartIsActive.enforce({ archivedAt: bodyPart!.archivedAt });

    const event = bg.event(
      BodyPartArchivedEvent,
      `body_part_${command.payload.id}`,
      { id: command.payload.id, requesterId: command.payload.requesterId },
      deps,
    );

    await deps.EventStore.save([event]);
  };
