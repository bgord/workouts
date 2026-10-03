import * as bg from "@bgord/bun";
import type * as Exercises from "+exercises";
import { ExerciseLoadingChangedEvent } from "../events/EXERCISE_LOADING_CHANGED_EVENT";
import { CatalogIsManagedByAdmin } from "../invariants/catalog-is-managed-by-admin";
import { ExerciseExists } from "../invariants/exercise-exists";
import { ExerciseLoadingHasChanged } from "../invariants/exercise-loading-has-changed";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommitConfig: bg.StaticConfigPort<bg.CommitShaValueType>;
  EventStore: bg.EventStorePort<Exercises.Events.ExerciseLoadingChangedEventType>;
  GetExerciseQuery: Exercises.Queries.GetExercise;
};

export const handleExerciseLoadingChangeCommand =
  (deps: Dependencies) => async (command: Exercises.Commands.ExerciseLoadingChangeCommandType) => {
    CatalogIsManagedByAdmin.enforce({ requesterId: command.payload.requesterId });

    const exercise = await deps.GetExerciseQuery.execute(command.payload.id);

    ExerciseExists.enforce({ exercise });
    ExerciseLoadingHasChanged.enforce({ current: exercise!.loading, incoming: command.payload.loading });

    const event = bg.event(
      ExerciseLoadingChangedEvent,
      `exercise_${command.payload.id}`,
      { id: command.payload.id, loading: command.payload.loading, requesterId: command.payload.requesterId },
      deps,
    );

    await deps.EventStore.save([event]);
  };
