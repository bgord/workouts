import * as bg from "@bgord/bun";
import type * as Measurements from "+measurements";
import { BodyWeightMeasuredEvent } from "../events/BODY_WEIGHT_MEASURED_EVENT";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommitConfig: bg.StaticConfigPort<bg.CommitShaValueType>;
  EventStore: bg.EventStorePort<Measurements.Events.BodyWeightMeasuredEventType>;
};

export const handleBodyWeightMeasureCommand =
  (deps: Dependencies) => async (command: Measurements.Commands.BodyWeightMeasureCommandType) => {
    const event = bg.event(
      BodyWeightMeasuredEvent,
      `body_weight_measurement_${command.payload.id}`,
      {
        id: command.payload.id,
        weight: command.payload.weight,
        measuredOn: command.payload.measuredOn,
        userId: command.payload.userId,
      },
      deps,
    );

    await deps.EventStore.save([event]);
  };
