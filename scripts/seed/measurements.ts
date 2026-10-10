import * as bg from "@bgord/bun";
import type * as tools from "@bgord/tools";
import * as v from "valibot";
import type * as Auth from "+auth";
import * as Measurements from "+measurements";
import type { BootstrapType } from "+infra/bootstrap";

export async function measureBodyWeight(
  di: BootstrapType,
  userId: Auth.VO.UserIdType,
  measurement: { id: string; grams: number; measuredOn: tools.DayIsoIdType },
) {
  const deps = { ...di.Adapters.System, ...di.Tools };

  const command = bg.command(
    Measurements.Commands.BodyWeightMeasureCommand,
    {
      payload: {
        id: v.parse(Measurements.VO.BodyWeightMeasurementId, measurement.id),
        weight: v.parse(Measurements.VO.BodyWeight, measurement.grams),
        measuredOn: v.parse(Measurements.VO.BodyWeightMeasuredOn, measurement.measuredOn),
        userId,
      },
    },
    deps,
  );

  await di.Tools.CommandBus.emit(command);
}

export async function setBodyWeightReference(
  di: BootstrapType,
  userId: Auth.VO.UserIdType,
  reference: { measurementId: string; goal: Measurements.VO.BodyWeightGoalOptions },
) {
  const deps = { ...di.Adapters.System, ...di.Tools };

  const command = bg.command(
    Measurements.Commands.BodyWeightReferenceSetCommand,
    {
      payload: {
        measurementId: v.parse(Measurements.VO.BodyWeightMeasurementId, reference.measurementId),
        goal: v.parse(Measurements.VO.BodyWeightGoal, reference.goal),
        requesterId: userId,
      },
    },
    deps,
  );

  await di.Tools.CommandBus.emit(command);
}

export async function defineBodyPart(
  di: BootstrapType,
  userId: Auth.VO.UserIdType,
  bodyPart: { id: string; name: string; description?: string },
) {
  const deps = { ...di.Adapters.System, ...di.Tools };

  const command = bg.command(
    Measurements.Commands.BodyPartDefineCommand,
    {
      payload: {
        id: v.parse(Measurements.VO.BodyPartId, bodyPart.id),
        name: v.parse(Measurements.VO.BodyPartName, bodyPart.name),
        description: bodyPart.description
          ? v.parse(Measurements.VO.BodyPartDescription, bodyPart.description)
          : undefined,
        userId,
      },
    },
    deps,
  );

  await di.Tools.CommandBus.emit(command);
}

export async function measureBodyPart(
  di: BootstrapType,
  userId: Auth.VO.UserIdType,
  measurement: { bodyPartId: string; millimeters: number; measuredOn: tools.DayIsoIdType },
) {
  const deps = { ...di.Adapters.System, ...di.Tools };

  const command = bg.command(
    Measurements.Commands.BodyPartMeasureCommand,
    {
      payload: {
        id: v.parse(Measurements.VO.BodyPartMeasurementId, deps.IdProvider.generate()),
        bodyPartId: v.parse(Measurements.VO.BodyPartId, measurement.bodyPartId),
        value: v.parse(Measurements.VO.BodyPartCircumference, measurement.millimeters),
        measuredOn: v.parse(Measurements.VO.BodyPartMeasuredOn, measurement.measuredOn),
        userId,
      },
    },
    deps,
  );

  await di.Tools.CommandBus.emit(command);
}
