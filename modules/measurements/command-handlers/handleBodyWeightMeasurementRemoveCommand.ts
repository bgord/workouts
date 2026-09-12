import * as bg from "@bgord/bun";
import type * as Measurements from "+measurements";
import { BodyWeightMeasurementRemovedEvent } from "../events/BODY_WEIGHT_MEASUREMENT_REMOVED_EVENT";
import { BodyWeightMeasurementBelongsToUser } from "../invariants/body-weight-measurement-belongs-to-user";
import { BodyWeightMeasurementExists } from "../invariants/body-weight-measurement-exists";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommitConfig: bg.StaticConfigPort<bg.CommitShaValueType>;
  EventStore: bg.EventStorePort<Measurements.Events.BodyWeightMeasurementRemovedEventType>;
  GetBodyWeightMeasurementQuery: Measurements.Queries.GetBodyWeightMeasurement;
};

export const handleBodyWeightMeasurementRemoveCommand =
  (deps: Dependencies) => async (command: Measurements.Commands.BodyWeightMeasurementRemoveCommandType) => {
    const measurement = await deps.GetBodyWeightMeasurementQuery.execute(command.payload.id);

    BodyWeightMeasurementExists.enforce({ measurement });
    BodyWeightMeasurementBelongsToUser.enforce({
      userId: measurement!.userId,
      requesterId: command.payload.requesterId,
    });

    const event = bg.event(
      BodyWeightMeasurementRemovedEvent,
      `body_weight_measurement_${command.payload.id}`,
      { id: command.payload.id, requesterId: command.payload.requesterId },
      deps,
    );

    await deps.EventStore.save([event]);
  };
