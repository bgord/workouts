import * as bg from "@bgord/bun";
import type * as Measurements from "+measurements";
import { BodyWeightReferenceSetEvent } from "../events/BODY_WEIGHT_REFERENCE_SET_EVENT";
import { BodyWeightMeasurementBelongsToUser } from "../invariants/body-weight-measurement-belongs-to-user";
import { BodyWeightMeasurementExists } from "../invariants/body-weight-measurement-exists";
import { BodyWeightMeasurementIsNotReference } from "../invariants/body-weight-measurement-is-not-reference";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommitConfig: bg.StaticConfigPort<bg.CommitShaValueType>;
  EventStore: bg.EventStorePort<Measurements.Events.BodyWeightReferenceSetEventType>;
  GetBodyWeightMeasurementQuery: Measurements.Queries.GetBodyWeightMeasurement;
};

export const handleBodyWeightReferenceSetCommand =
  (deps: Dependencies) => async (command: Measurements.Commands.BodyWeightReferenceSetCommandType) => {
    const measurement = await deps.GetBodyWeightMeasurementQuery.execute(command.payload.measurementId);

    BodyWeightMeasurementExists.enforce({ measurement });
    BodyWeightMeasurementBelongsToUser.enforce({
      userId: measurement!.userId,
      requesterId: command.payload.requesterId,
    });
    BodyWeightMeasurementIsNotReference.enforce({ measurement: measurement! });

    const event = bg.event(
      BodyWeightReferenceSetEvent,
      `body_weight_reference_${command.payload.requesterId}`,
      { measurementId: command.payload.measurementId, userId: command.payload.requesterId },
      deps,
    );

    await deps.EventStore.save([event]);
  };
