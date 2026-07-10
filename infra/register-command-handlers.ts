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
      GetExerciseNameCountQuery: Adapters.Exercises.GetExerciseNameCount,
    }),
  );

  Tools.CommandBus.on(
    ExercisesCommands.EXERCISE_DELETE_COMMAND,
    ExercisesCommandHandlers.handleExerciseDeleteCommand(deps),
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
