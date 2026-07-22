import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type * as Auth from "+auth";
import * as Events from "+plans/events";
import * as Invariants from "+plans/invariants";
import * as VO from "+plans/value-objects";

export type PlanEventType =
  | Events.PlanDraftCreatedEventType
  | Events.PlanSectionCreatedEventType
  | Events.PlanSectionRemovedEventType;

type Dependencies = { IdProvider: bg.IdProviderPort; Clock: bg.ClockPort };

export class Plan {
  // Stryker disable all
  static readonly registry = new bg.EventValidatorRegistryAdapter<PlanEventType>({
    [Events.PLAN_DRAFT_CREATED_EVENT]: Events.PlanDraftCreatedEvent,
    [Events.PLAN_SECTION_CREATED_EVENT]: Events.PlanSectionCreatedEvent,
    [Events.PLAN_SECTION_REMOVED_EVENT]: Events.PlanSectionRemovedEvent,
  });
  // Stryker restore all

  readonly id: VO.PlanIdType;
  revision: tools.Revision = new tools.Revision(tools.Revision.INITIAL);
  status = VO.PlanStatusEnum.initial;
  name?: VO.PlanNameType;
  sections: Array<VO.PlanSection> = [];
  ownerId?: Auth.VO.UserIdType;

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
  ): Plan {
    const plan = new Plan(planId, deps);

    const PlanDraftCreatedEvent = bg.event(
      Events.PlanDraftCreatedEvent,
      Plan.getStream(planId),
      { planId, planName, ownerId },
      deps,
    );

    plan.record(PlanDraftCreatedEvent);

    return plan;
  }

  createSection(
    planSectionId: VO.PlanSectionIdType,
    planSectionName: VO.PlanSectionNameType,
    ownerId: Auth.VO.UserIdType,
  ) {
    Invariants.PlanIsEditable.enforce({ status: this.status });
    Invariants.PlanSectionLimitForPlan.enforce({ count: tools.Int.nonNegative(this.sections.length) });
    Invariants.PlanSectionNameIsUniqueForPlan.enforce({ planSectionName, planSections: this.sections });

    const event = bg.event(
      Events.PlanSectionCreatedEvent,
      Plan.getStream(this.id),
      { planId: this.id, planSectionId, planSectionName, ownerId },
      this.deps,
    );

    this.record(event);
  }

  removeSection(planSectionId: VO.PlanSectionIdType, ownerId: Auth.VO.UserIdType) {
    Invariants.PlanIsEditable.enforce({ status: this.status });

    const event = bg.event(
      Events.PlanSectionRemovedEvent,
      Plan.getStream(this.id),
      { planId: this.id, planSectionId, ownerId },
      this.deps,
    );

    this.record(event);
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
        this.status = VO.PlanStatusEnum.draft;
        this.name = event.payload.planName;
        this.ownerId = event.payload.ownerId;
        break;
      }

      case Events.PLAN_SECTION_CREATED_EVENT: {
        this.revision = new tools.Revision(event.revision ?? this.revision.next().value);
        this.sections.push({ id: event.payload.planSectionId, name: event.payload.planSectionName });
        break;
      }

      case Events.PLAN_SECTION_REMOVED_EVENT: {
        this.revision = new tools.Revision(event.revision ?? this.revision.next().value);
        this.sections = this.sections.filter((section) => section.id !== event.payload.planSectionId);
        break;
      }
    }
  }

  static getStream(id: VO.PlanIdType) {
    return `plan_${id}`;
  }
}
