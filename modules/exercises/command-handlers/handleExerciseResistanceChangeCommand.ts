import * as bg from "@bgord/bun";
import type * as Exercises from "+exercises";
import { ExerciseResistanceChangedEvent } from "../events/EXERCISE_RESISTANCE_CHANGED_EVENT";
import { CatalogIsManagedByAdmin } from "../invariants/catalog-is-managed-by-admin";
import { ExerciseExists } from "../invariants/exercise-exists";
import { ExerciseResistanceHasChanged } from "../invariants/exercise-resistance-has-changed";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommitConfig: bg.StaticConfigPort<bg.CommitShaValueType>;
  EventStore: bg.EventStorePort<Exercises.Events.ExerciseResistanceChangedEventType>;
  GetExerciseQuery: Exercises.Queries.GetExercise;
};

export const handleExerciseResistanceChangeCommand =
  (deps: Dependencies) => async (command: Exercises.Commands.ExerciseResistanceChangeCommandType) => {
    CatalogIsManagedByAdmin.enforce({ requesterId: command.payload.requesterId });

    const exercise = await deps.GetExerciseQuery.execute(command.payload.id);

    ExerciseExists.enforce({ exercise });
    ExerciseResistanceHasChanged.enforce({
      current: exercise!.resistance,
      incoming: command.payload.resistance,
    });

    const event = bg.event(
      ExerciseResistanceChangedEvent,
      `exercise_${command.payload.id}`,
      {
        id: command.payload.id,
        resistance: command.payload.resistance,
        requesterId: command.payload.requesterId,
      },
      deps,
    );

    await deps.EventStore.save([event]);
  };
