import * as bg from "@bgord/bun";
import type * as ExercisesCommands from "+exercises/commands";
import type * as PlansCommands from "+plans/commands";
import type * as PreferencesCommands from "+preferences/commands";
import type * as WorkoutsCommands from "+workouts/commands";

type Dependencies = { Logger: bg.LoggerPort; Clock: bg.ClockPort };

type AcceptedCommand =
  | ExercisesCommands.ExerciseAddCommandType
  | ExercisesCommands.ExerciseUpdateCommandType
  | ExercisesCommands.ExerciseImageChangeCommandType
  | ExercisesCommands.ExerciseDeleteCommandType
  | ExercisesCommands.ExerciseCategoryAddCommandType
  | ExercisesCommands.ExerciseCategoryDeleteCommandType
  | ExercisesCommands.ExerciseCategoryRenameCommandType
  | ExercisesCommands.ExerciseAssignCategoryCommandType
  | ExercisesCommands.ExerciseUnassignCategoryCommandType
  | PlansCommands.PlanCreateCommandType
  | PlansCommands.PlanSectionCreateCommandType
  | PlansCommands.PlanSectionRemoveCommandType
  | PlansCommands.PlanSectionRenameCommandType
  | PlansCommands.PlanArchiveCommandType
  | PlansCommands.PlanFinalizeCommandType
  | PlansCommands.PlanRestoreCommandType
  | PlansCommands.PlanEditingEnableCommandType
  | PlansCommands.PlanRenameCommandType
  | PlansCommands.PlanSectionExerciseInstructionAddCommandType
  | PlansCommands.PlanSectionExerciseInstructionRemoveCommandType
  | PlansCommands.PlanSectionExerciseInstructionUpdateCommandType
  | PlansCommands.PlanSectionExerciseInstructionExerciseChangeCommandType
  | bg.Preferences.Commands.SetUserLanguageCommandType
  | PreferencesCommands.UpdateProfileAvatarCommandType
  | PreferencesCommands.RemoveProfileAvatarCommandType
  | WorkoutsCommands.WorkoutCreateCommandType;

export function createCommandBus(deps: Dependencies): bg.CommandBusPort<AcceptedCommand> {
  const inner = new bg.CommandBusEmitteryAdapter<AcceptedCommand>();

  return new bg.CommandBusWithLoggerAdapter<AcceptedCommand>({ inner, ...deps });
}
