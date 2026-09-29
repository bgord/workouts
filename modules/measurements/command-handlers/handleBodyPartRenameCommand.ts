import * as bg from "@bgord/bun";
import type * as Measurements from "+measurements";
import { BodyPartRenamedEvent } from "../events/BODY_PART_RENAMED_EVENT";
import { BodyPartBelongsToUser } from "../invariants/body-part-belongs-to-user";
import { BodyPartExists } from "../invariants/body-part-exists";
import { BodyPartIsActive } from "../invariants/body-part-is-active";
import { BodyPartNameHasChanged } from "../invariants/body-part-name-has-changed";
import { BodyPartNameIsUnique } from "../invariants/body-part-name-is-unique";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommitConfig: bg.StaticConfigPort<bg.CommitShaValueType>;
  EventStore: bg.EventStorePort<Measurements.Events.BodyPartRenamedEventType>;
  GetBodyPartQuery: Measurements.Queries.GetBodyPart;
  GetBodyPartNameCountQuery: Measurements.Queries.GetBodyPartNameCount;
};

export const handleBodyPartRenameCommand =
  (deps: Dependencies) => async (command: Measurements.Commands.BodyPartRenameCommandType) => {
    const bodyPart = await deps.GetBodyPartQuery.execute(command.payload.id);

    BodyPartExists.enforce({ bodyPart });
    BodyPartBelongsToUser.enforce({ userId: bodyPart!.userId, requesterId: command.payload.requesterId });
    BodyPartIsActive.enforce({ archivedAt: bodyPart!.archivedAt });
    BodyPartNameHasChanged.enforce({ current: bodyPart!.name, incoming: command.payload.name });

    const count = await deps.GetBodyPartNameCountQuery.execute(
      command.payload.requesterId,
      command.payload.name,
    );

    BodyPartNameIsUnique.enforce({ count });

    const event = bg.event(
      BodyPartRenamedEvent,
      `body_part_${command.payload.id}`,
      { id: command.payload.id, name: command.payload.name, requesterId: command.payload.requesterId },
      deps,
    );

    await deps.EventStore.save([event]);
  };
