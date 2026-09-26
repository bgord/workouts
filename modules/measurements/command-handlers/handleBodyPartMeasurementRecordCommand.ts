import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type * as Measurements from "+measurements";
import { BodyPartMeasurementRecordedEvent } from "../events/BODY_PART_MEASUREMENT_RECORDED_EVENT";
import { BodyPartBelongsToUser } from "../invariants/body-part-belongs-to-user";
import { BodyPartExists } from "../invariants/body-part-exists";
import { BodyPartIsActive } from "../invariants/body-part-is-active";
import { BodyPartMeasuredOnIsNotInFuture } from "../invariants/body-part-measured-on-is-not-in-future";
import { BodyPartMeasurementDateIsUnique } from "../invariants/body-part-measurement-date-is-unique";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommitConfig: bg.StaticConfigPort<bg.CommitShaValueType>;
  EventStore: bg.EventStorePort<Measurements.Events.BodyPartMeasurementRecordedEventType>;
  GetBodyPartQuery: Measurements.Queries.GetBodyPart;
  GetBodyPartMeasurementDateCountQuery: Measurements.Queries.GetBodyPartMeasurementDateCount;
};

export const handleBodyPartMeasurementRecordCommand =
  (deps: Dependencies) => async (command: Measurements.Commands.BodyPartMeasurementRecordCommandType) => {
    const bodyPart = await deps.GetBodyPartQuery.execute(command.payload.bodyPartId);

    BodyPartExists.enforce({ bodyPart });
    BodyPartBelongsToUser.enforce({ userId: bodyPart!.userId, requesterId: command.payload.userId });
    BodyPartIsActive.enforce({ archived: bodyPart!.archived });

    const today = tools.Day.fromTimestamp(deps.Clock.now()).toIsoId();
    BodyPartMeasuredOnIsNotInFuture.enforce({ measuredOn: command.payload.measuredOn, today });

    const count = await deps.GetBodyPartMeasurementDateCountQuery.execute(
      command.payload.userId,
      command.payload.bodyPartId,
      command.payload.measuredOn,
    );
    BodyPartMeasurementDateIsUnique.enforce({ count });

    const event = bg.event(
      BodyPartMeasurementRecordedEvent,
      `body_part_measurement_${command.payload.id}`,
      {
        id: command.payload.id,
        bodyPartId: command.payload.bodyPartId,
        valueMm: command.payload.valueMm,
        measuredOn: command.payload.measuredOn,
        userId: command.payload.userId,
      },
      deps,
    );

    await deps.EventStore.save([event]);
  };
