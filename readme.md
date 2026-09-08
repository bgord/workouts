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
│   │   ├── email-verification-notification-composer.ts
│   │   └── password-reset-notification-composer.ts
│   └── value-objects
│       ├── password.ts
│       ├── system-user-id.ts
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
│   │   ├── catalog-is-managed-by-system.ts
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
│   │   ├── get-exercise.ts
│   │   ├── list-categories-assigned-to-exercise.ts
│   │   ├── list-exercise-categories.ts
│   │   ├── list-exercises-with-categories.ts
│   │   ├── list-exercises.ts
│   │   ├── search-exercise-categories.ts
│   │   └── search-exercises.ts
│   ├── services
│   │   ├── exercise-catalog-seeder.ts
│   └── value-objects
│       ├── exercise-catalog-entry.ts
│       ├── exercise-catalog.ts
│       ├── exercise-category-id.ts
│       ├── exercise-category-name.ts
│       ├── exercise-category-name.validation.ts
│       ├── exercise-category.ts
│       ├── exercise-description.ts
│       ├── exercise-id.ts
│       ├── exercise-image-key.ts
│       ├── exercise-image-max-side.ts
│       ├── exercise-image-max-size.ts
│       ├── exercise-image-mime-registry.ts
│       ├── exercise-image-side.ts
│       ├── exercise-name.ts
│       ├── exercise-with-categories.ts
│       ├── exercise.ts
├── languages.ts
├── plans
│   ├── aggregates
│   │   └── plan.ts
│   ├── command-handlers
│   │   ├── handlePlanArchiveCommand.ts
│   │   ├── handlePlanCreateCommand.ts
│   │   ├── handlePlanEditingEnableCommand.ts
│   │   ├── handlePlanFinalizeCommand.ts
│   │   ├── handlePlanRemoveCommand.ts
│   │   ├── handlePlanRenameCommand.ts
│   │   ├── handlePlanRestoreCommand.ts
│   │   ├── handlePlanSectionCreateCommand.ts
│   │   ├── handlePlanSectionExerciseInstructionAddCommand.ts
│   │   ├── handlePlanSectionExerciseInstructionExerciseChangeCommand.ts
│   │   ├── handlePlanSectionExerciseInstructionRemoveCommand.ts
│   │   ├── handlePlanSectionExerciseInstructionUpdateCommand.ts
│   │   ├── handlePlanSectionRemoveCommand.ts
│   │   ├── handlePlanSectionRenameCommand.ts
│   ├── commands
│   │   ├── PLAN_ARCHIVE_COMMAND.ts
│   │   ├── PLAN_CREATE_COMMAND.ts
│   │   ├── PLAN_EDITING_ENABLE_COMMAND.ts
│   │   ├── PLAN_FINALIZE_COMMAND.ts
│   │   ├── PLAN_REMOVE_COMMAND.ts
│   │   ├── PLAN_RENAME_COMMAND.ts
│   │   ├── PLAN_RESTORE_COMMAND.ts
│   │   ├── PLAN_SECTION_CREATE_COMMAND.ts
│   │   ├── PLAN_SECTION_EXERCISE_INSTRUCTION_ADD_COMMAND.ts
│   │   ├── PLAN_SECTION_EXERCISE_INSTRUCTION_EXERCISE_CHANGE_COMMAND.ts
│   │   ├── PLAN_SECTION_EXERCISE_INSTRUCTION_REMOVE_COMMAND.ts
│   │   ├── PLAN_SECTION_EXERCISE_INSTRUCTION_UPDATE_COMMAND.ts
│   │   ├── PLAN_SECTION_REMOVE_COMMAND.ts
│   │   └── PLAN_SECTION_RENAME_COMMAND.ts
│   ├── events
│   │   ├── PLAN_ARCHIVED_EVENT.ts
│   │   ├── PLAN_CREATED_EVENT.ts
│   │   ├── PLAN_EDITING_ENABLED_EVENT.ts
│   │   ├── PLAN_FINALIZED_EVENT.ts
│   │   ├── PLAN_REMOVED_EVENT.ts
│   │   ├── PLAN_RENAMED_EVENT.ts
│   │   ├── PLAN_RESTORED_EVENT.ts
│   │   ├── PLAN_SECTION_CREATED_EVENT.ts
│   │   ├── PLAN_SECTION_EXERCISE_INSTRUCTION_ADDED_EVENT.ts
│   │   ├── PLAN_SECTION_EXERCISE_INSTRUCTION_EXERCISE_CHANGED_EVENT.ts
│   │   ├── PLAN_SECTION_EXERCISE_INSTRUCTION_REMOVED_EVENT.ts
│   │   ├── PLAN_SECTION_EXERCISE_INSTRUCTION_UPDATED_EVENT.ts
│   │   ├── PLAN_SECTION_REMOVED_EVENT.ts
│   │   └── PLAN_SECTION_RENAMED_EVENT.ts
│   ├── invariants
│   │   ├── plan-belongs-to-user.ts
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
│   │   ├── plan-section-exercise-exists.ts
│   │   ├── plan-section-exercise-instruction-exercise-has-changed.ts
│   │   ├── plan-section-exercise-instruction-exists.ts
│   │   ├── plan-section-exercise-instruction-has-changed.ts
│   │   ├── plan-section-exercise-instruction-limit.ts
│   │   ├── plan-section-exists.ts
│   │   ├── plan-section-limit-for-plan.ts
│   │   └── plan-section-name-is-unique-for-plan.ts
│   ├── open-host-queries
│   ├── ports
│   │   └── plan-repository.ts
│   ├── queries
│   │   ├── get-finalized-plan.ts
│   │   ├── get-plan-editable-for-owner-count.ts
│   │   ├── get-plan-name-for-owner-count.ts
│   │   ├── get-plan.ts
│   │   └── list-plans.ts
│   └── value-objects
│       ├── exercise-instruction-id.ts
│       ├── exercise-instruction.ts
│       ├── plan-id.ts
│       ├── plan-name.ts
│       ├── plan-name.validation.ts
│       ├── plan-section-exercise-instruction-limit.ts
│       ├── plan-section-id.ts
│       ├── plan-section-limit-for-plan.ts
│       ├── plan-section-name.ts
│       ├── plan-section-name.validation.ts
│       ├── plan-section.ts
│       ├── plan-status.ts
│       ├── plan-summary.ts
│       ├── plan.ts
│       ├── reps.ts
│       └── sets.ts
├── preferences
│   ├── command-handlers
│   │   ├── handleRemoveProfileAvatarCommand.ts
│   │   ├── handleUpdateProfileAvatarCommand.ts
│   ├── commands
│   │   ├── REMOVE_PROFILE_AVATAR_COMMAND.ts
│   │   └── UPDATE_PROFILE_AVATAR_COMMAND.ts
│   ├── events
│   │   ├── PROFILE_AVATAR_REMOVED_EVENT.ts
│   │   └── PROFILE_AVATAR_UPDATED_EVENT.ts
│   ├── invariants
│   │   └── profile-avatar-constraints.ts
│   ├── policies
│   │   ├── profile-avatar-eraser.ts
│   │   └── set-default-user-language.ts
│   └── value-objects
│       ├── profile-avatar-key.ts
│       ├── profile-avatar-max-side.ts
│       ├── profile-avatar-max-size.ts
│       ├── profile-avatar-mime-registry.ts
│       └── profile-avatar-side.ts
├── stats
│   ├── ports
│   │   └── one-rep-max-estimator.ts
│   ├── queries
│   │   ├── get-exercise-history.ts
│   ├── services
│   │   ├── one-rep-max-estimator-brzycki.ts
│   │   └── one-rep-max-estimator-epley.ts
│   └── value-objects
│       ├── delta.ts
│       ├── exercise-history.ts
│       ├── one-rep-max-estimate.ts
│       └── volume.ts
├── supported-languages.ts
└── workouts
    ├── aggregates
    │   └── workout.ts
    ├── command-handlers
    │   ├── handleWorkoutCompleteCommand.ts
    │   ├── handleWorkoutCreateCommand.ts
    │   ├── handleWorkoutDiscardCommand.ts
    │   ├── handleWorkoutExerciseAddCommand.ts
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
    │   ├── workout-exists.ts
    │   ├── workout-has-logged-sets.ts
    │   ├── workout-in-progress-limit-for-owner.ts
    │   ├── workout-is-correctable.ts
    │   ├── workout-is-draft.ts
    │   ├── workout-is-editable.ts
    │   ├── workout-is-in-progress.ts
    │   ├── workout-is-ready-to-start.ts
    │   ├── workout-logged-set-exists.ts
    │   ├── workout-note-has-changed.ts
    │   ├── workout-plan-ready.ts
    │   ├── workout-plan-section-ready.ts
    │   ├── workout-retains-logged-sets.ts
    │   ├── workout-scheduled-for-has-changed.ts
    │   ├── workout-scheduled-for-is-not-past.ts
    │   └── workout-scheduled-for-is-within-horizon.ts
    ├── ports
    │   └── workout-repository.ts
    ├── queries
    │   ├── get-workout-draft-for-owner-count.ts
    │   ├── get-workout-in-progress-for-owner-count.ts
    │   ├── get-workout.ts
    │   └── list-workouts.ts
    └── value-objects
        ├── exercise-prescription.ts
        ├── exercise-target.ts
        ├── load.ts
        ├── logged-set-id.ts
        ├── logged-set.ts
        ├── reps.ts
        ├── set-number.ts
        ├── sets.ts
        ├── workout-draft-limit-for-owner.ts
        ├── workout-exercise-id.ts
        ├── workout-exercise-limit.ts
        ├── workout-exercise.ts
        ├── workout-id.ts
        ├── workout-in-progress-limit-for-owner.ts
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
│   │   ├── exercise-category-search.ts
│   │   ├── exercise-delete.ts
│   │   ├── exercise-get.ts
│   │   ├── exercise-image-change.ts
│   │   ├── exercise-image-get.ts
│   │   ├── exercise-list.ts
│   │   ├── exercise-search.ts
│   │   ├── exercise-unassign-category.ts
│   │   ├── exercise-update.ts
│   ├── plans
│   │   ├── plan-archive.ts
│   │   ├── plan-create.ts
│   │   ├── plan-editing-enable.ts
│   │   ├── plan-finalize.ts
│   │   ├── plan-get.ts
│   │   ├── plan-list.ts
│   │   ├── plan-remove.ts
│   │   ├── plan-rename.ts
│   │   ├── plan-restore.ts
│   │   ├── plan-section-create.ts
│   │   ├── plan-section-exercise-instruction-add.ts
│   │   ├── plan-section-exercise-instruction-exercise-change.ts
│   │   ├── plan-section-exercise-instruction-remove.ts
│   │   ├── plan-section-exercise-instruction-update.ts
│   │   ├── plan-section-remove.ts
│   │   └── plan-section-rename.ts
│   ├── preferences
│   │   ├── get-profile-avatar.ts
│   │   ├── remove-profile-avatar.ts
│   │   ├── update-profile-avatar.ts
│   │   └── update-user-language.ts
│   ├── stats
│   │   ├── exercise-history-get.ts
│   └── workouts
│       ├── workout-complete.ts
│       ├── workout-create.ts
│       ├── workout-discard.ts
│       ├── workout-exercise-add.ts
│       ├── workout-exercise-remove.ts
│       ├── workout-exercise-set-target.ts
│       ├── workout-get.ts
│       ├── workout-list.ts
│       ├── workout-note-set.ts
│       ├── workout-reschedule.ts
│       ├── workout-set-correct.ts
│       ├── workout-set-log.ts
│       ├── workout-set-remove.ts
│       └── workout-start.ts
└── services
    ├── date-format.ts
    ├── exercise-catalog-filters-form.ts
    ├── exercise-category-add-form.ts
    ├── plan-create-form.ts
    ├── plan-section-create-form.ts
    ├── plan-section-exercise-instruction-add-form.ts
    ├── workout-exercise-add-form.ts
    ├── workout-history-filters-form.ts
    └── workout-note-form.ts
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
│   │   ├── get-exercise.adapter.ts
│   │   ├── list-categories-assigned-to-exercise.adapter.ts
│   │   ├── list-exercise-categories.adapter.ts
│   │   ├── list-exercises-with-categories.adapter.ts
│   │   ├── list-exercises.adapter.ts
│   │   ├── search-exercise-categories.adapter.ts
│   │   └── search-exercises.adapter.ts
│   ├── plans
│   │   ├── get-finalized-plan.adapter.ts
│   │   ├── get-plan-editable-for-owner-count.adapter.ts
│   │   ├── get-plan-name-for-user-count.adapter.ts
│   │   ├── get-plan.adapter.ts
│   │   ├── list-plans.adapter.ts
│   │   └── plan-repository.adapter.ts
│   ├── preferences
│   │   ├── user-language-ohq.adapter.ts
│   │   └── user-language-query.adapter.ts
│   ├── stats
│   │   ├── get-exercise-history.adapter.ts
│   ├── system
│   │   ├── certificate-inspector.adapter.ts
│   │   ├── clock.adapter.ts
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
│       ├── get-workout-draft-for-owner-count.adapter.ts
│       ├── get-workout-in-progress-for-owner-count.adapter.ts
│       ├── get-workout.adapter.ts
│       ├── list-workouts.adapter.ts
│       └── workout-repository.adapter.ts
├── bootstrap.ts
├── config.ts
├── db.ts
├── e2e
│   └── home.spec.ts
├── env.ts
├── exercise-catalog
│   ├── barbell-curl-straight-bar.png
│   ├── bulgarian-split-squat.png
│   ├── cable-overhead-tricep-extension.webp
│   ├── calf-raise-machine.jpeg
│   ├── concentration-curl-dumbbell.png
│   ├── credits.json
│   ├── dumbbell-lateral-raise.png
│   ├── face-pull.webp
│   ├── hammer-curl-dumbbell.png
│   ├── incline-hammer-press.png
│   ├── lat-pulldown.png
│   ├── leg-curl-seated.png
│   ├── leg-extension-single-leg.png
│   ├── leg-press-horizontal.webp
│   ├── low-row-machine.png
│   ├── overhead-press-dumbbell.png
│   ├── pec-deck.png
│   ├── pec-fly-machine.png
│   ├── romanian-deadlift-single-leg-dumbbell.png
│   ├── straight-arm-pulldown.png
│   ├── super-horizontal-bench-press-machine.webp
│   └── tricep-bar-pushdown.png
├── exercise-catalog.json
├── projections
│   ├── exercise-categories.projector.ts
│   ├── exercise-category-assignments.projector.ts
│   ├── exercises.projector.ts
│   ├── plan-section-exercise-instructions.projector.ts
│   ├── plan-sections.projector.ts
│   ├── plans.projector.ts
│   ├── preferences.projector.ts
│   ├── profile-avatars.projector.ts
│   ├── stats-exercise-sets.projector.ts
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
│   ├── hash-content.strategy.ts
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
