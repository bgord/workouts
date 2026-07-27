import type * as bg from "@bgord/bun";
import { eq } from "drizzle-orm";
import * as Plans from "+plans";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

type Dependencies = {
  EventBus: bg.EventBusPort<
    | Plans.Events.PlanSectionExerciseInstructionAddedEventType
    | Plans.Events.PlanSectionExerciseInstructionRemovedEventType
    | Plans.Events.PlanSectionExerciseInstructionUpdatedEventType
    | Plans.Events.PlanSectionExerciseInstructionExerciseChangedEventType
    | Plans.Events.PlanSectionRemovedEventType
  >;
  EventHandler: bg.EventHandlerStrategy;
};

export class PlanSectionExerciseInstructionProjector {
  constructor(deps: Dependencies) {
    deps.EventBus.on(
      Plans.Events.PLAN_SECTION_EXERCISE_INSTRUCTION_ADDED_EVENT,
      deps.EventHandler.handle(this.onPlanSectionExerciseInstructionAddedEvent.bind(this)),
    );
    deps.EventBus.on(
      Plans.Events.PLAN_SECTION_EXERCISE_INSTRUCTION_REMOVED_EVENT,
      deps.EventHandler.handle(this.onPlanSectionExerciseInstructionRemovedEvent.bind(this)),
    );
    deps.EventBus.on(
      Plans.Events.PLAN_SECTION_EXERCISE_INSTRUCTION_UPDATED_EVENT,
      deps.EventHandler.handle(this.onPlanSectionExerciseInstructionUpdatedEvent.bind(this)),
    );
    deps.EventBus.on(
      Plans.Events.PLAN_SECTION_EXERCISE_INSTRUCTION_EXERCISE_CHANGED_EVENT,
      deps.EventHandler.handle(this.onPlanSectionExerciseInstructionExerciseChangedEvent.bind(this)),
    );
    deps.EventBus.on(
      Plans.Events.PLAN_SECTION_REMOVED_EVENT,
      deps.EventHandler.handle(this.onPlanSectionRemovedEvent.bind(this)),
    );
  }

  async onPlanSectionExerciseInstructionAddedEvent(
    event: Plans.Events.PlanSectionExerciseInstructionAddedEventType,
  ) {
    await db.insert(Schema.planSectionExerciseInstructions).values({
      id: event.payload.exerciseInstruction.id,
      planId: event.payload.planId,
      planSectionId: event.payload.planSectionId,
      exerciseId: event.payload.exerciseInstruction.exerciseId,
      sets: event.payload.exerciseInstruction.sets,
      repsMin: event.payload.exerciseInstruction.reps.min,
      repsMax: event.payload.exerciseInstruction.reps.max,
      ownerId: event.payload.ownerId,
      createdAt: event.createdAt,
      updatedAt: event.createdAt,
    });
  }

  async onPlanSectionExerciseInstructionRemovedEvent(
    event: Plans.Events.PlanSectionExerciseInstructionRemovedEventType,
  ) {
    await db
      .delete(Schema.planSectionExerciseInstructions)
      .where(eq(Schema.planSectionExerciseInstructions.id, event.payload.exerciseInstructionId));
  }

  async onPlanSectionExerciseInstructionUpdatedEvent(
    event: Plans.Events.PlanSectionExerciseInstructionUpdatedEventType,
  ) {
    await db
      .update(Schema.planSectionExerciseInstructions)
      .set({
        sets: event.payload.exerciseInstruction.sets,
        repsMin: event.payload.exerciseInstruction.reps.min,
        repsMax: event.payload.exerciseInstruction.reps.max,
        updatedAt: event.createdAt,
      })
      .where(eq(Schema.planSections.id, event.payload.planSectionId));
  }

  async onPlanSectionExerciseInstructionExerciseChangedEvent(
    event: Plans.Events.PlanSectionExerciseInstructionExerciseChangedEventType,
  ) {
    await db
      .update(Schema.planSectionExerciseInstructions)
      .set({ exerciseId: event.payload.exerciseInstruction.exerciseId, updatedAt: event.createdAt })
      .where(eq(Schema.planSectionExerciseInstructions.id, event.payload.exerciseInstruction.id));
  }

  async onPlanSectionRemovedEvent(event: Plans.Events.PlanSectionRemovedEventType) {
    await db
      .delete(Schema.planSectionExerciseInstructions)
      .where(eq(Schema.planSections.id, event.payload.planSectionId));
  }
}
