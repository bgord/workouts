import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Measurements from "+measurements";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommandBus: bg.CommandBusPort<Measurements.Commands.DailyStepsRemoveCommandType>;
};

export const DailyStepsRemove =
  (deps: Dependencies): bg.EndpointPort =>
  async (context) => {
    const params = context.request.params();

    const userId = context.identity.authenticatedUserId();
    const day = v.parse(Measurements.VO.StepsDay, params["day"]);

    const command = bg.command(
      Measurements.Commands.DailyStepsRemoveCommand,
      { payload: { userId, day } },
      deps,
    );

    await deps.CommandBus.emit(command);

    return new Response();
  };
