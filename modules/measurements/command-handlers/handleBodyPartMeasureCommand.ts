import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type * as Measurements from "+measurements";
import { BodyPartMeasuredEvent } from "../events/BODY_PART_MEASURED_EVENT";
import { BodyPartBelongsToUser } from "../invariants/body-part-belongs-to-user";
import { BodyPartExists } from "../invariants/body-part-exists";
import { BodyPartMeasuredOnIsNotInFuture } from "../invariants/body-part-measured-on-is-not-in-future";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommitConfig: bg.StaticConfigPort<bg.CommitShaValueType>;
  EventStore: bg.EventStorePort<Measurements.Events.BodyPartMeasuredEventType>;
  GetBodyPartQuery: Measurements.Queries.GetBodyPart;
};

export const handleBodyPartMeasureCommand =
  (deps: Dependencies) => async (command: Measurements.Commands.BodyPartMeasureCommandType) => {
    const today = tools.Day.fromTimestamp(deps.Clock.now()).toIsoId();

    BodyPartMeasuredOnIsNotInFuture.enforce({ measuredOn: command.payload.measuredOn, today });

    const bodyParts = await Promise.all(
      command.payload.measurements.map((measurement) =>
        deps.GetBodyPartQuery.execute(measurement.bodyPartId),
      ),
    );

    for (const bodyPart of bodyParts) {
      BodyPartExists.enforce({ bodyPart });
      BodyPartBelongsToUser.enforce({
        userId: bodyPart!.userId,
        requesterId: command.payload.userId,
      });
    }

    for (const measurement of command.payload.measurements) {
      const event = bg.event(
        BodyPartMeasuredEvent,
        `body_part_measurement_${measurement.id}`,
        {
          id: measurement.id,
          bodyPartId: measurement.bodyPartId,
          value: measurement.value,
          measuredOn: command.payload.measuredOn,
          userId: command.payload.userId,
        },
        deps,
      );

      await deps.EventStore.save([event]);
    }
  };
