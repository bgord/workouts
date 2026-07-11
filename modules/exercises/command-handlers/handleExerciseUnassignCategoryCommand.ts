import * as bg from "@bgord/bun";
import type * as Exercises from "+exercises";
import { ExerciseCategoryUnassignedEvent } from "../events/EXERCISE_CATEGORY_UNASSIGNED_EVENT";
import { ExerciseCategoryExists } from "../invariants/exercise-category-exists";
import { ExerciseExists } from "../invariants/exercise-exists";
import { ExerciseIsAssignedToCategory } from "../invariants/exercise-is-assigned-to-category";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  EventStore: bg.EventStorePort<Exercises.Events.ExerciseCategoryUnassignedEventType>;
  GetExerciseQuery: Exercises.Queries.GetExercise;
  GetExerciseCategoryQuery: Exercises.Queries.GetExerciseCategory;
  ListCategoriesAssignedToExerciseQuery: Exercises.Queries.ListCategoriesAssignedToExercise;
};

export const handleExerciseUnassignCategoryCommand =
  (deps: Dependencies) => async (command: Exercises.Commands.ExerciseUnassignCategoryCommandType) => {
    const exercise = await deps.GetExerciseQuery.execute(command.payload.exerciseId);

    ExerciseExists.enforce({ exercise });

    const exerciseCategory = await deps.GetExerciseCategoryQuery.execute(command.payload.exerciseCategoryId);

    ExerciseCategoryExists.enforce({ exerciseCategory });

    const exerciseCategories = await deps.ListCategoriesAssignedToExerciseQuery.execute(
      command.payload.exerciseId,
    );

    ExerciseIsAssignedToCategory.enforce({
      exerciseCategories,
      exerciseCategoryId: command.payload.exerciseCategoryId,
    });

    const event = bg.event(
      ExerciseCategoryUnassignedEvent,
      `exercise_${command.payload.exerciseId}`,
      { exerciseId: command.payload.exerciseId, exerciseCategoryId: command.payload.exerciseCategoryId },
      deps,
    );

    await deps.EventStore.save([event]);
  };
