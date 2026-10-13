import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Measurements from "+measurements";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommandBus: bg.CommandBusPort<Measurements.Commands.DailyStepsRecordCommandType>;
};

export const DailyStepsRecord =
  (deps: Dependencies): bg.EndpointPort =>
  async (context) => {
    const body = await context.request.json();

    const userId = context.identity.authenticatedUserId();
    const day = v.parse(Measurements.VO.StepsDay, body["day"]);
    const provider = new Measurements.Services.StepsProviderManualStrategy({
      count: v.parse(Measurements.VO.StepsCount, body["count"]),
    });

    const command = bg.command(
      Measurements.Commands.DailyStepsRecordCommand,
      { payload: { userId, day, count: await provider.provide(), source: provider.source } },
      deps,
    );

    await deps.CommandBus.emit(command);

    return new Response();
  };
