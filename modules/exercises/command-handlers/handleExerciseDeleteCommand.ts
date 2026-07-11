import * as bg from "@bgord/bun";
import type * as Exercises from "+exercises";
import { ExerciseDeletedEvent } from "../events/EXERCISE_DELETED_EVENT";
import { ExerciseExists } from "../invariants/exercise-exists";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  EventStore: bg.EventStorePort<Exercises.Events.ExerciseDeletedEventType>;
  GetExerciseQuery: Exercises.Queries.GetExercise;
};

export const handleExerciseDeleteCommand =
  (deps: Dependencies) => async (command: Exercises.Commands.ExerciseDeleteCommandType) => {
    const exercise = await deps.GetExerciseQuery.execute(command.payload.id);

    ExerciseExists.enforce({ exercise });

    const event = bg.event(
      ExerciseDeletedEvent,
      `exercise_${command.payload.id}`,
      { id: command.payload.id, image: exercise!.image },
      deps,
    );

    await deps.EventStore.save([event]);
  };
