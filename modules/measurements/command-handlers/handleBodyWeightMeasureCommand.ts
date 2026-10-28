import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type * as Measurements from "+measurements";
import { BodyWeightMeasuredEvent } from "../events/BODY_WEIGHT_MEASURED_EVENT";
import { BodyWeightMeasuredOnIsNotInFuture } from "../invariants/body-weight-measured-on-is-not-in-future";
import { BodyWeightMeasurementStream } from "../value-objects/body-weight-measurement-stream";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommitConfig: bg.StaticConfigPort<bg.CommitShaValueType>;
  EventStore: bg.EventStorePort<Measurements.Events.BodyWeightMeasuredEventType>;
};

export const handleBodyWeightMeasureCommand =
  (deps: Dependencies) => async (command: Measurements.Commands.BodyWeightMeasureCommandType) => {
    const today = tools.Day.fromTimestamp(
      deps.Clock.now().subtract(command.payload.timeZoneOffset),
    ).toIsoId();

    BodyWeightMeasuredOnIsNotInFuture.enforce({ measuredOn: command.payload.measuredOn, today });

    const event = bg.event(
      BodyWeightMeasuredEvent,
      BodyWeightMeasurementStream.of(command.payload.id),
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
