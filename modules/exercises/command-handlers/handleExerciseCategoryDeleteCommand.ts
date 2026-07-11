import * as bg from "@bgord/bun";
import type * as Exercises from "+exercises";
import { ExerciseCategoryDeletedEvent } from "../events/EXERCISE_CATEGORY_DELETED_EVENT";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  EventStore: bg.EventStorePort<Exercises.Events.ExerciseCategoryDeletedEventType>;
};

export const handleExerciseCategoryDeleteCommand =
  (deps: Dependencies) => async (command: Exercises.Commands.ExerciseCategoryDeleteCommandType) => {
    const event = bg.event(
      ExerciseCategoryDeletedEvent,
      `exercise_category_${command.payload.id}`,
      { id: command.payload.id },
      deps,
    );

    await deps.EventStore.save([event]);
  };
