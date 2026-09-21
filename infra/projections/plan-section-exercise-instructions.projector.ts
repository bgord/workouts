import type * as bg from "@bgord/bun";
import type * as tools from "@bgord/tools";
import { asc, eq } from "drizzle-orm";
import * as v from "valibot";
import * as Auth from "+auth";
import * as Plans from "+plans";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

type Dependencies = {
  EventBus: bg.EventBusPort<
    | Plans.Events.PlanSectionExerciseInstructionAddedEventType
    | Plans.Events.PlanSectionExerciseInstructionRemovedEventType
    | Plans.Events.PlanSectionExerciseInstructionUpdatedEventType
    | Plans.Events.PlanSectionExerciseInstructionExerciseChangedEventType
    | Plans.Events.PlanSectionExerciseInstructionMovedEventType
    | Plans.Events.PlanSectionRemovedEventType
    | Plans.Events.PlanRemovedEventType
    | Auth.Events.AccountDeletedEventType
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
      Plans.Events.PLAN_SECTION_EXERCISE_INSTRUCTION_MOVED_EVENT,
      deps.EventHandler.handle(this.onPlanSectionExerciseInstructionMovedEvent.bind(this)),
    );
    deps.EventBus.on(
      Plans.Events.PLAN_SECTION_REMOVED_EVENT,
      deps.EventHandler.handle(this.onPlanSectionRemovedEvent.bind(this)),
    );
    deps.EventBus.on(
      Plans.Events.PLAN_REMOVED_EVENT,
      deps.EventHandler.handle(this.onPlanRemovedEvent.bind(this)),
    );
    deps.EventBus.on(
      Auth.Events.ACCOUNT_DELETED_EVENT,
      deps.EventHandler.handle(this.onAccountDeletedEvent.bind(this)),
    );
  }

  async onPlanSectionExerciseInstructionAddedEvent(
    event: Plans.Events.PlanSectionExerciseInstructionAddedEventType,
  ) {
    const siblings = await this.siblings(event.payload.planSectionId);

    await db.insert(Schema.planSectionExerciseInstructions).values({
      id: event.payload.exerciseInstruction.id,
      planId: event.payload.planId,
      planSectionId: event.payload.planSectionId,
      exerciseId: event.payload.exerciseInstruction.exerciseId,
      sets: event.payload.exerciseInstruction.sets,
      repsMin: event.payload.exerciseInstruction.reps.min,
      repsMax: event.payload.exerciseInstruction.reps.max,
      progression: event.payload.exerciseInstruction.progression,
      position: v.parse(Plans.VO.ExerciseInstructionPosition, siblings.length),
      userId: event.payload.requesterId,
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

    const siblings = await this.siblings(event.payload.planSectionId);

    await this.reposition(siblings, event.createdAt);
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
        progression: event.payload.exerciseInstruction.progression,
        updatedAt: event.createdAt,
      })
      .where(eq(Schema.planSectionExerciseInstructions.id, event.payload.exerciseInstruction.id));
  }

  async onPlanSectionExerciseInstructionExerciseChangedEvent(
    event: Plans.Events.PlanSectionExerciseInstructionExerciseChangedEventType,
  ) {
    await db
      .update(Schema.planSectionExerciseInstructions)
      .set({ exerciseId: event.payload.exerciseInstruction.exerciseId, updatedAt: event.createdAt })
      .where(eq(Schema.planSectionExerciseInstructions.id, event.payload.exerciseInstruction.id));
  }

  async onPlanSectionExerciseInstructionMovedEvent(
    event: Plans.Events.PlanSectionExerciseInstructionMovedEventType,
  ) {
    const siblings = await this.siblings(event.payload.planSectionId);
    const others = siblings.filter((id) => id !== event.payload.exerciseInstructionId);

    others.splice(event.payload.position, 0, event.payload.exerciseInstructionId);

    await this.reposition(others, event.createdAt);
  }

  async onPlanSectionRemovedEvent(event: Plans.Events.PlanSectionRemovedEventType) {
    await db
      .delete(Schema.planSectionExerciseInstructions)
      .where(eq(Schema.planSectionExerciseInstructions.planSectionId, event.payload.planSectionId));
  }

  async onPlanRemovedEvent(event: Plans.Events.PlanRemovedEventType) {
    await db
      .delete(Schema.planSectionExerciseInstructions)
      .where(eq(Schema.planSectionExerciseInstructions.planId, event.payload.planId));
  }

  async onAccountDeletedEvent(event: Auth.Events.AccountDeletedEventType) {
    await db
      .delete(Schema.planSectionExerciseInstructions)
      .where(eq(Schema.planSectionExerciseInstructions.userId, event.payload.userId));
  }

  private async siblings(planSectionId: Plans.VO.PlanSectionIdType) {
    const rows = await db
      .select({ id: Schema.planSectionExerciseInstructions.id })
      .from(Schema.planSectionExerciseInstructions)
      .where(eq(Schema.planSectionExerciseInstructions.planSectionId, planSectionId))
      .orderBy(asc(Schema.planSectionExerciseInstructions.position));

    return rows.map((row) => row.id);
  }

  private async reposition(
    ids: Array<Plans.VO.ExerciseInstructionIdType>,
    updatedAt: tools.TimestampValueType,
  ) {
    for (const [index, id] of ids.entries()) {
      await db
        .update(Schema.planSectionExerciseInstructions)
        .set({ position: v.parse(Plans.VO.ExerciseInstructionPosition, index), updatedAt })
        .where(eq(Schema.planSectionExerciseInstructions.id, id));
    }
  }
}
