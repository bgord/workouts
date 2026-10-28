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

export const handleDailyStepsImportCommand =
  (deps: Dependencies) => async (command: Measurements.Commands.DailyStepsImportCommandType) => {
    const today = tools.Day.fromTimestamp(
      deps.Clock.now().subtract(command.payload.timeZoneOffset),
    ).toIsoId();

    for (const entry of command.payload.entries) {
      DailyStepsDayIsNotInFuture.enforce({ day: entry.day, today });
    }

    for (const entry of command.payload.entries) {
      const event = bg.event(
        DailyStepsRecordedEvent,
        DailyStepsStream.of(command.payload.userId, entry.day),
        { userId: command.payload.userId, day: entry.day, count: entry.count, source: entry.source },
        deps,
      );

      await deps.EventStore.save([event]);
    }
  };
