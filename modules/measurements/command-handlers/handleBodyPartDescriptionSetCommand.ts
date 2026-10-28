import * as bg from "@bgord/bun";
import type * as Measurements from "+measurements";
import { BodyPartDescriptionSetEvent } from "../events/BODY_PART_DESCRIPTION_SET_EVENT";
import { BodyPartBelongsToUser } from "../invariants/body-part-belongs-to-user";
import { BodyPartDescriptionHasChanged } from "../invariants/body-part-description-has-changed";
import { BodyPartExists } from "../invariants/body-part-exists";
import { BodyPartStream } from "../value-objects/body-part-stream";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommitConfig: bg.StaticConfigPort<bg.CommitShaValueType>;
  EventStore: bg.EventStorePort<Measurements.Events.BodyPartDescriptionSetEventType>;
  GetBodyPartQuery: Measurements.Queries.GetBodyPart;
};

export const handleBodyPartDescriptionSetCommand =
  (deps: Dependencies) => async (command: Measurements.Commands.BodyPartDescriptionSetCommandType) => {
    const { bodyPart } = BodyPartExists.enforce({
      bodyPart: await deps.GetBodyPartQuery.execute(command.payload.id),
    });

    BodyPartBelongsToUser.enforce({ userId: bodyPart.userId, requesterId: command.payload.requesterId });
    BodyPartDescriptionHasChanged.enforce({
      current: bodyPart.description,
      incoming: command.payload.description,
    });

    const event = bg.event(
      BodyPartDescriptionSetEvent,
      BodyPartStream.of(command.payload.id),
      {
        id: command.payload.id,
        description: command.payload.description,
        requesterId: command.payload.requesterId,
      },
      deps,
    );

    await deps.EventStore.save([event]);
  };
