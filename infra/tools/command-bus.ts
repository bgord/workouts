import * as bg from "@bgord/bun";
import type * as ExercisesCommands from "+exercises/commands";
import type * as PreferencesCommands from "+preferences/commands";

type Dependencies = { Logger: bg.LoggerPort };

type AcceptedCommand =
  | ExercisesCommands.ExerciseAddCommandType
  | ExercisesCommands.ExerciseUpdateCommandType
  | ExercisesCommands.ExerciseImageChangeCommandType
  | ExercisesCommands.ExerciseDeleteCommandType
  | ExercisesCommands.ExerciseCategoryAddCommandType
  | bg.Preferences.Commands.SetUserLanguageCommandType
  | PreferencesCommands.UpdateProfileAvatarCommandType
  | PreferencesCommands.RemoveProfileAvatarCommandType;

export function createCommandBus(deps: Dependencies): bg.CommandBusPort<AcceptedCommand> {
  const inner = new bg.CommandBusEmitteryAdapter<AcceptedCommand>();

  return new bg.CommandBusWithLoggerAdapter<AcceptedCommand>({ inner, ...deps });
}
