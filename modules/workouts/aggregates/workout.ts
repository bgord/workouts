import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
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

  pullEvents(): ReadonlyArray<WorkoutEventType> {
    const events = [...this.pending];

    this.pending.length = 0;

    return events;
  }

  private record(event: WorkoutEventType): void {
    this.apply(event);
    this.pending.push(event);
  }

  private apply(_event: WorkoutEventType): void {}

  static getStream(id: VO.WorkoutIdType): bg.EventStreamType {
    return v.parse(bg.EventStream, `workout_${id}`);
  }
}
