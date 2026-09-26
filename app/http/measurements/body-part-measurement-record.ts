import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Measurements from "+measurements";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommandBus: bg.CommandBusPort<Measurements.Commands.BodyPartMeasurementRecordCommandType>;
};

export const BodyPartMeasurementRecord =
  (deps: Dependencies): bg.EndpointPort =>
  async (context) => {
    const params = context.request.params();
    const body = await context.request.json();
    const userId = context.identity.authenticatedUserId();
    const id = v.parse(Measurements.VO.BodyPartMeasurementId, deps.IdProvider.generate());
    const bodyPartId = v.parse(Measurements.VO.BodyPartId, params["bodyPartId"]);
    const valueMm = v.parse(Measurements.VO.BodyPartMeasurementValue, body["valueMm"]);
    const measuredOn = v.parse(Measurements.VO.BodyPartMeasuredOn, body["measuredOn"]);

    const command = bg.command(
      Measurements.Commands.BodyPartMeasurementRecordCommand,
      { payload: { id, bodyPartId, valueMm, measuredOn, userId } },
      deps,
    );
    await deps.CommandBus.emit(command);

    return Response.json({ id });
  };
