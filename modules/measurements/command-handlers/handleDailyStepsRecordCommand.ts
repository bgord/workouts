import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type * as Measurements from "+measurements";
import { DailyStepsRecordedEvent } from "../events/DAILY_STEPS_RECORDED_EVENT";
import { DailyStepsDayIsNotInFuture } from "../invariants/daily-steps-day-is-not-in-future";
import { DailyStepsStream } from "../value-objects/daily-steps-stream";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommitConfig: bg.StaticConfigPort<bg.CommitShaValueType>;
  EventStore: bg.EventStorePort<Measurements.Events.DailyStepsRecordedEventType>;
};

export const handleDailyStepsRecordCommand =
  (deps: Dependencies) => async (command: Measurements.Commands.DailyStepsRecordCommandType) => {
    const today = tools.Day.fromTimestamp(
      deps.Clock.now().subtract(command.payload.timeZoneOffset),
    ).toIsoId();

    DailyStepsDayIsNotInFuture.enforce({ day: command.payload.day, today });

    const event = bg.event(
      DailyStepsRecordedEvent,
      DailyStepsStream.of(command.payload.userId, command.payload.day),
      {
        userId: command.payload.userId,
        day: command.payload.day,
        count: command.payload.count,
        source: command.payload.source,
      },
      deps,
    );

    await deps.EventStore.save([event]);
  };
