import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type * as Auth from "+auth";
import * as Events from "+plans/events";
import type * as VO from "+plans/value-objects";

export type PlanEventType = Events.PlanDraftCreatedEventType;

type Dependencies = { IdProvider: bg.IdProviderPort; Clock: bg.ClockPort };

export class Plan {
  // Stryker disable all
  static readonly registry = new bg.EventValidatorRegistryAdapter<PlanEventType>({
    [Events.PLAN_DRAFT_CREATED_EVENT]: Events.PlanDraftCreatedEvent,
  });
  // Stryker restore all

  readonly id: VO.PlanIdType;
  public revision: tools.Revision = new tools.Revision(tools.Revision.INITIAL);
  private ownerId?: Auth.VO.UserIdType;
  name: VO.PlanNameType;

  private readonly pending: Array<PlanEventType> = [];

  private constructor(
    id: VO.PlanIdType,
    readonly deps: Dependencies,
  ) {
    this.id = id;
  }

  static build(id: VO.PlanIdType, events: ReadonlyArray<PlanEventType>, deps: Dependencies): Plan {
    const plan = new Plan(id, deps);

    events.forEach((event) => plan.apply(event));

    return plan;
  }

  static createDraft(
    planId: VO.PlanIdType,
    planName: VO.PlanNameType,
    ownerId: Auth.VO.UserIdType,
    deps: Dependencies,
  ) {
    const plan = new Plan(planId, deps);

    const PlanDraftCreatedEvent = bg.event(
      Events.PlanDraftCreatedEvent,
      Plan.getStream(planId),
      { id: planId, name: planName, ownerId },
      deps,
    );

    plan.record(PlanDraftCreatedEvent);

    return plan;
  }

  pullEvents(): ReadonlyArray<PlanEventType> {
    const events = [...this.pending];

    this.pending.length = 0;

    return events;
  }

  private record(event: PlanEventType): void {
    this.apply(event);
    this.pending.push(event);
  }

  private apply(event: PlanEventType): void {
    switch (event.name) {
      case Events.PLAN_DRAFT_CREATED_EVENT: {
        this.revision = new tools.Revision(event.revision ?? this.revision.next().value);
        this.name = event.payload.name;
        this.ownerId = event.payload.ownerId;
        break;
      }
    }
  }

  static getStream(id: VO.PlanIdType) {
    return `plan_${id}`;
  }
}
