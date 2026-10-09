import * as bg from "@bgord/bun";
import type * as Exercises from "+exercises";
import { ExerciseCategoryRoleSetEvent } from "../events/EXERCISE_CATEGORY_ROLE_SET_EVENT";
import { CatalogIsManagedByAdmin } from "../invariants/catalog-is-managed-by-admin";
import { ExerciseCategoryRoleHasChanged } from "../invariants/exercise-category-role-has-changed";
import { ExerciseExists } from "../invariants/exercise-exists";
import { ExerciseIsAssignedToCategory } from "../invariants/exercise-is-assigned-to-category";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommitConfig: bg.StaticConfigPort<bg.CommitShaValueType>;
  EventStore: bg.EventStorePort<Exercises.Events.ExerciseCategoryRoleSetEventType>;
  GetExerciseQuery: Exercises.Queries.GetExercise;
  ListCategoriesAssignedToExerciseQuery: Exercises.Queries.ListCategoriesAssignedToExercise;
};

export const handleExerciseCategoryRoleSetCommand =
  (deps: Dependencies) => async (command: Exercises.Commands.ExerciseCategoryRoleSetCommandType) => {
    CatalogIsManagedByAdmin.enforce({ requesterId: command.payload.requesterId });

    const exercise = await deps.GetExerciseQuery.execute(command.payload.exerciseId);

    ExerciseExists.enforce({ exercise });

    const exerciseCategories = await deps.ListCategoriesAssignedToExerciseQuery.execute(
      command.payload.exerciseId,
    );

    ExerciseIsAssignedToCategory.enforce({
      exerciseCategories,
      exerciseCategoryId: command.payload.exerciseCategoryId,
    });

    const assignment = exerciseCategories.find(
      (exerciseCategory) => exerciseCategory.id === command.payload.exerciseCategoryId,
    );

    ExerciseCategoryRoleHasChanged.enforce({ current: assignment!.role, incoming: command.payload.role });

    const event = bg.event(
      ExerciseCategoryRoleSetEvent,
      `exercise_${command.payload.exerciseId}`,
      {
        exerciseId: command.payload.exerciseId,
        exerciseCategoryId: command.payload.exerciseCategoryId,
        role: command.payload.role,
        requesterId: command.payload.requesterId,
      },
      deps,
    );

    await deps.EventStore.save([event]);
  };
