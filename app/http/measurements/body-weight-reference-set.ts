import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Measurements from "+measurements";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommandBus: bg.CommandBusPort<Measurements.Commands.BodyWeightReferenceSetCommandType>;
};

export const BodyWeightReferenceSet =
  (deps: Dependencies): bg.EndpointPort =>
  async (context) => {
    const params = context.request.params();
    const body = await context.request.json();

    const requesterId = context.identity.authenticatedUserId();
    const measurementId = v.parse(Measurements.VO.BodyWeightMeasurementId, params["bodyWeightMeasurementId"]);
    const goal = v.parse(Measurements.VO.BodyWeightGoal, body["goal"]);

    const command = bg.command(
      Measurements.Commands.BodyWeightReferenceSetCommand,
      { payload: { measurementId, goal, requesterId } },
      deps,
    );

    await deps.CommandBus.emit(command);

    return new Response();
  };
