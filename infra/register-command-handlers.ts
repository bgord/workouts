import * as bg from "@bgord/bun";
import { languages } from "+languages";
import * as ExercisesCommandHandlers from "+exercises/command-handlers";
import * as ExercisesCommands from "+exercises/commands";
import type { BootstrapType } from "+infra/bootstrap";
import * as MeasurementsCommandHandlers from "+measurements/command-handlers";
import * as MeasurementsCommands from "+measurements/commands";
import * as PlansCommandHandlers from "+plans/command-handlers";
import * as PlansCommands from "+plans/commands";
import * as PreferencesCommandHandlers from "+preferences/command-handlers";
import * as PreferencesCommands from "+preferences/commands";
import * as WorkoutsCommandHandlers from "+workouts/command-handlers";
import * as WorkoutsCommands from "+workouts/commands";

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
      GetExerciseUsageCountQuery: Adapters.Exercises.GetExerciseUsageCountQuery,
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

  // Plans ==================================================================
  Tools.CommandBus.on(
    PlansCommands.PLAN_CREATE_COMMAND,
    PlansCommandHandlers.handlePlanCreateCommand({
      ...deps,
      repo: Adapters.Plans.PlanRepository,
      GetPlanNameForOwnerCountQuery: Adapters.Plans.GetPlanNameForOwnerCountQuery,
      GetPlanEditableForOwnerCountQuery: Adapters.Plans.GetPlanEditableForOwnerCountQuery,
    }),
  );
  Tools.CommandBus.on(
    PlansCommands.PLAN_SECTION_CREATE_COMMAND,
    PlansCommandHandlers.handlePlanSectionCreateCommand({ ...deps, repo: Adapters.Plans.PlanRepository }),
  );
  Tools.CommandBus.on(
    PlansCommands.PLAN_SECTION_RENAME_COMMAND,
    PlansCommandHandlers.handlePlanSectionRenameCommand({ ...deps, repo: Adapters.Plans.PlanRepository }),
  );
  Tools.CommandBus.on(
    PlansCommands.PLAN_SECTION_REMOVE_COMMAND,
    PlansCommandHandlers.handlePlanSectionRemoveCommand({ ...deps, repo: Adapters.Plans.PlanRepository }),
  );
  Tools.CommandBus.on(
    PlansCommands.PLAN_ARCHIVE_COMMAND,
    PlansCommandHandlers.handlePlanArchiveCommand({ ...deps, repo: Adapters.Plans.PlanRepository }),
  );
  Tools.CommandBus.on(
    PlansCommands.PLAN_FINALIZE_COMMAND,
    PlansCommandHandlers.handlePlanFinalizeCommand({ ...deps, repo: Adapters.Plans.PlanRepository }),
  );
  Tools.CommandBus.on(
    PlansCommands.PLAN_RESTORE_COMMAND,
    PlansCommandHandlers.handlePlanRestoreCommand({
      ...deps,
      repo: Adapters.Plans.PlanRepository,
      GetPlanEditableForOwnerCountQuery: Adapters.Plans.GetPlanEditableForOwnerCountQuery,
    }),
  );
  Tools.CommandBus.on(
    PlansCommands.PLAN_REMOVE_COMMAND,
    PlansCommandHandlers.handlePlanRemoveCommand({ ...deps, repo: Adapters.Plans.PlanRepository }),
  );
  Tools.CommandBus.on(
    PlansCommands.PLAN_EDITING_ENABLE_COMMAND,
    PlansCommandHandlers.handlePlanEditingEnableCommand({ ...deps, repo: Adapters.Plans.PlanRepository }),
  );
  Tools.CommandBus.on(
    PlansCommands.PLAN_RENAME_COMMAND,
    PlansCommandHandlers.handlePlanRenameCommand({
      ...deps,
      repo: Adapters.Plans.PlanRepository,
      GetPlanNameForOwnerCountQuery: Adapters.Plans.GetPlanNameForOwnerCountQuery,
    }),
  );
  Tools.CommandBus.on(
    PlansCommands.PLAN_DESCRIPTION_SET_COMMAND,
    PlansCommandHandlers.handlePlanDescriptionSetCommand({ ...deps, repo: Adapters.Plans.PlanRepository }),
  );
  Tools.CommandBus.on(
    PlansCommands.PLAN_SECTION_EXERCISE_INSTRUCTION_ADD_COMMAND,
    PlansCommandHandlers.handlePlanSectionExerciseInstructionAddCommand({
      ...deps,
      repo: Adapters.Plans.PlanRepository,
      GetExerciseOHQ: Adapters.Exercises.GetExerciseQuery,
    }),
  );
  Tools.CommandBus.on(
    PlansCommands.PLAN_SECTION_EXERCISE_INSTRUCTION_REMOVE_COMMAND,
    PlansCommandHandlers.handlePlanSectionExerciseInstructionRemoveCommand({
      ...deps,
      repo: Adapters.Plans.PlanRepository,
    }),
  );
  Tools.CommandBus.on(
    PlansCommands.PLAN_SECTION_EXERCISE_INSTRUCTION_UPDATE_COMMAND,
    PlansCommandHandlers.handlePlanSectionExerciseInstructionUpdateCommand({
      ...deps,
      repo: Adapters.Plans.PlanRepository,
    }),
  );
  Tools.CommandBus.on(
    PlansCommands.PLAN_SECTION_EXERCISE_INSTRUCTION_EXERCISE_CHANGE_COMMAND,
    PlansCommandHandlers.handlePlanSectionExerciseInstructionExerciseChangeCommand({
      ...deps,
      repo: Adapters.Plans.PlanRepository,
      GetExerciseOHQ: Adapters.Exercises.GetExerciseQuery,
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

  // Workouts ===============================================================
  Tools.CommandBus.on(
    WorkoutsCommands.WORKOUT_CREATE_COMMAND,
    WorkoutsCommandHandlers.handleWorkoutCreateCommand({
      ...deps,
      repo: Adapters.Workouts.WorkoutRepository,
      GetFinalizedPlanOHQ: Adapters.Plans.GetFinalizedPlanQuery,
      GetWorkoutDraftForOwnerCountQuery: Adapters.Workouts.GetWorkoutDraftForOwnerCountQuery,
    }),
  );
  Tools.CommandBus.on(
    WorkoutsCommands.WORKOUT_EXERCISE_ADD_COMMAND,
    WorkoutsCommandHandlers.handleWorkoutExerciseAddCommand({
      ...deps,
      repo: Adapters.Workouts.WorkoutRepository,
      GetExerciseOHQ: Adapters.Exercises.GetExerciseQuery,
    }),
  );
  Tools.CommandBus.on(
    WorkoutsCommands.WORKOUT_EXERCISE_REMOVE_COMMAND,
    WorkoutsCommandHandlers.handleWorkoutExerciseRemoveCommand({
      ...deps,
      repo: Adapters.Workouts.WorkoutRepository,
    }),
  );
  Tools.CommandBus.on(
    WorkoutsCommands.WORKOUT_EXERCISE_SET_TARGET_COMMAND,
    WorkoutsCommandHandlers.handleWorkoutExerciseSetTargetCommand({
      ...deps,
      repo: Adapters.Workouts.WorkoutRepository,
    }),
  );
  Tools.CommandBus.on(
    WorkoutsCommands.WORKOUT_START_COMMAND,
    WorkoutsCommandHandlers.handleWorkoutStartCommand({
      ...deps,
      repo: Adapters.Workouts.WorkoutRepository,
      GetWorkoutInProgressForOwnerCountQuery: Adapters.Workouts.GetWorkoutInProgressForOwnerCountQuery,
    }),
  );
  Tools.CommandBus.on(
    WorkoutsCommands.WORKOUT_SET_LOG_COMMAND,
    WorkoutsCommandHandlers.handleWorkoutSetLogCommand({
      ...deps,
      repo: Adapters.Workouts.WorkoutRepository,
    }),
  );
  Tools.CommandBus.on(
    WorkoutsCommands.WORKOUT_COMPLETE_COMMAND,
    WorkoutsCommandHandlers.handleWorkoutCompleteCommand({
      ...deps,
      repo: Adapters.Workouts.WorkoutRepository,
    }),
  );
  Tools.CommandBus.on(
    WorkoutsCommands.WORKOUT_SET_CORRECT_COMMAND,
    WorkoutsCommandHandlers.handleWorkoutSetCorrectCommand({
      ...deps,
      repo: Adapters.Workouts.WorkoutRepository,
    }),
  );
  Tools.CommandBus.on(
    WorkoutsCommands.WORKOUT_SET_REMOVE_COMMAND,
    WorkoutsCommandHandlers.handleWorkoutSetRemoveCommand({
      ...deps,
      repo: Adapters.Workouts.WorkoutRepository,
    }),
  );
  Tools.CommandBus.on(
    WorkoutsCommands.WORKOUT_DISCARD_COMMAND,
    WorkoutsCommandHandlers.handleWorkoutDiscardCommand({
      ...deps,
      repo: Adapters.Workouts.WorkoutRepository,
    }),
  );
  Tools.CommandBus.on(
    WorkoutsCommands.WORKOUT_NOTE_SET_COMMAND,
    WorkoutsCommandHandlers.handleWorkoutNoteSetCommand({
      ...deps,
      repo: Adapters.Workouts.WorkoutRepository,
    }),
  );
  Tools.CommandBus.on(
    WorkoutsCommands.WORKOUT_RESCHEDULE_COMMAND,
    WorkoutsCommandHandlers.handleWorkoutRescheduleCommand({
      ...deps,
      repo: Adapters.Workouts.WorkoutRepository,
    }),
  );

  // Body weight ============================================================
  Tools.CommandBus.on(
    MeasurementsCommands.BODY_WEIGHT_MEASURE_COMMAND,
    MeasurementsCommandHandlers.handleBodyWeightMeasureCommand(deps),
  );
  Tools.CommandBus.on(
    MeasurementsCommands.BODY_WEIGHT_MEASUREMENTS_IMPORT_COMMAND,
    MeasurementsCommandHandlers.handleBodyWeightMeasurementsImportCommand(deps),
  );
  Tools.CommandBus.on(
    MeasurementsCommands.BODY_WEIGHT_MEASUREMENT_CORRECT_COMMAND,
    MeasurementsCommandHandlers.handleBodyWeightMeasurementCorrectCommand({
      ...deps,
      GetBodyWeightMeasurementQuery: Adapters.Measurements.GetBodyWeightMeasurementQuery,
    }),
  );
  Tools.CommandBus.on(
    MeasurementsCommands.BODY_WEIGHT_MEASUREMENT_REMOVE_COMMAND,
    MeasurementsCommandHandlers.handleBodyWeightMeasurementRemoveCommand({
      ...deps,
      GetBodyWeightMeasurementQuery: Adapters.Measurements.GetBodyWeightMeasurementQuery,
    }),
  );
  Tools.CommandBus.on(
    MeasurementsCommands.BODY_WEIGHT_REFERENCE_SET_COMMAND,
    MeasurementsCommandHandlers.handleBodyWeightReferenceSetCommand({
      ...deps,
      GetBodyWeightMeasurementQuery: Adapters.Measurements.GetBodyWeightMeasurementQuery,
    }),
  );
}
