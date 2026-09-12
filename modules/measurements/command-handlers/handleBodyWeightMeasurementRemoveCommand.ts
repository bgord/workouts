import * as bg from "@bgord/bun";
import type * as Measurements from "+measurements";
import { BodyWeightMeasurementRemovedEvent } from "../events/BODY_WEIGHT_MEASUREMENT_REMOVED_EVENT";
import { BodyWeightEntryBelongsToUser } from "../invariants/body-weight-entry-belongs-to-user";
import { BodyWeightEntryExists } from "../invariants/body-weight-entry-exists";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommitConfig: bg.StaticConfigPort<bg.CommitShaValueType>;
  EventStore: bg.EventStorePort<Measurements.Events.BodyWeightMeasurementRemovedEventType>;
  GetBodyWeightEntryQuery: Measurements.Queries.GetBodyWeightEntry;
};

export const handleBodyWeightMeasurementRemoveCommand =
  (deps: Dependencies) => async (command: Measurements.Commands.BodyWeightMeasurementRemoveCommandType) => {
    const entry = await deps.GetBodyWeightEntryQuery.execute(command.payload.id);

    BodyWeightEntryExists.enforce({ entry });
    BodyWeightEntryBelongsToUser.enforce({ userId: entry!.userId, requesterId: command.payload.requesterId });

    const event = bg.event(
      BodyWeightMeasurementRemovedEvent,
      `body_weight_entry_${command.payload.id}`,
      { id: command.payload.id, requesterId: command.payload.requesterId },
      deps,
    );

    await deps.EventStore.save([event]);
  };
