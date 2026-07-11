import * as bg from "@bgord/bun";
import type * as Exercises from "+exercises";
import { ExerciseCategoryAddedEvent } from "../events/EXERCISE_CATEGORY_ADDED_EVENT";
import { ExerciseCategoryNameIsUnique } from "../invariants/exercise-category-name-is-unique";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  EventStore: bg.EventStorePort<Exercises.Events.ExerciseCategoryAddedEventType>;
  GetExerciseCategoryNameCountQuery: Exercises.Queries.GetExerciseCategoryNameCount;
};

export const handleExerciseCategoryAddCommand =
  (deps: Dependencies) => async (command: Exercises.Commands.ExerciseCategoryAddCommandType) => {
    const count = await deps.GetExerciseCategoryNameCountQuery.execute(command.payload.name);

    ExerciseCategoryNameIsUnique.enforce({ count });

    const event = bg.event(
      ExerciseCategoryAddedEvent,
      `exercise_category_${command.payload.id}`,
      { id: command.payload.id, name: command.payload.name },
      deps,
    );

    await deps.EventStore.save([event]);
  };
