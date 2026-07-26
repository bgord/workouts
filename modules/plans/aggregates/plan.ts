import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type * as Auth from "+auth";
import * as Events from "+plans/events";
import * as Invariants from "+plans/invariants";
import * as VO from "+plans/value-objects";

export type PlanEventType =
  | Events.PlanCreatedEventType
  | Events.PlanSectionCreatedEventType
  | Events.PlanSectionRemovedEventType
  | Events.PlanSectionRenamedEventType
  | Events.PlanArchivedEventType
  | Events.PlanFinalizedEventType
  | Events.PlanRestoredEventType
  | Events.PlanEditingEnabledEventType
  | Events.PlanRenamedEventType;

type Dependencies = { IdProvider: bg.IdProviderPort; Clock: bg.ClockPort };

export class Plan {
  // Stryker disable all
  static readonly registry = new bg.EventValidatorRegistryAdapter<PlanEventType>({
    [Events.PLAN_CREATED_EVENT]: Events.PlanCreatedEvent,
    [Events.PLAN_SECTION_CREATED_EVENT]: Events.PlanSectionCreatedEvent,
    [Events.PLAN_SECTION_REMOVED_EVENT]: Events.PlanSectionRemovedEvent,
    [Events.PLAN_SECTION_RENAMED_EVENT]: Events.PlanSectionRenamedEvent,
    [Events.PLAN_ARCHIVED_EVENT]: Events.PlanArchivedEvent,
    [Events.PLAN_FINALIZED_EVENT]: Events.PlanFinalizedEvent,
    [Events.PLAN_RESTORED_EVENT]: Events.PlanRestoredEvent,
    [Events.PLAN_EDITING_ENABLED_EVENT]: Events.PlanEditingEnabledEvent,
    [Events.PLAN_RENAMED_EVENT]: Events.PlanRenamedEvent,
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

  static create(
    planId: VO.PlanIdType,
    planName: VO.PlanNameType,
    ownerId: Auth.VO.UserIdType,
    deps: Dependencies,
  ): Plan {
    const plan = new Plan(planId, deps);

    const PlanCreatedEvent = bg.event(
      Events.PlanCreatedEvent,
      Plan.getStream(planId),
      { planId, planName, ownerId },
      deps,
    );

    plan.record(PlanCreatedEvent);

    return plan;
  }

  createSection(
    planSectionId: VO.PlanSectionIdType,
    planSectionName: VO.PlanSectionNameType,
    requesterId: Auth.VO.UserIdType,
  ) {
    Invariants.PlanIsEditable.enforce({ status: this.status });
    Invariants.PlanBelongsToUser.enforce({ ownerId: this.ownerId!, requesterId });
    Invariants.PlanSectionLimitForPlan.enforce({ count: tools.Int.nonNegative(this.sections.length) });
    Invariants.PlanSectionNameIsUniqueForPlan.enforce({ planSectionName, planSections: this.sections });

    const event = bg.event(
      Events.PlanSectionCreatedEvent,
      Plan.getStream(this.id),
      { planId: this.id, planSectionId, planSectionName, ownerId: this.ownerId! },
      this.deps,
    );

    this.record(event);
  }

  removeSection(planSectionId: VO.PlanSectionIdType, requesterId: Auth.VO.UserIdType) {
    Invariants.PlanIsEditable.enforce({ status: this.status });
    Invariants.PlanBelongsToUser.enforce({ ownerId: this.ownerId!, requesterId });
    Invariants.PlanSectionExists.enforce({ planSectionId, planSections: this.sections });

    const event = bg.event(
      Events.PlanSectionRemovedEvent,
      Plan.getStream(this.id),
      { planId: this.id, planSectionId, ownerId: this.ownerId! },
      this.deps,
    );

    this.record(event);
  }

  renameSection(
    planSectionId: VO.PlanSectionIdType,
    planSectionName: VO.PlanSectionNameType,
    requesterId: Auth.VO.UserIdType,
  ) {
    Invariants.PlanIsEditable.enforce({ status: this.status });
    Invariants.PlanBelongsToUser.enforce({ ownerId: this.ownerId!, requesterId });
    Invariants.PlanSectionExists.enforce({ planSectionId, planSections: this.sections });
    Invariants.PlanSectionNameIsUniqueForPlan.enforce({ planSectionName, planSections: this.sections });

    const event = bg.event(
      Events.PlanSectionRenamedEvent,
      Plan.getStream(this.id),
      { planSectionId, planSectionName },
      this.deps,
    );

    this.record(event);
  }

  archive(requesterId: Auth.VO.UserIdType) {
    Invariants.PlanIsArchivable.enforce({ status: this.status });
    Invariants.PlanBelongsToUser.enforce({ ownerId: this.ownerId!, requesterId });

    const event = bg.event(
      Events.PlanArchivedEvent,
      Plan.getStream(this.id),
      { planId: this.id, ownerId: this.ownerId! },
      this.deps,
    );

    this.record(event);
  }

  finalize(requesterId: Auth.VO.UserIdType) {
    Invariants.PlanIsEditable.enforce({ status: this.status });
    Invariants.PlanBelongsToUser.enforce({ ownerId: this.ownerId!, requesterId });
    // Invariants.PlanHasNoEmptySections.enforce({ sections: this.sections })

    const event = bg.event(
      Events.PlanFinalizedEvent,
      Plan.getStream(this.id),
      { planId: this.id, ownerId: this.ownerId! },
      this.deps,
    );

    this.record(event);
  }

  restore(requesterId: Auth.VO.UserIdType) {
    Invariants.PlanIsRestorable.enforce({ status: this.status });
    Invariants.PlanBelongsToUser.enforce({ ownerId: this.ownerId!, requesterId });

    const event = bg.event(
      Events.PlanRestoredEvent,
      Plan.getStream(this.id),
      { planId: this.id, ownerId: this.ownerId! },
      this.deps,
    );

    this.record(event);
  }

  enableEditing(requesterId: Auth.VO.UserIdType) {
    Invariants.PlanIsFinalized.enforce({ status: this.status });
    Invariants.PlanBelongsToUser.enforce({ ownerId: this.ownerId!, requesterId });

    const event = bg.event(
      Events.PlanEditingEnabledEvent,
      Plan.getStream(this.id),
      { planId: this.id, ownerId: this.ownerId! },
      this.deps,
    );

    this.record(event);
  }

  rename(planName: VO.PlanNameType, requesterId: Auth.VO.UserIdType) {
    Invariants.PlanIsEditable.enforce({ status: this.status });
    Invariants.PlanBelongsToUser.enforce({ ownerId: this.ownerId!, requesterId });
    Invariants.PlanNameHasChanged.enforce({ current: this.name!, incoming: planName });

    const event = bg.event(
      Events.PlanRenamedEvent,
      Plan.getStream(this.id),
      { planId: this.id, planName, ownerId: this.ownerId! },
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
      case Events.PLAN_CREATED_EVENT: {
        this.revision = new tools.Revision(event.revision ?? this.revision.next().value);
        this.status = VO.PlanStatusEnum.draft;
        this.name = event.payload.planName;
        this.ownerId = event.payload.ownerId;
        break;
      }

      case Events.PLAN_SECTION_CREATED_EVENT: {
        this.revision = new tools.Revision(event.revision ?? this.revision.next().value);
        this.sections.push({
          id: event.payload.planSectionId,
          name: event.payload.planSectionName,
          exerciseInstructions: [],
        });
        break;
      }

      case Events.PLAN_SECTION_RENAMED_EVENT: {
        this.revision = new tools.Revision(event.revision ?? this.revision.next().value);
        this.sections = this.sections.map((section) =>
          section.id === event.payload.planSectionId
            ? { ...section, name: event.payload.planSectionName }
            : section,
        );
        break;
      }

      case Events.PLAN_SECTION_REMOVED_EVENT: {
        this.revision = new tools.Revision(event.revision ?? this.revision.next().value);
        this.sections = this.sections.filter((section) => section.id !== event.payload.planSectionId);
        break;
      }

      case Events.PLAN_ARCHIVED_EVENT: {
        this.revision = new tools.Revision(event.revision ?? this.revision.next().value);
        this.status = VO.PlanStatusEnum.archived;
        break;
      }

      case Events.PLAN_FINALIZED_EVENT: {
        this.revision = new tools.Revision(event.revision ?? this.revision.next().value);
        this.status = VO.PlanStatusEnum.finalized;
        break;
      }

      case Events.PLAN_RESTORED_EVENT: {
        this.revision = new tools.Revision(event.revision ?? this.revision.next().value);
        this.status = VO.PlanStatusEnum.draft;
        break;
      }

      case Events.PLAN_EDITING_ENABLED_EVENT: {
        this.revision = new tools.Revision(event.revision ?? this.revision.next().value);
        this.status = VO.PlanStatusEnum.draft;
        break;
      }

      case Events.PLAN_RENAMED_EVENT: {
        this.revision = new tools.Revision(event.revision ?? this.revision.next().value);
        this.name = event.payload.planName;
        break;
      }
    }
  }

  static getStream(id: VO.PlanIdType) {
    return `plan_${id}`;
  }
}
