import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type * as Measurements from "+measurements";
import { BodyWeightMeasuredEvent } from "../events/BODY_WEIGHT_MEASURED_EVENT";
import { BodyWeightMeasuredOnIsNotInFuture } from "../invariants/body-weight-measured-on-is-not-in-future";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommitConfig: bg.StaticConfigPort<bg.CommitShaValueType>;
  EventStore: bg.EventStorePort<Measurements.Events.BodyWeightMeasuredEventType>;
};

export const handleBodyWeightMeasurementsImportCommand =
  (deps: Dependencies) => async (command: Measurements.Commands.BodyWeightMeasurementsImportCommandType) => {
    const today = tools.Day.fromTimestamp(deps.Clock.now()).toIsoId();

    for (const measurement of command.payload.measurements) {
      BodyWeightMeasuredOnIsNotInFuture.enforce({ measuredOn: measurement.measuredOn, today });
    }

    for (const measurement of command.payload.measurements) {
      const event = bg.event(
        BodyWeightMeasuredEvent,
        `body_weight_measurement_${measurement.id}`,
        {
          id: measurement.id,
          weight: measurement.weight,
          measuredOn: measurement.measuredOn,
          userId: command.payload.userId,
        },
        deps,
      );

      await deps.EventStore.save([event]);
    }
  };
