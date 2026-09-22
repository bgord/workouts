import * as bg from "@bgord/bun";
import * as Auth from "+auth";
import {
  WeeklySummarySetCommand,
  type WeeklySummarySetCommandType,
} from "../commands/WEEKLY_SUMMARY_SET_COMMAND";
import { WeeklySummaryDefault } from "../value-objects/weekly-summary";

type Dependencies = {
  EventBus: bg.EventBusPort<Auth.Events.AccountCreatedEventType>;
  EventHandler: bg.EventHandlerStrategy;
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommandBus: bg.CommandBusPort<WeeklySummarySetCommandType>;
};

export class SetDefaultWeeklySummary {
  // Stryker disable all
  constructor(private readonly deps: Dependencies) {
    this.deps.EventBus.on(
      Auth.Events.ACCOUNT_CREATED_EVENT,
      this.deps.EventHandler.handle(this.onAccountCreatedEvent.bind(this)),
    );
  }
  // Stryker restore all

  async onAccountCreatedEvent(event: Auth.Events.AccountCreatedEventType) {
    const command = bg.command(
      WeeklySummarySetCommand,
      { payload: { userId: event.payload.userId, weeklySummary: WeeklySummaryDefault } },
      this.deps,
    );

    await this.deps.CommandBus.emit(command);
  }
}
