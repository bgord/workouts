import * as bg from "@bgord/bun";
import type * as Exercises from "+exercises";
import { ExerciseCategoryRenamedEvent } from "../events/EXERCISE_CATEGORY_RENAMED_EVENT";
import { ExerciseCategoryExists } from "../invariants/exercise-category-exists";
import { ExerciseCategoryNameIsUnique } from "../invariants/exercise-category-name-is-unique";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  EventStore: bg.EventStorePort<Exercises.Events.ExerciseCategoryRenamedEventType>;
  GetExerciseCategoryNameCountQuery: Exercises.Queries.GetExerciseCategoryNameCount;
  GetExerciseCategoryQuery: Exercises.Queries.GetExerciseCategory;
};

export const handleExerciseCategoryRenameCommand =
  (deps: Dependencies) => async (command: Exercises.Commands.ExerciseCategoryRenameCommandType) => {
    const exerciseCategory = await deps.GetExerciseCategoryQuery.execute(command.payload.id);

    ExerciseCategoryExists.enforce({ exerciseCategory });

    const count = await deps.GetExerciseCategoryNameCountQuery.execute(command.payload.name);

    ExerciseCategoryNameIsUnique.enforce({ count });

    const event = bg.event(
      ExerciseCategoryRenamedEvent,
      `exercise_category_${command.payload.id}`,
      { id: command.payload.id, name: command.payload.name },
      deps,
    );

    await deps.EventStore.save([event]);
  };
