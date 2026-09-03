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
  | Events.WorkoutExerciseTargetSetEventType
  | Events.WorkoutStartedEventType;

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
    [Events.WORKOUT_EXERCISE_TARGET_SET_EVENT]: Events.WorkoutExerciseTargetSetEvent,
    [Events.WORKOUT_STARTED_EVENT]: Events.WorkoutStartedEvent,
  });
  // Stryker restore all

  readonly id: VO.WorkoutIdType;
  revision: tools.Revision = new tools.Revision(tools.Revision.INITIAL);
  status = VO.WorkoutStatusEnum.initial;
  userId?: Auth.VO.UserIdType;
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
    scheduledFor: VO.WorkoutScheduledForType,
    userId: Auth.VO.UserIdType,
    deps: Dependencies,
  ): Workout {
    const workout = new Workout(workoutId, deps);

    const WorkoutCreatedEvent = bg.event(
      Events.WorkoutCreatedEvent,
      Workout.getStream(workoutId),
      { workoutId, planId, scheduledFor, userId },
      deps,
    );

    workout.record(WorkoutCreatedEvent);

    return workout;
  }

  addExercise(
    workoutExerciseId: VO.WorkoutExerciseIdType,
    exerciseId: Exercises.VO.ExerciseIdType,
    prescription: VO.ExercisePrescriptionType,
    requesterId: Auth.VO.UserIdType,
  ) {
    Invariants.WorkoutIsDraft.enforce({ status: this.status });
    Invariants.WorkoutBelongsToUser.enforce({ userId: this.userId, requesterId });

    const event = bg.event(
      Events.WorkoutExerciseAddedEvent,
      Workout.getStream(this.id),
      { workoutId: this.id, workoutExerciseId, exerciseId, prescription, requesterId },
      this.deps,
    );

    this.record(event);
  }

  setExerciseTarget(
    workoutExerciseId: VO.WorkoutExerciseIdType,
    target: VO.ExerciseTargetType,
    requesterId: Auth.VO.UserIdType,
  ) {
    Invariants.WorkoutIsDraft.enforce({ status: this.status });
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
        break;
      }

      case Events.WORKOUT_EXERCISE_ADDED_EVENT: {
        this.revision = new tools.Revision(event.revision ?? this.revision.next().value);
        this.exercises.push({
          id: event.payload.workoutExerciseId,
          exerciseId: event.payload.exerciseId,
          prescription: event.payload.prescription,
        });
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
    }
  }

  static getStream(id: VO.WorkoutIdType): bg.EventStreamType {
    return v.parse(bg.EventStream, `workout_${id}`);
  }
}
