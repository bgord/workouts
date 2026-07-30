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
  | Events.PlanRenamedEventType
  | Events.PlanSectionExerciseInstructionAddedEventType
  | Events.PlanSectionExerciseInstructionRemovedEventType
  | Events.PlanSectionExerciseInstructionUpdatedEventType
  | Events.PlanSectionExerciseInstructionExerciseChangedEventType;

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
    [Events.PLAN_ARCHIVED_EVENT]: Events.PlanArchivedEvent,
    [Events.PLAN_FINALIZED_EVENT]: Events.PlanFinalizedEvent,
    [Events.PLAN_RESTORED_EVENT]: Events.PlanRestoredEvent,
    [Events.PLAN_EDITING_ENABLED_EVENT]: Events.PlanEditingEnabledEvent,
    [Events.PLAN_RENAMED_EVENT]: Events.PlanRenamedEvent,
    [Events.PLAN_SECTION_EXERCISE_INSTRUCTION_ADDED_EVENT]: Events.PlanSectionExerciseInstructionAddedEvent,
    [Events.PLAN_SECTION_EXERCISE_INSTRUCTION_REMOVED_EVENT]:
      Events.PlanSectionExerciseInstructionRemovedEvent,
    [Events.PLAN_SECTION_EXERCISE_INSTRUCTION_UPDATED_EVENT]:
      Events.PlanSectionExerciseInstructionUpdatedEvent,
    [Events.PLAN_SECTION_EXERCISE_INSTRUCTION_EXERCISE_CHANGED_EVENT]:
      Events.PlanSectionExerciseInstructionExerciseChangedEvent,
  });
  // Stryker restore all

  readonly id: VO.PlanIdType;
  revision: tools.Revision = new tools.Revision(tools.Revision.INITIAL);
  status = VO.PlanStatusEnum.initial;
  name?: VO.PlanNameType;
  sections: Array<VO.PlanSection> = [];
  userId?: Auth.VO.UserIdType;

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
      { planId: this.id, planSectionId, planSectionName, userId: this.userId! },
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
      { planId: this.id, planSectionId, userId: this.userId! },
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
    Invariants.PlanBelongsToUser.enforce({ userId: this.userId, requesterId });

    const event = bg.event(
      Events.PlanArchivedEvent,
      Plan.getStream(this.id),
      { planId: this.id, userId: this.userId! },
      this.deps,
    );

    this.record(event);
  }

  finalize(requesterId: Auth.VO.UserIdType) {
    Invariants.PlanIsEditable.enforce({ status: this.status });
    Invariants.PlanBelongsToUser.enforce({ userId: this.userId, requesterId });
    // Invariants.PlanHasNoEmptySections.enforce({ sections: this.sections })

    const event = bg.event(
      Events.PlanFinalizedEvent,
      Plan.getStream(this.id),
      { planId: this.id, userId: this.userId! },
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
      { planId: this.id, userId: this.userId! },
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
      { planId: this.id, userId: this.userId! },
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
      { planId: this.id, planName, userId: this.userId! },
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
    Invariants.PlanSectionExists.enforce({ planSectionId, planSections: this.sections });
    Invariants.PlanSectionExerciseInstructionLimit.enforce({
      planSection: this.sections.find((section) => section.id === planSectionId),
    });

    const event = bg.event(
      Events.PlanSectionExerciseInstructionAddedEvent,
      Plan.getStream(this.id),
      { planId: this.id, planSectionId, exerciseInstruction, userId: this.userId! },
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
    Invariants.PlanSectionExists.enforce({ planSectionId, planSections: this.sections });
    Invariants.PlanSectionExerciseInstructionExists.enforce({
      planSection: this.sections.find((section) => section.id === planSectionId),
      exerciseInstructionId,
    });

    const event = bg.event(
      Events.PlanSectionExerciseInstructionRemovedEvent,
      Plan.getStream(this.id),
      { planId: this.id, planSectionId, exerciseInstructionId, userId: this.userId! },
      this.deps,
    );

    this.record(event);
  }

  updateSectionExerciseInstruction(
    planSectionId: VO.PlanSectionIdType,
    exerciseInstruction: Omit<VO.ExerciseInstructionType, "exerciseId">,
    requesterId: Auth.VO.UserIdType,
  ) {
    const planSection = this.sections.find((section) => section.id === planSectionId);

    Invariants.PlanIsEditable.enforce({ status: this.status });
    Invariants.PlanBelongsToUser.enforce({ userId: this.userId, requesterId });
    Invariants.PlanSectionExists.enforce({ planSectionId, planSections: this.sections });
    Invariants.PlanSectionExerciseInstructionExists.enforce({
      planSection,
      exerciseInstructionId: exerciseInstruction.id,
    });
    Invariants.PlanSectionExerciseInstructionHasChanged.enforce({
      current: planSection?.exerciseInstructions.find(
        (instruction) => instruction.id === exerciseInstruction.id,
      ),
      incoming: exerciseInstruction,
    });

    const event = bg.event(
      Events.PlanSectionExerciseInstructionUpdatedEvent,
      Plan.getStream(this.id),
      { planId: this.id, planSectionId, exerciseInstruction, userId: this.userId! },
      this.deps,
    );

    this.record(event);
  }

  changeSectionExerciseInstructionExercise(
    planSectionId: VO.PlanSectionIdType,
    exerciseInstruction: Pick<VO.ExerciseInstructionType, "id" | "exerciseId">,
    requesterId: Auth.VO.UserIdType,
  ) {
    const planSection = this.sections.find((section) => section.id === planSectionId);

    Invariants.PlanIsEditable.enforce({ status: this.status });
    Invariants.PlanBelongsToUser.enforce({ userId: this.userId, requesterId });
    Invariants.PlanSectionExists.enforce({ planSections: this.sections, planSectionId });
    Invariants.PlanSectionExerciseInstructionExists.enforce({
      planSection,
      exerciseInstructionId: exerciseInstruction.id,
    });
    Invariants.PlanSectionExerciseInstructionExerciseHasChanged.enforce({
      current: planSection?.exerciseInstructions.find(
        (instruction) => instruction.id === exerciseInstruction.id,
      )?.exerciseId,
      incoming: exerciseInstruction.exerciseId,
    });

    const event = bg.event(
      Events.PlanSectionExerciseInstructionExerciseChangedEvent,
      Plan.getStream(this.id),
      { planId: this.id, planSectionId, exerciseInstruction, userId: this.userId! },
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
        this.userId = event.payload.userId;
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

      case Events.PLAN_SECTION_EXERCISE_INSTRUCTION_ADDED_EVENT: {
        this.revision = new tools.Revision(event.revision ?? this.revision.next().value);
        this.sections = this.sections.map((section) => {
          if (section.id === event.payload.planSectionId) {
            section.exerciseInstructions.push(event.payload.exerciseInstruction);
            return section;
          }
          return section;
        });
        break;
      }

      case Events.PLAN_SECTION_EXERCISE_INSTRUCTION_REMOVED_EVENT: {
        this.revision = new tools.Revision(event.revision ?? this.revision.next().value);
        this.sections = this.sections.map((section) => ({
          ...section,
          exerciseInstructions: section.exerciseInstructions.filter(
            (exerciseInstruction) => exerciseInstruction.id !== event.payload.exerciseInstructionId,
          ),
        }));
        break;
      }

      case Events.PLAN_SECTION_EXERCISE_INSTRUCTION_UPDATED_EVENT: {
        this.revision = new tools.Revision(event.revision ?? this.revision.next().value);
        this.sections = this.sections.map((section) => ({
          ...section,
          exerciseInstructions: section.exerciseInstructions.map((exerciseInstruction) => {
            if (exerciseInstruction.id === event.payload.exerciseInstruction.id) {
              return {
                ...exerciseInstruction,
                reps: event.payload.exerciseInstruction.reps,
                sets: event.payload.exerciseInstruction.sets,
              };
            }
            return exerciseInstruction;
          }),
        }));
        break;
      }

      case Events.PLAN_SECTION_EXERCISE_INSTRUCTION_EXERCISE_CHANGED_EVENT: {
        this.revision = new tools.Revision(event.revision ?? this.revision.next().value);
        this.sections = this.sections.map((section) => ({
          ...section,
          exerciseInstructions: section.exerciseInstructions.map((exerciseInstruction) => {
            if (exerciseInstruction.id === event.payload.exerciseInstruction.id) {
              return { ...exerciseInstruction, exerciseId: event.payload.exerciseInstruction.exerciseId };
            }
            return exerciseInstruction;
          }),
        }));
        break;
      }
    }
  }

  static getStream(id: VO.PlanIdType) {
    return `plan_${id}`;
  }
}
