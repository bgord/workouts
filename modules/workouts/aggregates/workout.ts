/* cSpell:disable */
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import type * as Auth from "+auth";
import type * as Exercises from "+exercises";
import type * as Plans from "+plans";
import * as Events from "+workouts/events";
import * as Invariants from "+workouts/invariants";
import * as VO from "+workouts/value-objects";

export type WorkoutEventType =
  | Events.WorkoutCreatedEventType
  | Events.WorkoutExerciseAddedEventType
  | Events.WorkoutExerciseRemovedEventType
  | Events.WorkoutExerciseTargetSetEventType
  | Events.WorkoutStartedEventType
  | Events.WorkoutSetLoggedEventType
  | Events.WorkoutCompletedEventType
  | Events.WorkoutDiscardedEventType
  | Events.WorkoutSetCorrectedEventType
  | Events.WorkoutSetRemovedEventType
  | Events.WorkoutNoteSetEventType
  | Events.WorkoutRescheduledEventType;

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommitConfig: bg.StaticConfigPort<bg.CommitShaValueType>;
};

export class Workout {
  // Stryker disable all
  static readonly registry = new bg.EventValidatorRegistryAdapter<WorkoutEventType>({
    [Events.WORKOUT_CREATED_EVENT]: Events.WorkoutCreatedEvent,
    [Events.WORKOUT_EXERCISE_ADDED_EVENT]: Events.WorkoutExerciseAddedEvent,
    [Events.WORKOUT_EXERCISE_REMOVED_EVENT]: Events.WorkoutExerciseRemovedEvent,
    [Events.WORKOUT_EXERCISE_TARGET_SET_EVENT]: Events.WorkoutExerciseTargetSetEvent,
    [Events.WORKOUT_STARTED_EVENT]: Events.WorkoutStartedEvent,
    [Events.WORKOUT_SET_LOGGED_EVENT]: Events.WorkoutSetLoggedEvent,
    [Events.WORKOUT_SET_CORRECTED_EVENT]: Events.WorkoutSetCorrectedEvent,
    [Events.WORKOUT_SET_REMOVED_EVENT]: Events.WorkoutSetRemovedEvent,
    [Events.WORKOUT_COMPLETED_EVENT]: Events.WorkoutCompletedEvent,
    [Events.WORKOUT_DISCARDED_EVENT]: Events.WorkoutDiscardedEvent,
    [Events.WORKOUT_NOTE_SET_EVENT]: Events.WorkoutNoteSetEvent,
    [Events.WORKOUT_RESCHEDULED_EVENT]: Events.WorkoutRescheduledEvent,
  });
  // Stryker restore all

  readonly id: VO.WorkoutIdType;
  revision: tools.Revision = new tools.Revision(tools.Revision.INITIAL);
  status = VO.WorkoutStatusEnum.initial;
  userId?: Auth.VO.UserIdType;
  scheduledFor?: VO.WorkoutScheduledForType;
  note?: VO.WorkoutNoteType;
  exercises: Array<VO.WorkoutExercise> = [];

  private readonly pending: Array<WorkoutEventType> = [];

  private constructor(
    id: VO.WorkoutIdType,
    readonly deps: Dependencies,
  ) {
    this.id = id;
  }

  static build(id: VO.WorkoutIdType, events: ReadonlyArray<WorkoutEventType>, deps: Dependencies): Workout {
    const workout = new Workout(id, deps);

    events.forEach((event) => workout.apply(event));

    Invariants.WorkoutExists.enforce({ status: workout.status });

    return workout;
  }

  static create(
    workoutId: VO.WorkoutIdType,
    planId: Plans.VO.PlanIdType,
    planName: Plans.VO.PlanNameType,
    planSectionId: Plans.VO.PlanSectionIdType,
    planSectionName: Plans.VO.PlanSectionNameType,
    scheduledFor: VO.WorkoutScheduledForType,
    userId: Auth.VO.UserIdType,
    deps: Dependencies,
  ): Workout {
    const workout = new Workout(workoutId, deps);

    const WorkoutCreatedEvent = bg.event(
      Events.WorkoutCreatedEvent,
      Workout.getStream(workoutId),
      { workoutId, planId, planName, planSectionId, planSectionName, scheduledFor, userId },
      deps,
    );

    workout.record(WorkoutCreatedEvent);

    return workout;
  }

  addExercise(
    workoutExerciseId: VO.WorkoutExerciseIdType,
    exerciseId: Exercises.VO.ExerciseIdType,
    exerciseName: Exercises.VO.ExerciseNameType,
    prescription: VO.ExercisePrescriptionType,
    requesterId: Auth.VO.UserIdType,
  ) {
    Invariants.WorkoutIsEditable.enforce({ status: this.status });
    Invariants.WorkoutBelongsToUser.enforce({ userId: this.userId, requesterId });
    Invariants.WorkoutExerciseLimit.enforce({ workoutExercises: this.exercises });

    const event = bg.event(
      Events.WorkoutExerciseAddedEvent,
      Workout.getStream(this.id),
      { workoutId: this.id, workoutExerciseId, exerciseId, exerciseName, prescription, requesterId },
      this.deps,
    );

    this.record(event);
  }

  removeExercise(workoutExerciseId: VO.WorkoutExerciseIdType, requesterId: Auth.VO.UserIdType) {
    Invariants.WorkoutIsEditable.enforce({ status: this.status });
    Invariants.WorkoutBelongsToUser.enforce({ userId: this.userId, requesterId });
    Invariants.WorkoutExerciseExists.enforce({ workoutExerciseId, workoutExercises: this.exercises });

    const event = bg.event(
      Events.WorkoutExerciseRemovedEvent,
      Workout.getStream(this.id),
      { workoutId: this.id, workoutExerciseId, requesterId },
      this.deps,
    );

    this.record(event);
  }

  setExerciseTarget(
    workoutExerciseId: VO.WorkoutExerciseIdType,
    target: VO.ExerciseTargetType,
    requesterId: Auth.VO.UserIdType,
  ) {
    Invariants.WorkoutIsEditable.enforce({ status: this.status });
    Invariants.WorkoutBelongsToUser.enforce({ userId: this.userId, requesterId });
    Invariants.WorkoutExerciseExists.enforce({ workoutExerciseId, workoutExercises: this.exercises });

    const event = bg.event(
      Events.WorkoutExerciseTargetSetEvent,
      Workout.getStream(this.id),
      { workoutId: this.id, workoutExerciseId, target, requesterId },
      this.deps,
    );

    this.record(event);
  }

  start(requesterId: Auth.VO.UserIdType) {
    Invariants.WorkoutIsDraft.enforce({ status: this.status });
    Invariants.WorkoutBelongsToUser.enforce({ userId: this.userId, requesterId });
    Invariants.WorkoutIsReadyToStart.enforce({ workoutExercises: this.exercises });

    const event = bg.event(
      Events.WorkoutStartedEvent,
      Workout.getStream(this.id),
      { workoutId: this.id, requesterId },
      this.deps,
    );

    this.record(event);
  }

  logSet(
    workoutExerciseId: VO.WorkoutExerciseIdType,
    loggedSetId: VO.LoggedSetIdType,
    reps: VO.RepsType,
    load: VO.LoadType,
    rir: VO.RirType | undefined,
    requesterId: Auth.VO.UserIdType,
  ) {
    Invariants.WorkoutIsInProgress.enforce({ status: this.status });
    Invariants.WorkoutBelongsToUser.enforce({ userId: this.userId, requesterId });
    Invariants.WorkoutExerciseExists.enforce({ workoutExerciseId, workoutExercises: this.exercises });

    const exercise = this.exercises.find((exercise) => exercise.id === workoutExerciseId);
    const setNumber = v.parse(VO.SetNumber, exercise!.loggedSets.length + 1);

    const event = bg.event(
      Events.WorkoutSetLoggedEvent,
      Workout.getStream(this.id),
      {
        workoutId: this.id,
        workoutExerciseId,
        loggedSet: { id: loggedSetId, setNumber, reps, load, rir },
        requesterId,
      },
      this.deps,
    );

    this.record(event);
  }

  correctSet(
    workoutExerciseId: VO.WorkoutExerciseIdType,
    loggedSetId: VO.LoggedSetIdType,
    reps: VO.RepsType,
    load: VO.LoadType,
    rir: VO.RirType | undefined,
    requesterId: Auth.VO.UserIdType,
  ) {
    const workoutExercise = this.exercises.find((exercise) => exercise.id === workoutExerciseId);

    Invariants.WorkoutIsCorrectable.enforce({ status: this.status });
    Invariants.WorkoutBelongsToUser.enforce({ userId: this.userId, requesterId });
    Invariants.WorkoutExerciseExists.enforce({ workoutExerciseId, workoutExercises: this.exercises });
    Invariants.WorkoutLoggedSetExists.enforce({ workoutExercise, loggedSetId });

    const current = workoutExercise?.loggedSets.find((loggedSet) => loggedSet.id === loggedSetId);

    const event = bg.event(
      Events.WorkoutSetCorrectedEvent,
      Workout.getStream(this.id),
      {
        workoutId: this.id,
        workoutExerciseId,
        loggedSet: { id: loggedSetId, setNumber: current!.setNumber, reps, load, rir },
        requesterId,
      },
      this.deps,
    );

    this.record(event);
  }

  removeSet(
    workoutExerciseId: VO.WorkoutExerciseIdType,
    loggedSetId: VO.LoggedSetIdType,
    requesterId: Auth.VO.UserIdType,
  ) {
    const workoutExercise = this.exercises.find((exercise) => exercise.id === workoutExerciseId);

    Invariants.WorkoutIsCorrectable.enforce({ status: this.status });
    Invariants.WorkoutBelongsToUser.enforce({ userId: this.userId, requesterId });
    Invariants.WorkoutExerciseExists.enforce({ workoutExerciseId, workoutExercises: this.exercises });
    Invariants.WorkoutLoggedSetExists.enforce({ workoutExercise, loggedSetId });
    Invariants.WorkoutRetainsLoggedSets.enforce({
      status: this.status,
      count: tools.Int.nonNegative(
        this.exercises.reduce((total, exercise) => total + exercise.loggedSets.length, 0),
      ),
    });

    const event = bg.event(
      Events.WorkoutSetRemovedEvent,
      Workout.getStream(this.id),
      { workoutId: this.id, workoutExerciseId, loggedSetId, requesterId },
      this.deps,
    );

    this.record(event);
  }

  complete(requesterId: Auth.VO.UserIdType) {
    Invariants.WorkoutIsInProgress.enforce({ status: this.status });
    Invariants.WorkoutBelongsToUser.enforce({ userId: this.userId, requesterId });
    Invariants.WorkoutHasLoggedSets.enforce({ workoutExercises: this.exercises });

    const event = bg.event(
      Events.WorkoutCompletedEvent,
      Workout.getStream(this.id),
      { workoutId: this.id, requesterId },
      this.deps,
    );

    this.record(event);
  }

  discard(requesterId: Auth.VO.UserIdType) {
    Invariants.WorkoutBelongsToUser.enforce({ userId: this.userId, requesterId });

    const event = bg.event(
      Events.WorkoutDiscardedEvent,
      Workout.getStream(this.id),
      { workoutId: this.id, requesterId },
      this.deps,
    );

    this.record(event);
  }

  setNote(note: VO.WorkoutNoteType | undefined, requesterId: Auth.VO.UserIdType) {
    Invariants.WorkoutBelongsToUser.enforce({ userId: this.userId, requesterId });
    Invariants.WorkoutNoteHasChanged.enforce({ current: this.note, incoming: note });

    const event = bg.event(
      Events.WorkoutNoteSetEvent,
      Workout.getStream(this.id),
      { workoutId: this.id, note, requesterId },
      this.deps,
    );

    this.record(event);
  }

  reschedule(scheduledFor: VO.WorkoutScheduledForType, requesterId: Auth.VO.UserIdType) {
    Invariants.WorkoutIsDraft.enforce({ status: this.status });
    Invariants.WorkoutBelongsToUser.enforce({ userId: this.userId, requesterId });
    Invariants.WorkoutScheduledForHasChanged.enforce({ current: this.scheduledFor, incoming: scheduledFor });

    const event = bg.event(
      Events.WorkoutRescheduledEvent,
      Workout.getStream(this.id),
      { workoutId: this.id, scheduledFor, requesterId },
      this.deps,
    );

    this.record(event);
  }

  pullEvents(): ReadonlyArray<WorkoutEventType> {
    const events = [...this.pending];

    this.pending.length = 0;

    return events;
  }

  private record(event: WorkoutEventType): void {
    this.apply(event);
    this.pending.push(event);
  }

  private apply(event: WorkoutEventType): void {
    switch (event.name) {
      case Events.WORKOUT_CREATED_EVENT: {
        this.revision = new tools.Revision(event.revision ?? this.revision.next().value);
        this.status = VO.WorkoutStatusEnum.draft;
        this.userId = event.payload.userId;
        this.scheduledFor = event.payload.scheduledFor;
        break;
      }

      case Events.WORKOUT_EXERCISE_ADDED_EVENT: {
        this.revision = new tools.Revision(event.revision ?? this.revision.next().value);
        this.exercises.push({
          id: event.payload.workoutExerciseId,
          exerciseId: event.payload.exerciseId,
          exerciseName: event.payload.exerciseName,
          prescription: event.payload.prescription,
          loggedSets: [],
        });
        break;
      }

      case Events.WORKOUT_EXERCISE_REMOVED_EVENT: {
        this.revision = new tools.Revision(event.revision ?? this.revision.next().value);
        this.exercises = this.exercises.filter((exercise) => exercise.id !== event.payload.workoutExerciseId);
        break;
      }

      case Events.WORKOUT_EXERCISE_TARGET_SET_EVENT: {
        this.revision = new tools.Revision(event.revision ?? this.revision.next().value);
        this.exercises = this.exercises.map((exercise) =>
          exercise.id === event.payload.workoutExerciseId
            ? { ...exercise, target: event.payload.target }
            : exercise,
        );
        break;
      }

      case Events.WORKOUT_STARTED_EVENT: {
        this.revision = new tools.Revision(event.revision ?? this.revision.next().value);
        this.status = VO.WorkoutStatusEnum.in_progress;
        break;
      }

      case Events.WORKOUT_SET_LOGGED_EVENT: {
        this.revision = new tools.Revision(event.revision ?? this.revision.next().value);
        this.exercises = this.exercises.map((exercise) =>
          exercise.id === event.payload.workoutExerciseId
            ? { ...exercise, loggedSets: [...exercise.loggedSets, event.payload.loggedSet] }
            : exercise,
        );
        break;
      }

      case Events.WORKOUT_SET_CORRECTED_EVENT: {
        this.revision = new tools.Revision(event.revision ?? this.revision.next().value);
        this.exercises = this.exercises.map((exercise) =>
          exercise.id === event.payload.workoutExerciseId
            ? {
                ...exercise,
                loggedSets: exercise.loggedSets.map((loggedSet) =>
                  loggedSet.id === event.payload.loggedSet.id ? event.payload.loggedSet : loggedSet,
                ),
              }
            : exercise,
        );
        break;
      }

      case Events.WORKOUT_SET_REMOVED_EVENT: {
        this.revision = new tools.Revision(event.revision ?? this.revision.next().value);
        this.exercises = this.exercises.map((exercise) =>
          exercise.id === event.payload.workoutExerciseId
            ? {
                ...exercise,
                loggedSets: exercise.loggedSets
                  .filter((loggedSet) => loggedSet.id !== event.payload.loggedSetId)
                  .map((loggedSet, index) => ({ ...loggedSet, setNumber: v.parse(VO.SetNumber, index + 1) })),
              }
            : exercise,
        );
        break;
      }

      case Events.WORKOUT_COMPLETED_EVENT: {
        this.revision = new tools.Revision(event.revision ?? this.revision.next().value);
        this.status = VO.WorkoutStatusEnum.completed;
        break;
      }

      case Events.WORKOUT_DISCARDED_EVENT: {
        this.revision = new tools.Revision(event.revision ?? this.revision.next().value);
        this.status = VO.WorkoutStatusEnum.discarded;
        break;
      }

      case Events.WORKOUT_NOTE_SET_EVENT: {
        this.revision = new tools.Revision(event.revision ?? this.revision.next().value);
        this.note = event.payload.note;
        break;
      }

      case Events.WORKOUT_RESCHEDULED_EVENT: {
        this.revision = new tools.Revision(event.revision ?? this.revision.next().value);
        this.scheduledFor = event.payload.scheduledFor;
        break;
      }
    }
  }

  static getStream(id: VO.WorkoutIdType): bg.EventStreamType {
    return v.parse(bg.EventStream, `workout_${id}`);
  }
}
