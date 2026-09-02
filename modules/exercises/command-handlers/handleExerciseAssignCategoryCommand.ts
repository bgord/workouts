import * as bg from "@bgord/bun";
import type * as Exercises from "+exercises";
import { ExerciseCategoryAssignedEvent } from "../events/EXERCISE_CATEGORY_ASSIGNED_EVENT";
import { ExerciseBelongsToUser } from "../invariants/exercise-belongs-to-user";
import { ExerciseCategoryBelongsToUser } from "../invariants/exercise-category-belongs-to-user";
import { ExerciseCategoryExists } from "../invariants/exercise-category-exists";
import { ExerciseCategoryLimit } from "../invariants/exercise-category-limit";
import { ExerciseExists } from "../invariants/exercise-exists";
import { ExerciseIsNotAssignedToCategory } from "../invariants/exercise-is-not-assigned-to-category";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommitConfig: bg.StaticConfigPort<bg.CommitShaValueType>;
  EventStore: bg.EventStorePort<Exercises.Events.ExerciseCategoryAssignedEventType>;
  GetExerciseQuery: Exercises.Queries.GetExercise;
  GetExerciseCategoryQuery: Exercises.Queries.GetExerciseCategory;
  ListCategoriesAssignedToExerciseQuery: Exercises.Queries.ListCategoriesAssignedToExercise;
};

export const handleExerciseAssignCategoryCommand =
  (deps: Dependencies) => async (command: Exercises.Commands.ExerciseAssignCategoryCommandType) => {
    const exercise = await deps.GetExerciseQuery.execute(command.payload.exerciseId);

    ExerciseExists.enforce({ exercise });
    ExerciseBelongsToUser.enforce({ userId: exercise?.userId, requesterId: command.payload.userId });

    const exerciseCategory = await deps.GetExerciseCategoryQuery.execute(command.payload.exerciseCategoryId);

    ExerciseCategoryExists.enforce({ exerciseCategory });
    ExerciseCategoryBelongsToUser.enforce({
      userId: exerciseCategory?.userId,
      requesterId: command.payload.userId,
    });

    const exerciseCategories = await deps.ListCategoriesAssignedToExerciseQuery.execute(
      command.payload.exerciseId,
    );

    ExerciseIsNotAssignedToCategory.enforce({
      exerciseCategories,
      exerciseCategoryId: command.payload.exerciseCategoryId,
    });
    ExerciseCategoryLimit.enforce({ exerciseCategories });

    const event = bg.event(
      ExerciseCategoryAssignedEvent,
      `exercise_${command.payload.exerciseId}`,
      {
        exerciseId: command.payload.exerciseId,
        exerciseCategoryId: command.payload.exerciseCategoryId,
        userId: command.payload.userId,
      },
      deps,
    );

    await deps.EventStore.save([event]);
  };
