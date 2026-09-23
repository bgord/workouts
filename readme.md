# workouts

[![Deploy](https://github.com/bgord/workouts/actions/workflows/deploy-server.yml/badge.svg)](https://github.com/bgord/workouts/actions/workflows/deploy-server.yml)

[![Healthcheck](https://github.com/bgord/workouts/actions/workflows/healthcheck.yml/badge.svg)](https://github.com/bgord/workouts/actions/workflows/healthcheck.yml)

[Check status](https://bgord.github.io/statuses/history/workouts)

## Configuration:

Clone the repository

```
git clone git@github.com:bgord/workouts.git --recurse-submodules
```

Install packages

```
bun i
```

Create env files

```
cp .env.example .env.local
cp .env.example .env.test
```

Start the app

```
./bgord-scripts/server-start-local.sh
```

Run the tests

```
./bgord-scripts/test.sh
```

Generate production master key

Master key fils hould include 64 hex characters

```
bun run bgord-scripts/secrets-encrypt.ts --master-key /run/master-key.txt --input /project/path/.env.production --output /project/path/infra/secrets.enc
```

## Domain:

```
modules/
├── action-state.ts
├── auth
│   ├── events
│   │   ├── ACCOUNT_CREATED_EVENT.ts
│   │   ├── ACCOUNT_DELETED_EVENT.ts
│   ├── open-host-queries
│   │   ├── user-contact.ts
│   │   └── user-directory.ts
│   ├── services
│   │   ├── call-to-action-notification.ts
│   │   ├── email-verification-notification-composer.ts
│   │   └── password-reset-notification-composer.ts
│   └── value-objects
│       ├── admin-user-id.ts
│       ├── password.ts
│       └── user-id.ts
├── exercises
│   ├── command-handlers
│   │   ├── handleExerciseAddCommand.ts
│   │   ├── handleExerciseAssignCategoryCommand.ts
│   │   ├── handleExerciseCategoryAddCommand.ts
│   │   ├── handleExerciseCategoryDeleteCommand.ts
│   │   ├── handleExerciseCategoryRenameCommand.ts
│   │   ├── handleExerciseDeleteCommand.ts
│   │   ├── handleExerciseImageChangeCommand.ts
│   │   ├── handleExerciseUnassignCategoryCommand.ts
│   │   ├── handleExerciseUpdateCommand.ts
│   ├── commands
│   │   ├── EXERCISE_ADD_COMMAND.ts
│   │   ├── EXERCISE_ASSIGN_CATEGORY_COMMAND.ts
│   │   ├── EXERCISE_CATEGORY_ADD_COMMAND.ts
│   │   ├── EXERCISE_CATEGORY_DELETE_COMMAND.ts
│   │   ├── EXERCISE_CATEGORY_RENAME_COMMAND.ts
│   │   ├── EXERCISE_DELETE_COMMAND.ts
│   │   ├── EXERCISE_IMAGE_CHANGE_COMMAND.ts
│   │   ├── EXERCISE_UNASSIGN_CATEGORY_COMMAND.ts
│   │   ├── EXERCISE_UPDATE_COMMAND.ts
│   ├── events
│   │   ├── EXERCISE_ADDED_EVENT.ts
│   │   ├── EXERCISE_CATEGORY_ADDED_EVENT.ts
│   │   ├── EXERCISE_CATEGORY_ASSIGNED_EVENT.ts
│   │   ├── EXERCISE_CATEGORY_DELETED_EVENT.ts
│   │   ├── EXERCISE_CATEGORY_RENAMED_EVENT.ts
│   │   ├── EXERCISE_CATEGORY_UNASSIGNED_EVENT.ts
│   │   ├── EXERCISE_DELETED_EVENT.ts
│   │   ├── EXERCISE_IMAGE_CHANGED_EVENT.ts
│   │   ├── EXERCISE_UPDATED_EVENT.ts
│   ├── invariants
│   │   ├── catalog-is-managed-by-admin.ts
│   │   ├── exercise-category-exists.ts
│   │   ├── exercise-category-limit.ts
│   │   ├── exercise-category-name-is-unique.ts
│   │   ├── exercise-exists.ts
│   │   ├── exercise-has-changed.ts
│   │   ├── exercise-image-constraints.ts
│   │   ├── exercise-is-assigned-to-category.ts
│   │   ├── exercise-is-not-assigned-to-category.ts
│   │   ├── exercise-is-not-used.ts
│   │   ├── exercise-name-is-unique.ts
│   ├── open-host-queries
│   ├── policies
│   │   ├── exercise-deleter.ts
│   ├── queries
│   │   ├── get-exercise-category-name-count.ts
│   │   ├── get-exercise-category.ts
│   │   ├── get-exercise-name-count.ts
│   │   ├── get-exercise-usage-count.ts
│   │   ├── get-exercise-with-categories.ts
│   │   ├── get-exercise.ts
│   │   ├── list-categories-assigned-to-exercise.ts
│   │   ├── list-exercise-categories.ts
│   │   └── list-exercises-with-categories.ts
│   ├── services
│   │   ├── exercise-category-list-actions.ts
│   │   ├── exercise-get-actions.ts
│   │   ├── exercise-list-actions.ts
│   └── value-objects
│       ├── exercise-catalog-entry.ts
│       ├── exercise-catalog.ts
│       ├── exercise-category-id.ts
│       ├── exercise-category-name.ts
│       ├── exercise-category-name.validation.ts
│       ├── exercise-category.ts
│       ├── exercise-description.ts
│       ├── exercise-description.validation.ts
│       ├── exercise-id.ts
│       ├── exercise-image-key.ts
│       ├── exercise-image-max-side.ts
│       ├── exercise-image-max-size.ts
│       ├── exercise-image-mime-registry.ts
│       ├── exercise-image-side.ts
│       ├── exercise-name.ts
│       ├── exercise-name.validation.ts
│       ├── exercise-with-categories.ts
│       ├── exercise.ts
├── languages.ts
├── measurements
│   ├── command-handlers
│   │   ├── handleBodyWeightMeasureCommand.ts
│   │   ├── handleBodyWeightMeasurementCorrectCommand.ts
│   │   ├── handleBodyWeightMeasurementRemoveCommand.ts
│   │   ├── handleBodyWeightMeasurementsImportCommand.ts
│   │   ├── handleBodyWeightReferenceSetCommand.ts
│   ├── commands
│   │   ├── BODY_WEIGHT_MEASURE_COMMAND.ts
│   │   ├── BODY_WEIGHT_MEASUREMENT_CORRECT_COMMAND.ts
│   │   ├── BODY_WEIGHT_MEASUREMENT_REMOVE_COMMAND.ts
│   │   ├── BODY_WEIGHT_MEASUREMENTS_IMPORT_COMMAND.ts
│   │   ├── BODY_WEIGHT_REFERENCE_SET_COMMAND.ts
│   ├── events
│   │   ├── BODY_WEIGHT_MEASURED_EVENT.ts
│   │   ├── BODY_WEIGHT_MEASUREMENT_CORRECTED_EVENT.ts
│   │   ├── BODY_WEIGHT_MEASUREMENT_REMOVED_EVENT.ts
│   │   ├── BODY_WEIGHT_REFERENCE_SET_EVENT.ts
│   ├── invariants
│   │   ├── body-weight-measured-on-is-not-in-future.ts
│   │   ├── body-weight-measurement-belongs-to-user.ts
│   │   ├── body-weight-measurement-exists.ts
│   │   ├── body-weight-measurement-has-changed.ts
│   │   ├── body-weight-reference-has-changed.ts
│   ├── open-host-queries
│   ├── ports
│   ├── queries
│   │   ├── get-body-weight-measurement.ts
│   │   └── list-body-weight-measurements.ts
│   ├── services
│   │   ├── body-weight-average.ts
│   │   ├── body-weight-measurement-export-file-csv.ts
│   │   ├── body-weight-measurement-import-file-csv.ts
│   │   ├── body-weight-stats-calculator.ts
│   └── value-objects
│       ├── body-weight-goal-options.ts
│       ├── body-weight-goal.ts
│       ├── body-weight-measured-on.ts
│       ├── body-weight-measurement-id.ts
│       ├── body-weight-measurement-import-max-size.ts
│       ├── body-weight-measurement-import-mime-registry.ts
│       ├── body-weight-measurement.ts
│       ├── body-weight-stats.ts
│       ├── body-weight.ts
├── notifications
│   ├── events
│   │   ├── WEEKLY_SUMMARY_SENT_EVENT.ts
│   │   └── WEEKLY_SUMMARY_SKIPPED_EVENT.ts
│   ├── invariants
│   │   └── weekly-summary-schedule.ts
│   ├── job-handlers
│   │   └── weekly-summary-compose-job.handler.ts
│   ├── jobs
│   │   └── WEEKLY_SUMMARY_COMPOSE_JOB.ts
│   ├── policies
│   │   └── weekly-summary-scheduler.ts
│   ├── queries
│   │   ├── get-weekly-summary-status.ts
│   ├── services
│   │   ├── weekly-summary-body-weight.ts
│   │   ├── weekly-summary-locales.ts
│   │   ├── weekly-summary-notification.ts
│   │   ├── weekly-summary-range.ts
│   │   └── weekly-summary-totals.ts
│   └── value-objects
│       ├── weekly-summary-status.ts
│       └── weekly-summary-stream.ts
├── plans
│   ├── aggregates
│   │   └── plan.ts
│   ├── command-handlers
│   │   ├── handlePlanArchiveCommand.ts
│   │   ├── handlePlanCreateCommand.ts
│   │   ├── handlePlanDescriptionSetCommand.ts
│   │   ├── handlePlanEditingEnableCommand.ts
│   │   ├── handlePlanFinalizeCommand.ts
│   │   ├── handlePlanRemoveCommand.ts
│   │   ├── handlePlanRenameCommand.ts
│   │   ├── handlePlanRestoreCommand.ts
│   │   ├── handlePlanSectionCooldownSetCommand.ts
│   │   ├── handlePlanSectionCreateCommand.ts
│   │   ├── handlePlanSectionExerciseInstructionAddCommand.ts
│   │   ├── handlePlanSectionExerciseInstructionExerciseChangeCommand.ts
│   │   ├── handlePlanSectionExerciseInstructionMoveCommand.ts
│   │   ├── handlePlanSectionExerciseInstructionRemoveCommand.ts
│   │   ├── handlePlanSectionExerciseInstructionUpdateCommand.ts
│   │   ├── handlePlanSectionRemoveCommand.ts
│   │   ├── handlePlanSectionRenameCommand.ts
│   │   ├── handlePlanSectionWarmupSetCommand.ts
│   ├── commands
│   │   ├── PLAN_ARCHIVE_COMMAND.ts
│   │   ├── PLAN_CREATE_COMMAND.ts
│   │   ├── PLAN_DESCRIPTION_SET_COMMAND.ts
│   │   ├── PLAN_EDITING_ENABLE_COMMAND.ts
│   │   ├── PLAN_FINALIZE_COMMAND.ts
│   │   ├── PLAN_REMOVE_COMMAND.ts
│   │   ├── PLAN_RENAME_COMMAND.ts
│   │   ├── PLAN_RESTORE_COMMAND.ts
│   │   ├── PLAN_SECTION_COOLDOWN_SET_COMMAND.ts
│   │   ├── PLAN_SECTION_CREATE_COMMAND.ts
│   │   ├── PLAN_SECTION_EXERCISE_INSTRUCTION_ADD_COMMAND.ts
│   │   ├── PLAN_SECTION_EXERCISE_INSTRUCTION_EXERCISE_CHANGE_COMMAND.ts
│   │   ├── PLAN_SECTION_EXERCISE_INSTRUCTION_MOVE_COMMAND.ts
│   │   ├── PLAN_SECTION_EXERCISE_INSTRUCTION_REMOVE_COMMAND.ts
│   │   ├── PLAN_SECTION_EXERCISE_INSTRUCTION_UPDATE_COMMAND.ts
│   │   ├── PLAN_SECTION_REMOVE_COMMAND.ts
│   │   ├── PLAN_SECTION_RENAME_COMMAND.ts
│   │   └── PLAN_SECTION_WARMUP_SET_COMMAND.ts
│   ├── events
│   │   ├── PLAN_ARCHIVED_EVENT.ts
│   │   ├── PLAN_CREATED_EVENT.ts
│   │   ├── PLAN_DESCRIPTION_SET_EVENT.ts
│   │   ├── PLAN_EDITING_ENABLED_EVENT.ts
│   │   ├── PLAN_FINALIZED_EVENT.ts
│   │   ├── PLAN_REMOVED_EVENT.ts
│   │   ├── PLAN_RENAMED_EVENT.ts
│   │   ├── PLAN_RESTORED_EVENT.ts
│   │   ├── PLAN_SECTION_COOLDOWN_SET_EVENT.ts
│   │   ├── PLAN_SECTION_CREATED_EVENT.ts
│   │   ├── PLAN_SECTION_EXERCISE_INSTRUCTION_ADDED_EVENT.ts
│   │   ├── PLAN_SECTION_EXERCISE_INSTRUCTION_EXERCISE_CHANGED_EVENT.ts
│   │   ├── PLAN_SECTION_EXERCISE_INSTRUCTION_MOVED_EVENT.ts
│   │   ├── PLAN_SECTION_EXERCISE_INSTRUCTION_REMOVED_EVENT.ts
│   │   ├── PLAN_SECTION_EXERCISE_INSTRUCTION_UPDATED_EVENT.ts
│   │   ├── PLAN_SECTION_REMOVED_EVENT.ts
│   │   ├── PLAN_SECTION_RENAMED_EVENT.ts
│   │   └── PLAN_SECTION_WARMUP_SET_EVENT.ts
│   ├── invariants
│   │   ├── plan-belongs-to-user.ts
│   │   ├── plan-description-has-changed.ts
│   │   ├── plan-exists.ts
│   │   ├── plan-has-no-empty-sections.ts
│   │   ├── plan-has-sections.ts
│   │   ├── plan-is-archivable.ts
│   │   ├── plan-is-editable.ts
│   │   ├── plan-is-finalized.ts
│   │   ├── plan-is-removable.ts
│   │   ├── plan-is-restorable.ts
│   │   ├── plan-limit-for-owner.ts
│   │   ├── plan-name-has-changed.ts
│   │   ├── plan-name-is-unique-for-owner.ts
│   │   ├── plan-section-cooldown-has-changed.ts
│   │   ├── plan-section-exercise-exists.ts
│   │   ├── plan-section-exercise-instruction-exercise-has-changed.ts
│   │   ├── plan-section-exercise-instruction-exists.ts
│   │   ├── plan-section-exercise-instruction-has-changed.ts
│   │   ├── plan-section-exercise-instruction-limit.ts
│   │   ├── plan-section-exercise-instruction-position-has-changed.ts
│   │   ├── plan-section-exercise-instruction-position-in-range.ts
│   │   ├── plan-section-exists.ts
│   │   ├── plan-section-limit-for-plan.ts
│   │   ├── plan-section-name-is-unique-for-plan.ts
│   │   └── plan-section-warmup-has-changed.ts
│   ├── open-host-queries
│   ├── ports
│   │   └── plan-repository.ts
│   ├── queries
│   │   ├── get-finalized-plan.ts
│   │   ├── get-plan-editable-for-owner-count.ts
│   │   ├── get-plan-name-for-owner-count.ts
│   │   ├── get-plan.ts
│   │   └── list-plans.ts
│   ├── services
│   │   ├── plan-get-actions.ts
│   │   ├── plan-get-exercise-instruction-actions.ts
│   │   ├── plan-get-section-actions.ts
│   │   └── plan-list-actions.ts
│   └── value-objects
│       ├── exercise-instruction-id.ts
│       ├── exercise-instruction-position.ts
│       ├── exercise-instruction.ts
│       ├── plan-description.ts
│       ├── plan-description.validation.ts
│       ├── plan-id.ts
│       ├── plan-name.ts
│       ├── plan-name.validation.ts
│       ├── plan-section-cooldown.ts
│       ├── plan-section-cooldown.validation.ts
│       ├── plan-section-exercise-instruction-limit.ts
│       ├── plan-section-id.ts
│       ├── plan-section-limit-for-plan.ts
│       ├── plan-section-name.ts
│       ├── plan-section-name.validation.ts
│       ├── plan-section-warmup.ts
│       ├── plan-section-warmup.validation.ts
│       ├── plan-section.ts
│       ├── plan-status.ts
│       ├── plan-summary.ts
│       ├── plan.ts
│       ├── progression-method-options.ts
│       ├── progression-method.ts
│       ├── reps.ts
│       └── sets.ts
├── preferences
│   ├── command-handlers
│   │   ├── handleRemoveProfileAvatarCommand.ts
│   │   ├── handleUpdateProfileAvatarCommand.ts
│   │   ├── handleWeeklySummarySetCommand.ts
│   ├── commands
│   │   ├── REMOVE_PROFILE_AVATAR_COMMAND.ts
│   │   ├── UPDATE_PROFILE_AVATAR_COMMAND.ts
│   │   └── WEEKLY_SUMMARY_SET_COMMAND.ts
│   ├── events
│   │   ├── PROFILE_AVATAR_REMOVED_EVENT.ts
│   │   ├── PROFILE_AVATAR_UPDATED_EVENT.ts
│   │   └── WEEKLY_SUMMARY_SET_EVENT.ts
│   ├── invariants
│   │   ├── profile-avatar-constraints.ts
│   │   └── weekly-summary-has-changed.ts
│   ├── open-host-queries
│   │   └── weekly-summary.ts
│   ├── policies
│   │   ├── profile-avatar-eraser.ts
│   │   ├── set-default-user-language.ts
│   │   └── set-default-weekly-summary.ts
│   ├── queries
│   │   ├── get-weekly-summary.ts
│   └── value-objects
│       ├── profile-avatar-key.ts
│       ├── profile-avatar-max-side.ts
│       ├── profile-avatar-max-size.ts
│       ├── profile-avatar-mime-registry.ts
│       ├── profile-avatar-side.ts
│       ├── weekly-summary-options.ts
│       └── weekly-summary.ts
├── statistics
│   ├── ports
│   │   └── one-rep-estimator.port.ts
│   ├── services
│   │   ├── exercise-performance-calculator.ts
│   │   ├── one-rep-estimator-brzycki.adapter.ts
│   │   └── one-rep-estimator-epley.adapter.ts
│   └── value-objects
│       ├── exercise-performance.ts
│       └── one-rep-max-estimate.ts
├── supported-languages.ts
└── workouts
    ├── aggregates
    │   └── workout.ts
    ├── command-handlers
    │   ├── handleWorkoutCompleteCommand.ts
    │   ├── handleWorkoutCreateCommand.ts
    │   ├── handleWorkoutDiscardCommand.ts
    │   ├── handleWorkoutExerciseAddCommand.ts
    │   ├── handleWorkoutExerciseMoveCommand.ts
    │   ├── handleWorkoutExerciseRemoveCommand.ts
    │   ├── handleWorkoutExerciseSetTargetCommand.ts
    │   ├── handleWorkoutNoteSetCommand.ts
    │   ├── handleWorkoutRescheduleCommand.ts
    │   ├── handleWorkoutSetCorrectCommand.ts
    │   ├── handleWorkoutSetLogCommand.ts
    │   ├── handleWorkoutSetRemoveCommand.ts
    │   ├── handleWorkoutStartCommand.ts
    ├── commands
    │   ├── WORKOUT_COMPLETE_COMMAND.ts
    │   ├── WORKOUT_CREATE_COMMAND.ts
    │   ├── WORKOUT_DISCARD_COMMAND.ts
    │   ├── WORKOUT_EXERCISE_ADD_COMMAND.ts
    │   ├── WORKOUT_EXERCISE_MOVE_COMMAND.ts
    │   ├── WORKOUT_EXERCISE_REMOVE_COMMAND.ts
    │   ├── WORKOUT_EXERCISE_SET_TARGET_COMMAND.ts
    │   ├── WORKOUT_NOTE_SET_COMMAND.ts
    │   ├── WORKOUT_RESCHEDULE_COMMAND.ts
    │   ├── WORKOUT_SET_CORRECT_COMMAND.ts
    │   ├── WORKOUT_SET_LOG_COMMAND.ts
    │   ├── WORKOUT_SET_REMOVE_COMMAND.ts
    │   └── WORKOUT_START_COMMAND.ts
    ├── events
    │   ├── WORKOUT_COMPLETED_EVENT.ts
    │   ├── WORKOUT_CREATED_EVENT.ts
    │   ├── WORKOUT_DISCARDED_EVENT.ts
    │   ├── WORKOUT_EXERCISE_ADDED_EVENT.ts
    │   ├── WORKOUT_EXERCISE_MOVED_EVENT.ts
    │   ├── WORKOUT_EXERCISE_REMOVED_EVENT.ts
    │   ├── WORKOUT_EXERCISE_TARGET_SET_EVENT.ts
    │   ├── WORKOUT_NOTE_SET_EVENT.ts
    │   ├── WORKOUT_RESCHEDULED_EVENT.ts
    │   ├── WORKOUT_SET_CORRECTED_EVENT.ts
    │   ├── WORKOUT_SET_LOGGED_EVENT.ts
    │   ├── WORKOUT_SET_REMOVED_EVENT.ts
    │   └── WORKOUT_STARTED_EVENT.ts
    ├── invariants
    │   ├── workout-belongs-to-user.ts
    │   ├── workout-catalog-exercise-exists.ts
    │   ├── workout-draft-limit-for-owner.ts
    │   ├── workout-exercise-exists.ts
    │   ├── workout-exercise-limit.ts
    │   ├── workout-exercise-position-has-changed.ts
    │   ├── workout-exercise-position-in-range.ts
    │   ├── workout-exercises-have-targets.ts
    │   ├── workout-exists.ts
    │   ├── workout-has-exercises.ts
    │   ├── workout-has-logged-sets.ts
    │   ├── workout-in-progress-limit-for-owner.ts
    │   ├── workout-is-correctable.ts
    │   ├── workout-is-draft.ts
    │   ├── workout-is-editable.ts
    │   ├── workout-is-in-progress.ts
    │   ├── workout-logged-set-exists.ts
    │   ├── workout-note-has-changed.ts
    │   ├── workout-plan-ready.ts
    │   ├── workout-plan-section-ready.ts
    │   ├── workout-retains-logged-sets.ts
    │   ├── workout-scheduled-for-has-changed.ts
    │   └── workout-scheduled-for-is-within-horizon.ts
    ├── open-host-queries
    ├── ports
    │   └── workout-repository.ts
    ├── queries
    │   ├── get-exercise-previous-performance.ts
    │   ├── get-workout-dashboard.ts
    │   ├── get-workout-status-for-owner-count.ts
    │   ├── get-workout.ts
    │   ├── list-exercise-performances.ts
    │   ├── list-week-completed-workouts.ts
    │   ├── list-workout-export-rows.ts
    │   └── list-workouts.ts
    ├── services
    │   ├── exercise-performance-weakest-set.ts
    │   ├── exercise-target-diff-calculator.ts
    │   ├── logged-sets-volume.ts
    │   ├── progression-method-double-progression.strategy.ts
    │   ├── progression-method-factory.strategy.ts
    │   ├── progression-method-linear-progression.strategy.ts
    │   ├── progression-method-load-step.ts
    │   ├── progression-method.strategy.ts
    │   ├── workout-export-file-csv.ts
    │   ├── workout-get-actions.ts
    │   ├── workout-get-exercise-actions.ts
    │   ├── workout-get-logged-set-actions.ts
    │   └── workout-list-actions.ts
    └── value-objects
        ├── exercise-prescription.ts
        ├── exercise-target-diff.ts
        ├── exercise-target-progression.ts
        ├── exercise-target.ts
        ├── load.ts
        ├── logged-set-id.ts
        ├── logged-set.ts
        ├── reps.ts
        ├── rir-limit.ts
        ├── rir.ts
        ├── set-number.ts
        ├── sets.ts
        ├── workout-draft-limit-for-owner.ts
        ├── workout-exercise-id.ts
        ├── workout-exercise-limit.ts
        ├── workout-exercise-position.ts
        ├── workout-exercise.ts
        ├── workout-id.ts
        ├── workout-in-progress-limit-for-owner.ts
        ├── workout-list-filter-options.ts
        ├── workout-list-filter.ts
        ├── workout-note.ts
        ├── workout-note.validation.ts
        ├── workout-scheduled-for-horizon.ts
        ├── workout-scheduled-for.ts
        ├── workout-status.ts
        ├── workout-summary.ts
        └── workout.ts
```

## App:

```
app/
├── http
│   ├── error-handler.ts
│   ├── exercises
│   │   ├── exercise-add.ts
│   │   ├── exercise-assign-category.ts
│   │   ├── exercise-category-add.ts
│   │   ├── exercise-category-delete.ts
│   │   ├── exercise-category-list.ts
│   │   ├── exercise-category-rename.ts
│   │   ├── exercise-delete.ts
│   │   ├── exercise-get.ts
│   │   ├── exercise-image-change.ts
│   │   ├── exercise-image-get.ts
│   │   ├── exercise-list.ts
│   │   ├── exercise-unassign-category.ts
│   │   ├── exercise-update.ts
│   ├── measurements
│   │   ├── body-weight-measure.ts
│   │   ├── body-weight-measurement-correct.ts
│   │   ├── body-weight-measurement-export.ts
│   │   ├── body-weight-measurement-import.ts
│   │   ├── body-weight-measurement-list.ts
│   │   ├── body-weight-measurement-remove.ts
│   │   ├── body-weight-reference-set.ts
│   ├── plans
│   │   ├── plan-archive.ts
│   │   ├── plan-create.ts
│   │   ├── plan-description-set.ts
│   │   ├── plan-editing-enable.ts
│   │   ├── plan-finalize.ts
│   │   ├── plan-get.ts
│   │   ├── plan-list.ts
│   │   ├── plan-remove.ts
│   │   ├── plan-rename.ts
│   │   ├── plan-restore.ts
│   │   ├── plan-section-cooldown-set.ts
│   │   ├── plan-section-create.ts
│   │   ├── plan-section-exercise-instruction-add.ts
│   │   ├── plan-section-exercise-instruction-exercise-change.ts
│   │   ├── plan-section-exercise-instruction-move.ts
│   │   ├── plan-section-exercise-instruction-remove.ts
│   │   ├── plan-section-exercise-instruction-update.ts
│   │   ├── plan-section-remove.ts
│   │   ├── plan-section-rename.ts
│   │   └── plan-section-warmup-set.ts
│   ├── preferences
│   │   ├── get-profile-avatar.ts
│   │   ├── get-weekly-summary.ts
│   │   ├── remove-profile-avatar.ts
│   │   ├── update-profile-avatar.ts
│   │   ├── update-user-language.ts
│   │   └── update-weekly-summary.ts
│   ├── statistics
│   │   ├── exercise-performances-get.ts
│   └── workouts
│       ├── workout-complete.ts
│       ├── workout-create.ts
│       ├── workout-dashboard.ts
│       ├── workout-discard.ts
│       ├── workout-exercise-add.ts
│       ├── workout-exercise-move.ts
│       ├── workout-exercise-remove.ts
│       ├── workout-exercise-set-target.ts
│       ├── workout-export.ts
│       ├── workout-get.ts
│       ├── workout-list.ts
│       ├── workout-note-set.ts
│       ├── workout-reschedule.ts
│       ├── workout-set-correct.ts
│       ├── workout-set-log.ts
│       ├── workout-set-remove.ts
│       └── workout-start.ts
└── services
    ├── body-weight-measurement-filters-form.ts
    ├── exercise-add-form.ts
    ├── exercise-catalog-filters-form.ts
    ├── exercise-category-add-form.ts
    ├── plan-create-form.ts
    ├── plan-description-form.ts
    ├── plan-section-cooldown-form.ts
    ├── plan-section-create-form.ts
    ├── plan-section-exercise-instruction-add-form.ts
    ├── plan-section-warmup-form.ts
    ├── workout-exercise-add-form.ts
    ├── workout-history-filters-form.ts
    ├── workout-note-form.ts
    └── workout-target-form.ts
```

## Infra:

```
infra/
├── adapters
│   ├── auth
│   │   ├── user-contact.adapter.ts
│   │   └── user-directory.adapter.ts
│   ├── exercises
│   │   ├── get-exercise-category-name-count.adapter.ts
│   │   ├── get-exercise-category.adapter.ts
│   │   ├── get-exercise-name-count.adapter.ts
│   │   ├── get-exercise-usage-count.adapter.ts
│   │   ├── get-exercise-with-categories.adapter.ts
│   │   ├── get-exercise.adapter.ts
│   │   ├── list-categories-assigned-to-exercise.adapter.ts
│   │   ├── list-exercise-categories.adapter.ts
│   │   └── list-exercises-with-categories.adapter.ts
│   ├── measurements
│   │   ├── get-body-weight-measurement.adapter.ts
│   │   └── list-body-weight-measurements.adapter.ts
│   ├── notifications
│   │   ├── get-weekly-summary-status.adapter.ts
│   ├── plans
│   │   ├── get-finalized-plan.adapter.ts
│   │   ├── get-plan-editable-for-owner-count.adapter.ts
│   │   ├── get-plan-name-for-owner-count.adapter.ts
│   │   ├── get-plan.adapter.ts
│   │   ├── list-plans.adapter.ts
│   │   └── plan-repository.adapter.ts
│   ├── preferences
│   │   ├── get-weekly-summary.adapter.ts
│   │   ├── user-language-ohq.adapter.ts
│   │   └── user-language-query.adapter.ts
│   ├── system
│   │   ├── certificate-inspector.adapter.ts
│   │   ├── clock.adapter.ts
│   │   ├── csv-parser.adapter.ts
│   │   ├── csv-stringifier.adapter.ts
│   │   ├── disk-space-checker.adapter.ts
│   │   ├── file-cleaner.adapter.ts
│   │   ├── file-inspection.adapter.ts
│   │   ├── file-reader-json.adapter.ts
│   │   ├── file-reader-raw.adapter.ts
│   │   ├── file-renamer.adapter.ts
│   │   ├── file-writer.adapter.ts
│   │   ├── hash-file.adapter.ts
│   │   ├── id-provider.adapter.ts
│   │   ├── image-info.adapter.ts
│   │   ├── image-processor.adapter.ts
│   │   ├── logger.adapter.ts
│   │   ├── mailer.adapter.ts
│   │   ├── nonce-provider.adapter.ts
│   │   ├── remote-file-storage.adapter.ts
│   │   ├── secure-key-generator.ts
│   │   ├── sleeper.adapter.ts
│   │   ├── temporary-file.adapter.ts
│   │   ├── timekeeper.adapter.ts
│   │   ├── timeout-runner.adapter.ts
│   │   └── tmp
│   └── workouts
│       ├── get-exercise-previous-performance.adapter.ts
│       ├── get-workout-dashboard.adapter.ts
│       ├── get-workout-status-for-owner-count.adapter.ts
│       ├── get-workout.adapter.ts
│       ├── list-exercise-performances.adapter.ts
│       ├── list-week-completed-workouts.adapter.ts
│       ├── list-workout-export-rows.adapter.ts
│       ├── list-workouts.adapter.ts
│       ├── to-workout-summary.ts
│       └── workout-repository.adapter.ts
├── bootstrap.ts
├── config.ts
├── db.ts
├── e2e
│   └── home.spec.ts
├── env.ts
├── projections
│   ├── body-weight-measurements.projector.ts
│   ├── exercise-categories.projector.ts
│   ├── exercise-category-assignments.projector.ts
│   ├── exercises.projector.ts
│   ├── plan-section-exercise-instructions.projector.ts
│   ├── plan-sections.projector.ts
│   ├── plans.projector.ts
│   ├── preferences.projector.ts
│   ├── profile-avatars.projector.ts
│   ├── weekly-summaries.projector.ts
│   ├── workout-exercises.projector.ts
│   ├── workout-logged-sets.projector.ts
│   └── workouts.projector.ts
├── register-command-handlers.ts
├── register-cron-tasks.ts
├── register-event-handlers.ts
├── schema.ts
├── tools
│   ├── build-info-config.adapter.ts
│   ├── command-bus.ts
│   ├── cron-scheduler.adapter.ts
│   ├── event-bus.ts
│   ├── event-handler.ts
│   ├── event-store.ts
│   ├── event-upcaster.ts
│   ├── hash-content.strategy.ts
│   ├── job-queue.adapter.ts
│   ├── prerequisites.ts
│   ├── shield-auth.strategy.ts
│   ├── shield-basic-auth.strategy.ts
│   ├── shield-captcha.strategy.ts
│   ├── shield-rate-limit.strategy.ts
│   ├── shield-security.strategy.ts
│   ├── shield-timeout.strategy.ts
│   └── translations-provider.adapter.ts
└── translations
    ├── en.json
    └── pl.json
```
