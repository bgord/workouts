import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type * as Measurements from "+measurements";
import { BodyPartMeasurementCorrectedEvent } from "../events/BODY_PART_MEASUREMENT_CORRECTED_EVENT";
import { BodyPartBelongsToUser } from "../invariants/body-part-belongs-to-user";
import { BodyPartExists } from "../invariants/body-part-exists";
import { BodyPartIsActive } from "../invariants/body-part-is-active";
import { BodyPartMeasuredOnIsNotInFuture } from "../invariants/body-part-measured-on-is-not-in-future";
import { BodyPartMeasurementBelongsToUser } from "../invariants/body-part-measurement-belongs-to-user";
import { BodyPartMeasurementExists } from "../invariants/body-part-measurement-exists";
import { BodyPartMeasurementHasChanged } from "../invariants/body-part-measurement-has-changed";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommitConfig: bg.StaticConfigPort<bg.CommitShaValueType>;
  EventStore: bg.EventStorePort<Measurements.Events.BodyPartMeasurementCorrectedEventType>;
  GetBodyPartMeasurementQuery: Measurements.Queries.GetBodyPartMeasurement;
  GetBodyPartQuery: Measurements.Queries.GetBodyPart;
};

export const handleBodyPartMeasurementCorrectCommand =
  (deps: Dependencies) => async (command: Measurements.Commands.BodyPartMeasurementCorrectCommandType) => {
    const measurement = await deps.GetBodyPartMeasurementQuery.execute(command.payload.id);

    BodyPartMeasurementExists.enforce({ measurement });
    BodyPartMeasurementBelongsToUser.enforce({
      userId: measurement!.userId,
      requesterId: command.payload.requesterId,
    });
    BodyPartMeasurementHasChanged.enforce({
      current: measurement!,
      incoming: {
        bodyPartId: command.payload.bodyPartId,
        value: command.payload.value,
        measuredOn: command.payload.measuredOn,
      },
    });

    const bodyPart = await deps.GetBodyPartQuery.execute(command.payload.bodyPartId);

    BodyPartExists.enforce({ bodyPart });
    BodyPartBelongsToUser.enforce({ userId: bodyPart!.userId, requesterId: command.payload.requesterId });
    BodyPartIsActive.enforce({ archivedAt: bodyPart!.archivedAt });

    const today = tools.Day.fromTimestamp(deps.Clock.now()).toIsoId();

    BodyPartMeasuredOnIsNotInFuture.enforce({ measuredOn: command.payload.measuredOn, today });

    const event = bg.event(
      BodyPartMeasurementCorrectedEvent,
      `body_part_measurement_${command.payload.id}`,
      {
        id: command.payload.id,
        bodyPartId: command.payload.bodyPartId,
        value: command.payload.value,
        measuredOn: command.payload.measuredOn,
        requesterId: command.payload.requesterId,
      },
      deps,
    );

    await deps.EventStore.save([event]);
  };
