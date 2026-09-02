import * as bg from "@bgord/bun";
import type * as Exercises from "+exercises";
import { ExerciseUpdatedEvent } from "../events/EXERCISE_UPDATED_EVENT";
import { ExerciseBelongsToUser } from "../invariants/exercise-belongs-to-user";
import { ExerciseExists } from "../invariants/exercise-exists";
import { ExerciseHasChanged } from "../invariants/exercise-has-changed";
import { ExerciseNameIsUnique } from "../invariants/exercise-name-is-unique";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommitConfig: bg.StaticConfigPort<bg.CommitShaValueType>;
  EventStore: bg.EventStorePort<Exercises.Events.ExerciseUpdatedEventType>;
  GetExerciseQuery: Exercises.Queries.GetExercise;
  GetExerciseNameCountQuery: Exercises.Queries.GetExerciseNameCount;
};

export const handleExerciseUpdateCommand =
  (deps: Dependencies) => async (command: Exercises.Commands.ExerciseUpdateCommandType) => {
    const exercise = await deps.GetExerciseQuery.execute(command.payload.id);

    ExerciseExists.enforce({ exercise });
    ExerciseBelongsToUser.enforce({ userId: exercise?.userId, requesterId: command.payload.userId });
    ExerciseHasChanged.enforce({
      current: exercise!,
      incoming: { name: command.payload.name, description: command.payload.description },
    });

    const count = await deps.GetExerciseNameCountQuery.execute(command.payload.name);

    ExerciseNameIsUnique.enforce({ count });

    const event = bg.event(
      ExerciseUpdatedEvent,
      `exercise_${command.payload.id}`,
      {
        id: command.payload.id,
        name: command.payload.name,
        description: command.payload.description,
        userId: command.payload.userId,
      },
      deps,
    );

    await deps.EventStore.save([event]);
  };
