import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type * as Measurements from "+measurements";
import { BodyPartMeasuredEvent } from "../events/BODY_PART_MEASURED_EVENT";
import { BodyPartExists } from "../invariants/body-part-exists";
import { BodyPartMeasuredOnIsNotInFuture } from "../invariants/body-part-measured-on-is-not-in-future";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommitConfig: bg.StaticConfigPort<bg.CommitShaValueType>;
  EventStore: bg.EventStorePort<Measurements.Events.BodyPartMeasuredEventType>;
  GetBodyPartByNameQuery: Measurements.Queries.GetBodyPartByName;
};

export const handleBodyPartMeasurementsImportCommand =
  (deps: Dependencies) => async (command: Measurements.Commands.BodyPartMeasurementsImportCommandType) => {
    const today = tools.Day.fromTimestamp(
      deps.Clock.now().subtract(command.payload.timeZoneOffset),
    ).toIsoId();

    for (const measurement of command.payload.measurements) {
      BodyPartMeasuredOnIsNotInFuture.enforce({ measuredOn: measurement.measuredOn, today });
    }

    const measurements = await Promise.all(
      command.payload.measurements.map(async (measurement) => {
        const { bodyPart } = BodyPartExists.enforce({
          bodyPart: await deps.GetBodyPartByNameQuery.execute(
            command.payload.userId,
            measurement.bodyPartName,
          ),
        });

        return { measurement, bodyPart };
      }),
    );

    for (const { measurement, bodyPart } of measurements) {
      const event = bg.event(
        BodyPartMeasuredEvent,
        `body_part_measurement_${measurement.id}`,
        {
          id: measurement.id,
          bodyPartId: bodyPart.id,
          value: measurement.value,
          measuredOn: measurement.measuredOn,
          userId: command.payload.userId,
        },
        deps,
      );

      await deps.EventStore.save([event]);
    }
  };
