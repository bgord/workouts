# Body-part measurements plan

## Goal

Add user-managed body-part measurement points and dated readings alongside body weight, within the existing **Measurements bounded context**. Keep body weight behavior intact. A measurement point (for example, waist or chest) is a separately managed concept; readings refer to its stable ID rather than its name.

## Product assumptions to confirm before implementation

- Body parts are personal to the user in the first release; no shared/admin catalog.
- Support adding, renaming, and archiving parts. Archive rather than hard-delete so historical readings remain interpretable.
- A reading records one part, one date, and one value. Start with one reading per part per date; correcting a reading edits that record.
- Store circumference as integer millimetres; choose the initial entry/display unit (recommend cm, with 0.1 cm precision). Do not add a new user unit-preference system as part of this work.
- Decide whether to seed common parts for new users or start with an empty, user-created list. Either way, users can manage their own list.
- MVP covers logging, correction, removal, part management, and per-part history. Defer CSV import/export, body-part stats, goals, and dashboard/weekly-summary integration.

## DDD building blocks

### Bounded context

Keep the feature in `modules/measurements`. It shares the user, purpose, and measurement lifecycle with body weight, but it has separate domain concepts and persistence. Do not fold body-part values into `bodyWeightMeasurements`: body weight has weight-specific goals/reference behavior, while body-part readings are typed by a dynamic part ID.

### Entities / aggregate boundaries

| Concept | Identity and responsibilities |
| --- | --- |
| `BodyPart` | Stable `BodyPartId`; owner `UserId`; name; position if user-controlled ordering is included; active/archived status. Owns its naming and lifecycle. |
| `BodyPartMeasurement` | Stable reading ID; `BodyPartId`; `UserId`; measured-on date; canonical length value. A reading can be corrected or removed independently. |

Keep part definitions and readings as separate aggregates/streams. A rename must not rewrite historical events or change reading identity. Archive prevents new readings but keeps existing readings queryable.

### Value objects

Add validated value objects for `BodyPartId`, `BodyPartName`, `BodyPartMeasuredOn`, `BodyPartMeasurementValue` (canonical integer mm), and active/archived status as appropriate. Reuse the app's existing user ID and date conventions. Enforce sensible name length/normalization and a positive, bounded circumference value; surface the chosen input precision and unit in the UI.

### Commands and domain events

Part lifecycle:

- `BodyPartAdd` → `BodyPartAdded`
- `BodyPartRename` → `BodyPartRenamed`
- `BodyPartArchive` → `BodyPartArchived`
- Add reorder command/event only if ordering is included in the confirmed MVP.

Reading lifecycle:

- `BodyPartMeasurementRecord` → `BodyPartMeasurementRecorded`
- `BodyPartMeasurementCorrect` → `BodyPartMeasurementCorrected`
- `BodyPartMeasurementRemove` → `BodyPartMeasurementRemoved`

Events carry stable IDs, owner ID, and only the data relevant to that change. A reading event references `bodyPartId`; it does not embed the part's mutable display name. Emit one reading event for each reading created or changed—not a snapshot of all of the user's readings.

The current event-store inserter assigns revisions for one stream per `save` call. Do not save events from multiple reading streams together as though the operation were atomic. For the MVP, model each reading independently and validate a multi-field form submission before writing its individual commands/events. If atomic multi-part sessions become a requirement, design a `BodyMeasurementSession` aggregate and an explicit session event containing only that submission's readings; decide its correction/replacement semantics before implementing it.

### Invariants and policies

- Part name is non-empty and unique per user among active parts (define case/whitespace normalization).
- Requester owns the part or reading; never trust owner IDs supplied by the client.
- A part must be active when a new reading is recorded; historical readings remain valid after archive.
- Measurement date is not in the future.
- At most one active reading exists for a given user, part, and date (if the one-per-day rule is confirmed); enforce this at the persistence boundary as well as through the command's query/invariant.
- Part archive is not physical deletion. Define duplicate-name behavior after archive (recommend allowing reuse).

### Read models and persistence

Add tables/projections for body parts and body-part measurements in `infra/schema.ts`, with indexes supporting owner/name lookup and owner/part/date history. Keep event data authoritative and Drizzle tables as read projections, following the existing body-weight projector pattern. Use a schema migration under `infra/drizzle/`; preserve existing body-weight data and routes.

Queries should return facts only: the user's active parts, a part's measurements/history, and the part/reading needed for ownership checks. Keep chart aggregation/calculation in a service, not in adapters. Scope every read by authenticated user.

### Application / infrastructure integration

- Add commands, events, handlers, invariants, queries, value objects, and exports under `modules/measurements/`.
- Add adapters under `infra/adapters/measurements/` and expose them through `createMeasurementsAdapters`.
- Register commands in `infra/register-command-handlers.ts` and projector(s) in `infra/register-event-handlers.ts` / `infra/projections/`.
- Extend `infra/tools/event-store.ts`'s accepted event union for each new event type.
- Add authenticated endpoints under `/api/measurements/body-parts/...`; validate path/body input with the existing Valibot conventions and derive the owner from identity.
- Add exports through `app/http/measurements/index.ts`; wire endpoints in `server.ts`.

## Delivery workflow

1. **Confirm product rules** above, especially seeded defaults, unit, uniqueness/date rule, and whether a single form is atomic. Keep the first implementation inside the Measurements BC.
2. **Implement domain/persistence first:** value objects, commands/events, invariants/handlers, schema + migration, projector, adapters/queries, and DI/registration. Keep names and file organization parallel to the existing measurements patterns.
3. **Add API and tests:** authenticated add/rename/archive and record/correct/remove endpoints; tests for validation, future dates, ownership, active/archived parts, duplicate names/readings, and event/projection outcomes.
4. **Design the UI before implementing it:** follow the established workflow by making about three local HTML variants under `tmp/design/` (360px and desktop previews), then wait for the user's choice/tweaks. The selected design should give body parts a distinct section on `/measurements`, with part management, a clear entry flow, per-part history, correction/removal, and empty/error states. Preserve the existing body-weight flow and established rhythm/hierarchy rules.
5. **Implement the selected UI:** add route loader data and UI sections/forms; add translation keys to both `infra/translations/en.json` and `infra/translations/pl.json`, alphabetically sorted, and remove unused keys. Use existing components/tokens; do not add explanatory code comments or modify shared styling/components without need.
6. **Verify using the project workflow only:** run `bash bgord-scripts/typecheck.sh` and `bash bgord-scripts/test.sh`; inspect the feature in Chrome at `http://localhost:3000`, including mobile width (>=360px), empty state, and existing body-weight behavior. Do not run direct `bun test`, `tsc`, or Biome commands.
7. **Stop for user review.** The user makes fine-grained commits; do not commit on their behalf. Do not hand-edit `readme.md` or run its generator.

## Test coverage checklist

- Value-object validation and unit conversion/precision.
- Part add/rename/archive, duplicate-name normalization, and ownership failures.
- Recording/correcting/removing a reading; future-date, range, archived-part, wrong-owner, and duplicate-date cases.
- Projector persistence and query scoping/sorting; history after a part is renamed or archived.
- HTTP auth/validation/status behavior for each endpoint.
- UI: no parts, no readings, successful record/correct/remove, archived parts excluded from new-entry choices, and responsive history.
- Regression: existing body-weight API, loader, chart, import/export, and page remain unchanged in behavior.
