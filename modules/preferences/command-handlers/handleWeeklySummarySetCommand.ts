import * as bg from "@bgord/bun";
import type * as Preferences from "+preferences";
import { WeeklySummarySetEvent } from "../events/WEEKLY_SUMMARY_SET_EVENT";
import { WeeklySummaryHasChanged } from "../invariants/weekly-summary-has-changed";

type Dependencies = {
  EventStore: bg.EventStorePort<Preferences.Events.WeeklySummarySetEventType>;
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommitConfig: bg.StaticConfigPort<bg.CommitShaValueType>;
  GetWeeklySummaryQuery: Preferences.Queries.GetWeeklySummary;
};

export const handleWeeklySummarySetCommand =
  (deps: Dependencies) => async (command: Preferences.Commands.WeeklySummarySetCommandType) => {
    const current = await deps.GetWeeklySummaryQuery.execute(command.payload.userId);

    if (!WeeklySummaryHasChanged.passes({ current, candidate: command.payload.weeklySummary })) return;

    const event = bg.event(
      WeeklySummarySetEvent,
      `preferences_${command.payload.userId}`,
      { userId: command.payload.userId, weeklySummary: command.payload.weeklySummary },
      deps,
    );

    await deps.EventStore.save([event]);
  };
