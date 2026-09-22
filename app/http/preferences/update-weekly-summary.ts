import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Preferences from "+preferences";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommandBus: bg.CommandBusPort<Preferences.Commands.WeeklySummarySetCommandType>;
};

export const UpdateWeeklySummary =
  (deps: Dependencies): bg.EndpointPort =>
  async (context) => {
    const body = await context.request.json();

    const userId = context.identity.authenticatedUserId();
    const weeklySummary = v.parse(Preferences.VO.WeeklySummary, body["weeklySummary"]);

    const command = bg.command(
      Preferences.Commands.WeeklySummarySetCommand,
      { payload: { userId, weeklySummary } },
      deps,
    );

    await deps.CommandBus.emit(command);

    return new Response();
  };
