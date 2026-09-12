import * as bg from "@bgord/bun";
import type * as Measurements from "+measurements";
import { BodyWeightMeasurementCorrectedEvent } from "../events/BODY_WEIGHT_MEASUREMENT_CORRECTED_EVENT";
import { BodyWeightMeasurementBelongsToUser } from "../invariants/body-weight-measurement-belongs-to-user";
import { BodyWeightMeasurementExists } from "../invariants/body-weight-measurement-exists";
import { BodyWeightMeasurementHasChanged } from "../invariants/body-weight-measurement-has-changed";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommitConfig: bg.StaticConfigPort<bg.CommitShaValueType>;
  EventStore: bg.EventStorePort<Measurements.Events.BodyWeightMeasurementCorrectedEventType>;
  GetBodyWeightMeasurementQuery: Measurements.Queries.GetBodyWeightMeasurement;
};

export const handleBodyWeightMeasurementCorrectCommand =
  (deps: Dependencies) => async (command: Measurements.Commands.BodyWeightMeasurementCorrectCommandType) => {
    const measurement = await deps.GetBodyWeightMeasurementQuery.execute(command.payload.id);

    BodyWeightMeasurementExists.enforce({ measurement });
    BodyWeightMeasurementBelongsToUser.enforce({
      userId: measurement!.userId,
      requesterId: command.payload.requesterId,
    });
    BodyWeightMeasurementHasChanged.enforce({
      current: measurement!,
      incoming: { weight: command.payload.weight, measuredOn: command.payload.measuredOn },
    });

    const event = bg.event(
      BodyWeightMeasurementCorrectedEvent,
      `body_weight_measurement_${command.payload.id}`,
      {
        id: command.payload.id,
        weight: command.payload.weight,
        measuredOn: command.payload.measuredOn,
        requesterId: command.payload.requesterId,
      },
      deps,
    );

    await deps.EventStore.save([event]);
  };
