import * as bg from "@bgord/bun";
import type * as Measurements from "+measurements";
import { BodyPartMeasurementRemovedEvent } from "../events/BODY_PART_MEASUREMENT_REMOVED_EVENT";
import { BodyPartMeasurementBelongsToUser } from "../invariants/body-part-measurement-belongs-to-user";
import { BodyPartMeasurementExists } from "../invariants/body-part-measurement-exists";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommitConfig: bg.StaticConfigPort<bg.CommitShaValueType>;
  EventStore: bg.EventStorePort<Measurements.Events.BodyPartMeasurementRemovedEventType>;
  GetBodyPartMeasurementQuery: Measurements.Queries.GetBodyPartMeasurement;
};

export const handleBodyPartMeasurementRemoveCommand =
  (deps: Dependencies) => async (command: Measurements.Commands.BodyPartMeasurementRemoveCommandType) => {
    const measurement = await deps.GetBodyPartMeasurementQuery.execute(command.payload.id);

    BodyPartMeasurementExists.enforce({ measurement });
    BodyPartMeasurementBelongsToUser.enforce({
      userId: measurement!.userId,
      requesterId: command.payload.requesterId,
    });

    const event = bg.event(
      BodyPartMeasurementRemovedEvent,
      `body_part_measurement_${command.payload.id}`,
      { id: command.payload.id, requesterId: command.payload.requesterId },
      deps,
    );

    await deps.EventStore.save([event]);
  };
