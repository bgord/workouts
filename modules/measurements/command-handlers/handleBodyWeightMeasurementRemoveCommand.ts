import * as bg from "@bgord/bun";
import type * as Measurements from "+measurements";
import { BodyWeightMeasurementRemovedEvent } from "../events/BODY_WEIGHT_MEASUREMENT_REMOVED_EVENT";
import { BodyWeightMeasurementBelongsToUser } from "../invariants/body-weight-measurement-belongs-to-user";
import { BodyWeightMeasurementExists } from "../invariants/body-weight-measurement-exists";
import { BodyWeightMeasurementStream } from "../value-objects/body-weight-measurement-stream";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommitConfig: bg.StaticConfigPort<bg.CommitShaValueType>;
  EventStore: bg.EventStorePort<Measurements.Events.BodyWeightMeasurementRemovedEventType>;
  GetBodyWeightMeasurementQuery: Measurements.Queries.GetBodyWeightMeasurement;
};

export const handleBodyWeightMeasurementRemoveCommand =
  (deps: Dependencies) => async (command: Measurements.Commands.BodyWeightMeasurementRemoveCommandType) => {
    const { measurement } = BodyWeightMeasurementExists.enforce({
      measurement: await deps.GetBodyWeightMeasurementQuery.execute(command.payload.id),
    });

    BodyWeightMeasurementBelongsToUser.enforce({
      userId: measurement.userId,
      requesterId: command.payload.requesterId,
    });

    const event = bg.event(
      BodyWeightMeasurementRemovedEvent,
      BodyWeightMeasurementStream.of(command.payload.id),
      { id: command.payload.id, requesterId: command.payload.requesterId },
      deps,
    );

    await deps.EventStore.save([event]);
  };
