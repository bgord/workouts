import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Measurements from "+measurements";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommandBus: bg.CommandBusPort<Measurements.Commands.BodyPartMeasureCommandType>;
};

export const BodyPartMeasure =
  (deps: Dependencies): bg.EndpointPort =>
  async (context) => {
    const body = await context.request.json();

    const userId = context.identity.authenticatedUserId();
    const id = v.parse(Measurements.VO.BodyPartMeasurementId, deps.IdProvider.generate());
    const bodyPartId = v.parse(Measurements.VO.BodyPartId, body["bodyPartId"]);
    const value = v.parse(Measurements.VO.BodyPartMeasurementValue, body["value"]);
    const measuredOn = v.parse(Measurements.VO.BodyPartMeasuredOn, body["measuredOn"]);

    const command = bg.command(
      Measurements.Commands.BodyPartMeasureCommand,
      { payload: { id, bodyPartId, value, measuredOn, userId } },
      deps,
    );

    await deps.CommandBus.emit(command);

    return Response.json({ id });
  };
