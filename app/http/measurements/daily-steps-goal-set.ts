import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Measurements from "+measurements";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommandBus: bg.CommandBusPort<Measurements.Commands.DailyStepsGoalSetCommandType>;
};

export const DailyStepsGoalSet =
  (deps: Dependencies): bg.EndpointPort =>
  async (context) => {
    const body = await context.request.json();

    const userId = context.identity.authenticatedUserId();
    const goal = v.parse(Measurements.VO.StepsCount, body["goal"]);

    const command = bg.command(
      Measurements.Commands.DailyStepsGoalSetCommand,
      { payload: { userId, goal } },
      deps,
    );

    await deps.CommandBus.emit(command);

    return new Response();
  };
