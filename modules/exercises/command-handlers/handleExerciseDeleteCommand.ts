import * as bg from "@bgord/bun";
import type * as Exercises from "+exercises";
import { ExerciseDeletedEvent } from "../events/EXERCISE_DELETED_EVENT";
import { CatalogIsManagedByAdmin } from "../invariants/catalog-is-managed-by-admin";
import { ExerciseExists } from "../invariants/exercise-exists";
import { ExerciseIsNotUsed } from "../invariants/exercise-is-not-used";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommitConfig: bg.StaticConfigPort<bg.CommitShaValueType>;
  EventStore: bg.EventStorePort<Exercises.Events.ExerciseDeletedEventType>;
  GetExerciseQuery: Exercises.Queries.GetExercise;
  GetExerciseUsageCountQuery: Exercises.Queries.GetExerciseUsageCount;
};

export const handleExerciseDeleteCommand =
  (deps: Dependencies) => async (command: Exercises.Commands.ExerciseDeleteCommandType) => {
    CatalogIsManagedByAdmin.enforce({ requesterId: command.payload.requesterId });

    const exercise = await deps.GetExerciseQuery.execute(command.payload.id);

    ExerciseExists.enforce({ exercise });

    const count = await deps.GetExerciseUsageCountQuery.execute(command.payload.id);

    ExerciseIsNotUsed.enforce({ count });

    const event = bg.event(
      ExerciseDeletedEvent,
      `exercise_${command.payload.id}`,
      { id: command.payload.id, image: exercise!.image, requesterId: command.payload.requesterId },
      deps,
    );

    await deps.EventStore.save([event]);
  };
