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
│       └── user-id.ts
├── exercises
│   ├── command-handlers
│   │   ├── handleExerciseAddCommand.ts
│   │   ├── handleExerciseDeleteCommand.ts
│   ├── commands
│   │   ├── EXERCISE_ADD_COMMAND.ts
│   │   ├── EXERCISE_DELETE_COMMAND.ts
│   │   ├── EXERCISE_UPDATE_COMMAND.ts
│   ├── events
│   │   ├── EXERCISE_ADDED_EVENT.ts
│   │   ├── EXERCISE_DELETED_EVENT.ts
│   │   ├── EXERCISE_UPDATED_EVENT.ts
│   ├── invariants
│   │   ├── exercise-exists.ts
│   │   ├── exercise-image-constraints.ts
│   │   ├── exercise-name-is-unique.ts
│   ├── policies
│   │   ├── exercise-deleter.ts
│   ├── queries
│   │   ├── get-exercise-name-count.ts
│   │   ├── get-exercise.ts
│   │   └── list-exercises.ts
│   └── value-objects
│       ├── exercise-description.ts
│       ├── exercise-id.ts
│       ├── exercise-image-key.ts
│       ├── exercise-image-max-side.ts
│       ├── exercise-image-max-size.ts
│       ├── exercise-image-mime-registry.ts
│       ├── exercise-image-side.ts
│       ├── exercise-name.ts
│       ├── exercise.ts
├── languages.ts
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
│   │   └── set-default-user-language.ts
│   └── value-objects
│       ├── profile-avatar-key.ts
│       ├── profile-avatar-max-side.ts
│       ├── profile-avatar-max-size.ts
│       ├── profile-avatar-mime-registry.ts
│       └── profile-avatar-side.ts
└── supported-languages.ts
```

## App:

```
app/
├── http
│   ├── error-handler.ts
│   ├── exercises
│   │   ├── exercise-add.ts
│   │   ├── exercise-delete.ts
│   │   ├── exercises-list.ts
│   └── preferences
│       ├── get-profile-avatar.ts
│       ├── remove-profile-avatar.ts
│       ├── update-profile-avatar.ts
│       └── update-user-language.ts
```

## Infra:

```
infra/
├── adapters
│   ├── auth
│   │   ├── user-contact.adapter.ts
│   │   └── user-directory.adapter.ts
│   ├── exercises
│   │   ├── get-exercise-name-count.adapter.ts
│   │   ├── get-exercise.adapter.ts
│   │   └── list-exercises.adapter.ts
│   ├── history
│   ├── preferences
│   │   ├── user-language-ohq.adapter.ts
│   │   └── user-language-query.adapter.ts
│   └── system
│       ├── certificate-inspector.adapter.ts
│       ├── clock.adapter.ts
│       ├── disk-space-checker.adapter.ts
│       ├── file-cleaner.adapter.ts
│       ├── file-inspection.adapter.ts
│       ├── file-reader-json.adapter.ts
│       ├── file-renamer.adapter.ts
│       ├── file-writer.adapter.ts
│       ├── hash-file.adapter.ts
│       ├── id-provider.adapter.ts
│       ├── image-info.adapter.ts
│       ├── image-processor.adapter.ts
│       ├── logger.adapter.ts
│       ├── mailer.adapter.ts
│       ├── nonce-provider.adapter.ts
│       ├── remote-file-storage.adapter.ts
│       ├── secure-key-generator.ts
│       ├── sleeper.adapter.ts
│       ├── temporary-file.adapter.ts
│       ├── timekeeper.adapter.ts
│       ├── timeout-runner.adapter.ts
│       └── tmp
├── bootstrap.ts
├── config.ts
├── db.ts
├── e2e
│   └── home.spec.ts
├── env.ts
├── projections
│   ├── preferences.projector.ts
│   └── profile-avatars.projector.ts
├── register-command-handlers.ts
├── register-cron-tasks.ts
├── register-event-handlers.ts
├── schema.ts
├── tools
│   ├── build-info-config.adapter.ts
│   ├── cache-response.ts
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
