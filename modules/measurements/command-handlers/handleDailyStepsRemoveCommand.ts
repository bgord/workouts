import * as bg from "@bgord/bun";
import type * as Measurements from "+measurements";
import { DailyStepsRemovedEvent } from "../events/DAILY_STEPS_REMOVED_EVENT";
import { DailyStepsExists } from "../invariants/daily-steps-exists";
import { DailyStepsStream } from "../value-objects/daily-steps-stream";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommitConfig: bg.StaticConfigPort<bg.CommitShaValueType>;
  EventStore: bg.EventStorePort<Measurements.Events.DailyStepsRemovedEventType>;
  GetDailyStepsQuery: Measurements.Queries.GetDailySteps;
};

export const handleDailyStepsRemoveCommand =
  (deps: Dependencies) => async (command: Measurements.Commands.DailyStepsRemoveCommandType) => {
    const dailySteps = await deps.GetDailyStepsQuery.execute(command.payload.userId, command.payload.day);

    DailyStepsExists.enforce({ dailySteps });

    const event = bg.event(
      DailyStepsRemovedEvent,
      DailyStepsStream.of(command.payload.userId, command.payload.day),
      { userId: command.payload.userId, day: command.payload.day },
      deps,
    );

    await deps.EventStore.save([event]);
  };
