import * as bg from "@bgord/bun";
import type * as Exercises from "+exercises";
import { ExerciseCategoryUnassignedEvent } from "../events/EXERCISE_CATEGORY_UNASSIGNED_EVENT";
import { CatalogIsManagedByAdmin } from "../invariants/catalog-is-managed-by-admin";
import { ExerciseCategoryExists } from "../invariants/exercise-category-exists";
import { ExerciseExists } from "../invariants/exercise-exists";
import { ExerciseIsAssignedToCategory } from "../invariants/exercise-is-assigned-to-category";
import { ExerciseStream } from "../value-objects/exercise-stream";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommitConfig: bg.StaticConfigPort<bg.CommitShaValueType>;
  EventStore: bg.EventStorePort<Exercises.Events.ExerciseCategoryUnassignedEventType>;
  GetExerciseQuery: Exercises.Queries.GetExercise;
  GetExerciseCategoryQuery: Exercises.Queries.GetExerciseCategory;
  ListCategoriesAssignedToExerciseQuery: Exercises.Queries.ListCategoriesAssignedToExercise;
};

export const handleExerciseUnassignCategoryCommand =
  (deps: Dependencies) => async (command: Exercises.Commands.ExerciseUnassignCategoryCommandType) => {
    CatalogIsManagedByAdmin.enforce({ requesterId: command.payload.requesterId });

    const exercise = await deps.GetExerciseQuery.execute(command.payload.exerciseId);

    ExerciseExists.enforce({ exercise });

    const exerciseCategory = await deps.GetExerciseCategoryQuery.execute(command.payload.exerciseCategoryId);

    ExerciseCategoryExists.enforce({ exerciseCategory });

    const exerciseCategories = await deps.ListCategoriesAssignedToExerciseQuery.execute(
      command.payload.exerciseId,
    );

    ExerciseIsAssignedToCategory.enforce({
      assignment: exerciseCategories.find(
        (exerciseCategory) => exerciseCategory.id === command.payload.exerciseCategoryId,
      ),
    });

    const event = bg.event(
      ExerciseCategoryUnassignedEvent,
      ExerciseStream.of(command.payload.exerciseId),
      {
        exerciseId: command.payload.exerciseId,
        exerciseCategoryId: command.payload.exerciseCategoryId,
        requesterId: command.payload.requesterId,
      },
      deps,
    );

    await deps.EventStore.save([event]);
  };
