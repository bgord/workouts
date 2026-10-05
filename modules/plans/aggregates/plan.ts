import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import type * as Auth from "+auth";
import * as Entities from "+plans/entities";
import * as Events from "+plans/events";
import * as Invariants from "+plans/invariants";
import * as VO from "+plans/value-objects";

export type PlanEventType =
  | Events.PlanCreatedEventType
  | Events.PlanSectionCreatedEventType
  | Events.PlanSectionRemovedEventType
  | Events.PlanSectionRenamedEventType
  | Events.PlanSectionWarmupSetEventType
  | Events.PlanSectionCooldownSetEventType
  | Events.PlanArchivedEventType
  | Events.PlanFinalizedEventType
  | Events.PlanRestoredEventType
  | Events.PlanRemovedEventType
  | Events.PlanEditingEnabledEventType
  | Events.PlanRenamedEventType
  | Events.PlanDescriptionSetEventType
  | Events.PlanSectionExerciseInstructionAddedEventType
  | Events.PlanSectionExerciseInstructionRemovedEventType
  | Events.PlanSectionExerciseInstructionUpdatedEventType
  | Events.PlanSectionExerciseInstructionExerciseChangedEventType
  | Events.PlanSectionExerciseInstructionMovedEventType;

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommitConfig: bg.StaticConfigPort<bg.CommitShaValueType>;
};

export class Plan {
  // Stryker disable all
  static readonly registry = new bg.EventValidatorRegistryAdapter<PlanEventType>({
    [Events.PLAN_CREATED_EVENT]: Events.PlanCreatedEvent,
    [Events.PLAN_SECTION_CREATED_EVENT]: Events.PlanSectionCreatedEvent,
    [Events.PLAN_SECTION_REMOVED_EVENT]: Events.PlanSectionRemovedEvent,
    [Events.PLAN_SECTION_RENAMED_EVENT]: Events.PlanSectionRenamedEvent,
    [Events.PLAN_SECTION_WARMUP_SET_EVENT]: Events.PlanSectionWarmupSetEvent,
    [Events.PLAN_SECTION_COOLDOWN_SET_EVENT]: Events.PlanSectionCooldownSetEvent,
    [Events.PLAN_ARCHIVED_EVENT]: Events.PlanArchivedEvent,
    [Events.PLAN_FINALIZED_EVENT]: Events.PlanFinalizedEvent,
    [Events.PLAN_RESTORED_EVENT]: Events.PlanRestoredEvent,
    [Events.PLAN_REMOVED_EVENT]: Events.PlanRemovedEvent,
    [Events.PLAN_EDITING_ENABLED_EVENT]: Events.PlanEditingEnabledEvent,
    [Events.PLAN_RENAMED_EVENT]: Events.PlanRenamedEvent,
    [Events.PLAN_DESCRIPTION_SET_EVENT]: Events.PlanDescriptionSetEvent,
    [Events.PLAN_SECTION_EXERCISE_INSTRUCTION_ADDED_EVENT]: Events.PlanSectionExerciseInstructionAddedEvent,
    [Events.PLAN_SECTION_EXERCISE_INSTRUCTION_REMOVED_EVENT]:
      Events.PlanSectionExerciseInstructionRemovedEvent,
    [Events.PLAN_SECTION_EXERCISE_INSTRUCTION_UPDATED_EVENT]:
      Events.PlanSectionExerciseInstructionUpdatedEvent,
    [Events.PLAN_SECTION_EXERCISE_INSTRUCTION_EXERCISE_CHANGED_EVENT]:
      Events.PlanSectionExerciseInstructionExerciseChangedEvent,
    [Events.PLAN_SECTION_EXERCISE_INSTRUCTION_MOVED_EVENT]: Events.PlanSectionExerciseInstructionMovedEvent,
  });
  // Stryker restore all

  readonly id: VO.PlanIdType;
  revision: tools.Revision = new tools.Revision(tools.Revision.INITIAL);
  private status = VO.PlanStatusEnum.initial;
  private name?: VO.PlanNameType;
  private description?: VO.PlanDescriptionType;
  private sections: Array<Entities.PlanSection> = [];
  private userId?: Auth.VO.UserIdType;

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

    Invariants.PlanExists.enforce({ status: plan.status });

    return plan;
  }

  static create(
    planId: VO.PlanIdType,
    planName: VO.PlanNameType,
    userId: Auth.VO.UserIdType,
    deps: Dependencies,
  ): Plan {
    const plan = new Plan(planId, deps);

    const PlanCreatedEvent = bg.event(
      Events.PlanCreatedEvent,
      Plan.getStream(planId),
      { planId, planName, userId },
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
    Invariants.PlanBelongsToUser.enforce({ userId: this.userId, requesterId });
    Invariants.PlanSectionLimitForPlan.enforce({ count: tools.Int.nonNegative(this.sections.length) });
    Invariants.PlanSectionNameIsUniqueForPlan.enforce({ planSectionName, planSections: this.sections });

    const event = bg.event(
      Events.PlanSectionCreatedEvent,
      Plan.getStream(this.id),
      { planId: this.id, planSectionId, planSectionName, requesterId },
      this.deps,
    );

    this.record(event);
  }

  removeSection(planSectionId: VO.PlanSectionIdType, requesterId: Auth.VO.UserIdType) {
    Invariants.PlanIsEditable.enforce({ status: this.status });
    Invariants.PlanBelongsToUser.enforce({ userId: this.userId, requesterId });
    Invariants.PlanSectionExists.enforce({ planSectionId, planSections: this.sections });

    const event = bg.event(
      Events.PlanSectionRemovedEvent,
      Plan.getStream(this.id),
      { planId: this.id, planSectionId, requesterId },
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
    Invariants.PlanBelongsToUser.enforce({ userId: this.userId, requesterId });
    this.section(planSectionId).guardRename(planSectionName);
    Invariants.PlanSectionNameIsUniqueForPlan.enforce({ planSectionName, planSections: this.sections });

    const event = bg.event(
      Events.PlanSectionRenamedEvent,
      Plan.getStream(this.id),
      { planId: this.id, planSectionId, planSectionName, requesterId },
      this.deps,
    );

    this.record(event);
  }

  setSectionWarmup(
    planSectionId: VO.PlanSectionIdType,
    warmup: VO.PlanSectionWarmupType | undefined,
    requesterId: Auth.VO.UserIdType,
  ) {
    Invariants.PlanIsEditable.enforce({ status: this.status });
    Invariants.PlanBelongsToUser.enforce({ userId: this.userId, requesterId });
    this.section(planSectionId).guardWarmupSet(warmup);

    const event = bg.event(
      Events.PlanSectionWarmupSetEvent,
      Plan.getStream(this.id),
      { planId: this.id, planSectionId, warmup, requesterId },
      this.deps,
    );

    this.record(event);
  }

  setSectionCooldown(
    planSectionId: VO.PlanSectionIdType,
    cooldown: VO.PlanSectionCooldownType | undefined,
    requesterId: Auth.VO.UserIdType,
  ) {
    Invariants.PlanIsEditable.enforce({ status: this.status });
    Invariants.PlanBelongsToUser.enforce({ userId: this.userId, requesterId });
    this.section(planSectionId).guardCooldownSet(cooldown);

    const event = bg.event(
      Events.PlanSectionCooldownSetEvent,
      Plan.getStream(this.id),
      { planId: this.id, planSectionId, cooldown, requesterId },
      this.deps,
    );

    this.record(event);
  }

  archive(requesterId: Auth.VO.UserIdType) {
    Invariants.PlanIsArchivable.enforce({ status: this.status });
    Invariants.PlanBelongsToUser.enforce({ userId: this.userId, requesterId });

    const event = bg.event(
      Events.PlanArchivedEvent,
      Plan.getStream(this.id),
      { planId: this.id, requesterId },
      this.deps,
    );

    this.record(event);
  }

  finalize(requesterId: Auth.VO.UserIdType) {
    Invariants.PlanIsEditable.enforce({ status: this.status });
    Invariants.PlanBelongsToUser.enforce({ userId: this.userId, requesterId });
    Invariants.PlanHasSections.enforce({ planSections: this.sections });
    Invariants.PlanHasNoEmptySections.enforce({ planSections: this.sections });

    const event = bg.event(
      Events.PlanFinalizedEvent,
      Plan.getStream(this.id),
      { planId: this.id, requesterId },
      this.deps,
    );

    this.record(event);
  }

  restore(requesterId: Auth.VO.UserIdType) {
    Invariants.PlanIsRestorable.enforce({ status: this.status });
    Invariants.PlanBelongsToUser.enforce({ userId: this.userId, requesterId });

    const event = bg.event(
      Events.PlanRestoredEvent,
      Plan.getStream(this.id),
      { planId: this.id, requesterId },
      this.deps,
    );

    this.record(event);
  }

  remove(requesterId: Auth.VO.UserIdType) {
    Invariants.PlanIsRemovable.enforce({ status: this.status });
    Invariants.PlanBelongsToUser.enforce({ userId: this.userId, requesterId });

    const event = bg.event(
      Events.PlanRemovedEvent,
      Plan.getStream(this.id),
      { planId: this.id, requesterId },
      this.deps,
    );

    this.record(event);
  }

  enableEditing(requesterId: Auth.VO.UserIdType) {
    Invariants.PlanIsFinalized.enforce({ status: this.status });
    Invariants.PlanBelongsToUser.enforce({ userId: this.userId, requesterId });

    const event = bg.event(
      Events.PlanEditingEnabledEvent,
      Plan.getStream(this.id),
      { planId: this.id, requesterId },
      this.deps,
    );

    this.record(event);
  }

  rename(planName: VO.PlanNameType, requesterId: Auth.VO.UserIdType) {
    Invariants.PlanIsEditable.enforce({ status: this.status });
    Invariants.PlanBelongsToUser.enforce({ userId: this.userId, requesterId });
    Invariants.PlanNameHasChanged.enforce({ current: this.name, incoming: planName });

    const event = bg.event(
      Events.PlanRenamedEvent,
      Plan.getStream(this.id),
      { planId: this.id, planName, requesterId },
      this.deps,
    );

    this.record(event);
  }

  setDescription(description: VO.PlanDescriptionType | undefined, requesterId: Auth.VO.UserIdType) {
    Invariants.PlanIsEditable.enforce({ status: this.status });
    Invariants.PlanBelongsToUser.enforce({ userId: this.userId, requesterId });
    Invariants.PlanDescriptionHasChanged.enforce({ current: this.description, incoming: description });

    const event = bg.event(
      Events.PlanDescriptionSetEvent,
      Plan.getStream(this.id),
      { planId: this.id, description, requesterId },
      this.deps,
    );

    this.record(event);
  }

  addSectionExerciseInstruction(
    planSectionId: VO.PlanSectionIdType,
    exerciseInstruction: VO.ExerciseInstructionType,
    requesterId: Auth.VO.UserIdType,
  ) {
    Invariants.PlanIsEditable.enforce({ status: this.status });
    Invariants.PlanBelongsToUser.enforce({ userId: this.userId, requesterId });
    this.section(planSectionId).guardInstructionAdd();

    const event = bg.event(
      Events.PlanSectionExerciseInstructionAddedEvent,
      Plan.getStream(this.id),
      { planId: this.id, planSectionId, exerciseInstruction, requesterId },
      this.deps,
    );

    this.record(event);
  }

  removeSectionExerciseInstruction(
    planSectionId: VO.PlanSectionIdType,
    exerciseInstructionId: VO.ExerciseInstructionIdType,
    requesterId: Auth.VO.UserIdType,
  ) {
    Invariants.PlanIsEditable.enforce({ status: this.status });
    Invariants.PlanBelongsToUser.enforce({ userId: this.userId, requesterId });
    this.section(planSectionId).guardInstructionExists(exerciseInstructionId);

    const event = bg.event(
      Events.PlanSectionExerciseInstructionRemovedEvent,
      Plan.getStream(this.id),
      { planId: this.id, planSectionId, exerciseInstructionId, requesterId },
      this.deps,
    );

    this.record(event);
  }

  updateSectionExerciseInstruction(
    planSectionId: VO.PlanSectionIdType,
    exerciseInstruction: VO.ExerciseInstructionType,
    requesterId: Auth.VO.UserIdType,
  ) {
    Invariants.PlanIsEditable.enforce({ status: this.status });
    Invariants.PlanBelongsToUser.enforce({ userId: this.userId, requesterId });
    const section = this.section(planSectionId);
    section.guardInstructionUpdate(exerciseInstruction);

    const { exerciseId, ...prescription } = exerciseInstruction;
    const exerciseChanged = section.instructionExerciseChanged(exerciseInstruction);
    const prescriptionChanged = section.instructionPrescriptionChanged(exerciseInstruction);

    if (exerciseChanged) {
      const event = bg.event(
        Events.PlanSectionExerciseInstructionExerciseChangedEvent,
        Plan.getStream(this.id),
        {
          planId: this.id,
          planSectionId,
          exerciseInstruction: { id: prescription.id, exerciseId },
          requesterId,
        },
        this.deps,
      );

      this.record(event);
    }

    if (prescriptionChanged) {
      const event = bg.event(
        Events.PlanSectionExerciseInstructionUpdatedEvent,
        Plan.getStream(this.id),
        { planId: this.id, planSectionId, exerciseInstruction: prescription, requesterId },
        this.deps,
      );

      this.record(event);
    }
  }

  moveSectionExerciseInstruction(
    planSectionId: VO.PlanSectionIdType,
    exerciseInstructionId: VO.ExerciseInstructionIdType,
    position: VO.ExerciseInstructionPositionType,
    requesterId: Auth.VO.UserIdType,
  ) {
    Invariants.PlanIsEditable.enforce({ status: this.status });
    Invariants.PlanBelongsToUser.enforce({ userId: this.userId, requesterId });
    this.section(planSectionId).guardInstructionMove(exerciseInstructionId, position);

    const event = bg.event(
      Events.PlanSectionExerciseInstructionMovedEvent,
      Plan.getStream(this.id),
      { planId: this.id, planSectionId, exerciseInstructionId, position, requesterId },
      this.deps,
    );

    this.record(event);
  }

  pullEvents(): ReadonlyArray<PlanEventType> {
    const events = [...this.pending];

    this.pending.length = 0;

    return events;
  }

  private section(planSectionId: VO.PlanSectionIdType): Entities.PlanSection {
    Invariants.PlanSectionExists.enforce({ planSectionId, planSections: this.sections });

    return this.sections.find((section) => section.id === planSectionId)!;
  }

  private record(event: PlanEventType): void {
    this.apply(event);
    this.pending.push(event);
  }

  private apply(event: PlanEventType): void {
    this.revision = new tools.Revision(event.revision ?? this.revision.next().value);

    switch (event.name) {
      case Events.PLAN_CREATED_EVENT: {
        this.status = VO.PlanStatusEnum.draft;
        this.name = event.payload.planName;
        this.userId = event.payload.userId;
        break;
      }

      case Events.PLAN_SECTION_CREATED_EVENT: {
        this.sections.push(
          new Entities.PlanSection(event.payload.planSectionId, event.payload.planSectionName),
        );
        break;
      }

      case Events.PLAN_SECTION_RENAMED_EVENT: {
        this.sections
          .find((section) => section.id === event.payload.planSectionId)
          ?.rename(event.payload.planSectionName);
        break;
      }

      case Events.PLAN_SECTION_WARMUP_SET_EVENT: {
        this.sections
          .find((section) => section.id === event.payload.planSectionId)
          ?.setWarmup(event.payload.warmup);
        break;
      }

      case Events.PLAN_SECTION_COOLDOWN_SET_EVENT: {
        this.sections
          .find((section) => section.id === event.payload.planSectionId)
          ?.setCooldown(event.payload.cooldown);
        break;
      }

      case Events.PLAN_SECTION_REMOVED_EVENT: {
        this.sections = this.sections.filter((section) => section.id !== event.payload.planSectionId);
        break;
      }

      case Events.PLAN_ARCHIVED_EVENT: {
        this.status = VO.PlanStatusEnum.archived;
        break;
      }

      case Events.PLAN_FINALIZED_EVENT: {
        this.status = VO.PlanStatusEnum.finalized;
        break;
      }

      // Stryker disable next-line ConditionalExpression
      case Events.PLAN_RESTORED_EVENT: {
        this.status = VO.PlanStatusEnum.draft;
        break;
      }

      case Events.PLAN_REMOVED_EVENT: {
        this.status = VO.PlanStatusEnum.removed;
        break;
      }

      case Events.PLAN_EDITING_ENABLED_EVENT: {
        this.status = VO.PlanStatusEnum.draft;
        break;
      }

      case Events.PLAN_RENAMED_EVENT: {
        this.name = event.payload.planName;
        break;
      }

      case Events.PLAN_DESCRIPTION_SET_EVENT: {
        this.description = event.payload.description;
        break;
      }

      case Events.PLAN_SECTION_EXERCISE_INSTRUCTION_ADDED_EVENT: {
        this.sections
          .find((section) => section.id === event.payload.planSectionId)
          ?.addInstruction(event.payload.exerciseInstruction);
        break;
      }

      case Events.PLAN_SECTION_EXERCISE_INSTRUCTION_REMOVED_EVENT: {
        this.sections
          .find((section) => section.id === event.payload.planSectionId)
          ?.removeInstruction(event.payload.exerciseInstructionId);
        break;
      }

      case Events.PLAN_SECTION_EXERCISE_INSTRUCTION_UPDATED_EVENT: {
        this.sections
          .find((section) => section.id === event.payload.planSectionId)
          ?.updateInstruction(event.payload.exerciseInstruction);
        break;
      }

      case Events.PLAN_SECTION_EXERCISE_INSTRUCTION_EXERCISE_CHANGED_EVENT: {
        this.sections
          .find((section) => section.id === event.payload.planSectionId)
          ?.changeInstructionExercise(
            event.payload.exerciseInstruction.id,
            event.payload.exerciseInstruction.exerciseId,
          );
        break;
      }

      case Events.PLAN_SECTION_EXERCISE_INSTRUCTION_MOVED_EVENT: {
        this.sections
          .find((section) => section.id === event.payload.planSectionId)
          ?.moveInstruction(event.payload.exerciseInstructionId, event.payload.position);
        break;
      }
    }
  }

  static getStream(id: VO.PlanIdType): bg.EventStreamType {
    return v.parse(bg.EventStream, `plan_${id}`);
  }
}
