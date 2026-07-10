import * as bg from "@bgord/bun";
import type * as Exercises from "+exercises";
import { ExerciseDeletedEvent } from "../events/EXERCISE_DELETED_EVENT";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  EventStore: bg.EventStorePort<Exercises.Events.ExerciseDeletedEventType>;
};

export const handleExerciseDeleteCommand =
  (deps: Dependencies) => async (command: Exercises.Commands.ExerciseDeleteCommandType) => {
    const event = bg.event(
      ExerciseDeletedEvent,
      `exercise_${command.payload.id}`,
      // @ts-expect-error
      { id: command.payload.id, image: "TODO" },
      deps,
    );

    await deps.EventStore.save([event]);
  };
