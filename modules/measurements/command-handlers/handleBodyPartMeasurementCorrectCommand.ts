import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type * as Measurements from "+measurements";
import { BodyPartMeasurementCorrectedEvent } from "../events/BODY_PART_MEASUREMENT_CORRECTED_EVENT";
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
