import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Plans from "+plans";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommandBus: bg.CommandBusPort<Plans.Commands.PlanCreateCommandType>;
};

export const PlanCreate =
  (deps: Dependencies): bg.EndpointPort =>
  async (context) => {
    const body = await context.request.json();

    const userId = context.identity.authenticatedUserId();
    const id = v.parse(Plans.VO.PlanId, deps.IdProvider.generate());
    const name = v.parse(Plans.VO.PlanName, body["name"]);

    const command = bg.command(Plans.Commands.PlanCreateCommand, { payload: { id, name, userId } }, deps);

    await deps.CommandBus.emit(command);

    return new Response();
  };
