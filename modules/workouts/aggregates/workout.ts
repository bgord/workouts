import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import type * as Auth from "+auth";
import type * as Plans from "+plans";
import * as Events from "+workouts/events";
import * as VO from "+workouts/value-objects";

export type WorkoutEventType = Events.WorkoutCreatedEventType;

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommitConfig: bg.StaticConfigPort<bg.CommitShaValueType>;
};

export class Workout {
  // Stryker disable all
  static readonly registry = new bg.EventValidatorRegistryAdapter<WorkoutEventType>({
    [Events.WORKOUT_CREATED_EVENT]: Events.WorkoutCreatedEvent,
  });
  // Stryker restore all

  readonly id: VO.WorkoutIdType;
  revision: tools.Revision = new tools.Revision(tools.Revision.INITIAL);
  status = VO.WorkoutStatusEnum.initial;
  userId?: Auth.VO.UserIdType;

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
    }
  }

  static getStream(id: VO.WorkoutIdType): bg.EventStreamType {
    return v.parse(bg.EventStream, `workout_${id}`);
  }
}
