import * as bg from "@bgord/bun";
import type * as Measurements from "+measurements";
import { BodyWeightMeasurementCorrectedEvent } from "../events/BODY_WEIGHT_MEASUREMENT_CORRECTED_EVENT";
import { BodyWeightEntryBelongsToUser } from "../invariants/body-weight-entry-belongs-to-user";
import { BodyWeightEntryExists } from "../invariants/body-weight-entry-exists";
import { BodyWeightEntryHasChanged } from "../invariants/body-weight-entry-has-changed";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommitConfig: bg.StaticConfigPort<bg.CommitShaValueType>;
  EventStore: bg.EventStorePort<Measurements.Events.BodyWeightMeasurementCorrectedEventType>;
  GetBodyWeightEntryQuery: Measurements.Queries.GetBodyWeightEntry;
};

export const handleBodyWeightMeasurementCorrectCommand =
  (deps: Dependencies) => async (command: Measurements.Commands.BodyWeightMeasurementCorrectCommandType) => {
    const entry = await deps.GetBodyWeightEntryQuery.execute(command.payload.id);

    BodyWeightEntryExists.enforce({ entry });
    BodyWeightEntryBelongsToUser.enforce({ userId: entry!.userId, requesterId: command.payload.requesterId });
    BodyWeightEntryHasChanged.enforce({
      current: entry!,
      incoming: { weight: command.payload.weight, measuredOn: command.payload.measuredOn },
    });

    const event = bg.event(
      BodyWeightMeasurementCorrectedEvent,
      `body_weight_entry_${command.payload.id}`,
      {
        id: command.payload.id,
        weight: command.payload.weight,
        measuredOn: command.payload.measuredOn,
        requesterId: command.payload.requesterId,
      },
      deps,
    );

    await deps.EventStore.save([event]);
  };
