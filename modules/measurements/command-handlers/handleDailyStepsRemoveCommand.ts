import * as bg from "@bgord/bun";
import type * as Measurements from "+measurements";
import { DailyStepsRemovedEvent } from "../events/DAILY_STEPS_REMOVED_EVENT";
import { DailyStepsExists } from "../invariants/daily-steps-exists";

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
      `daily_steps_${command.payload.userId}_${command.payload.day}`,
      { userId: command.payload.userId, day: command.payload.day },
      deps,
    );

    await deps.EventStore.save([event]);
  };
