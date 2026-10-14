import * as bg from "@bgord/bun";
import type * as Measurements from "+measurements";
import { DailyStepsGoalSetEvent } from "../events/DAILY_STEPS_GOAL_SET_EVENT";
import { DailyStepsGoalHasChanged } from "../invariants/daily-steps-goal-has-changed";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommitConfig: bg.StaticConfigPort<bg.CommitShaValueType>;
  EventStore: bg.EventStorePort<Measurements.Events.DailyStepsGoalSetEventType>;
  GetDailyStepsGoalQuery: Measurements.Queries.GetDailyStepsGoal;
};

export const handleDailyStepsGoalSetCommand =
  (deps: Dependencies) => async (command: Measurements.Commands.DailyStepsGoalSetCommandType) => {
    const current = await deps.GetDailyStepsGoalQuery.execute(command.payload.userId);

    DailyStepsGoalHasChanged.enforce({ current, goal: command.payload.goal });

    const event = bg.event(
      DailyStepsGoalSetEvent,
      `daily_steps_goal_${command.payload.userId}`,
      { userId: command.payload.userId, goal: command.payload.goal },
      deps,
    );

    await deps.EventStore.save([event]);
  };
