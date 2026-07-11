import * as bg from "@bgord/bun";
import { languages } from "+languages";
import * as ExercisesCommandHandlers from "+exercises/command-handlers";
import * as ExercisesCommands from "+exercises/commands";
import type { BootstrapType } from "+infra/bootstrap";
import * as PreferencesCommandHandlers from "+preferences/command-handlers";
import * as PreferencesCommands from "+preferences/commands";

export function registerCommandHandlers({ Adapters, Tools }: BootstrapType) {
  const deps = { ...Adapters.System, ...Tools };

  // Exercises ==============================================================
  Tools.CommandBus.on(
    ExercisesCommands.EXERCISE_ADD_COMMAND,
    ExercisesCommandHandlers.handleExerciseAddCommand({
      ...deps,
      GetExerciseNameCountQuery: Adapters.Exercises.GetExerciseNameCountQuery,
    }),
  );
  Tools.CommandBus.on(
    ExercisesCommands.EXERCISE_UPDATE_COMMAND,
    ExercisesCommandHandlers.handleExerciseUpdateCommand({
      ...deps,
      GetExerciseQuery: Adapters.Exercises.GetExerciseQuery,
      GetExerciseNameCountQuery: Adapters.Exercises.GetExerciseNameCountQuery,
    }),
  );
  Tools.CommandBus.on(
    ExercisesCommands.EXERCISE_IMAGE_CHANGE_COMMAND,
    ExercisesCommandHandlers.handleExerciseImageChangeCommand({
      ...deps,
      GetExerciseQuery: Adapters.Exercises.GetExerciseQuery,
    }),
  );
  Tools.CommandBus.on(
    ExercisesCommands.EXERCISE_DELETE_COMMAND,
    ExercisesCommandHandlers.handleExerciseDeleteCommand({
      ...deps,
      GetExerciseQuery: Adapters.Exercises.GetExerciseQuery,
    }),
  );

  Tools.CommandBus.on(
    ExercisesCommands.EXERCISE_CATEGORY_ADD_COMMAND,
    ExercisesCommandHandlers.handleExerciseCategoryAddCommand({
      ...deps,
      GetExerciseCategoryNameCountQuery: Adapters.Exercises.GetExerciseCategoryNameCountQuery,
    }),
  );
  Tools.CommandBus.on(
    ExercisesCommands.EXERCISE_CATEGORY_RENAME_COMMAND,
    ExercisesCommandHandlers.handleExerciseCategoryRenameCommand({
      ...deps,
      GetExerciseCategoryQuery: Adapters.Exercises.GetExerciseCategoryQuery,
      GetExerciseCategoryNameCountQuery: Adapters.Exercises.GetExerciseCategoryNameCountQuery,
    }),
  );
  Tools.CommandBus.on(
    ExercisesCommands.EXERCISE_CATEGORY_DELETE_COMMAND,
    ExercisesCommandHandlers.handleExerciseCategoryDeleteCommand({
      ...deps,
      GetExerciseCategoryQuery: Adapters.Exercises.GetExerciseCategoryQuery,
    }),
  );

  Tools.CommandBus.on(
    ExercisesCommands.EXERCISE_ASSIGN_CATEGORY_COMMAND,
    ExercisesCommandHandlers.handleExerciseAssignCategoryCommand({
      ...deps,
      GetExerciseQuery: Adapters.Exercises.GetExerciseQuery,
      GetExerciseCategoryQuery: Adapters.Exercises.GetExerciseCategoryQuery,
      ListCategoriesAssignedToExerciseQuery: Adapters.Exercises.ListCategoriesAssignedToExerciseQuery,
    }),
  );
  Tools.CommandBus.on(
    ExercisesCommands.EXERCISE_UNASSIGN_CATEGORY_COMMAND,
    ExercisesCommandHandlers.handleExerciseUnassignCategoryCommand({
      ...deps,
      GetExerciseQuery: Adapters.Exercises.GetExerciseQuery,
      GetExerciseCategoryQuery: Adapters.Exercises.GetExerciseCategoryQuery,
      ListCategoriesAssignedToExerciseQuery: Adapters.Exercises.ListCategoriesAssignedToExerciseQuery,
    }),
  );

  // Preferences ============================================================
  Tools.CommandBus.on(
    bg.Preferences.Commands.SET_USER_LANGUAGE_COMMAND,
    bg.Preferences.CommandHandlers.handleSetUserLanguageCommand(languages, {
      ...deps,
      UserLanguageQuery: Adapters.Preferences.UserLanguageQuery,
    }),
  );

  Tools.CommandBus.on(
    PreferencesCommands.UPDATE_PROFILE_AVATAR_COMMAND,
    PreferencesCommandHandlers.handleUpdateProfileAvatarCommand(deps),
  );

  Tools.CommandBus.on(
    PreferencesCommands.REMOVE_PROFILE_AVATAR_COMMAND,
    PreferencesCommandHandlers.handleRemoveProfileAvatarCommand(deps),
  );
}
