import * as tools from "@bgord/tools";
import type * as Exercises from "+exercises";
import type * as Aggregates from "+plans/aggregates";
import * as Events from "+plans/events";
import type * as VO from "+plans/value-objects";

type PlanHistoryFacts = {
  events: ReadonlyArray<Aggregates.PlanEventType>;
  exercises: ReadonlyArray<{ id: Exercises.VO.ExerciseIdType; name: Exercises.VO.ExerciseNameType }>;
};

type PlanHistoryState = {
  sections: Map<VO.PlanSectionIdType, VO.PlanSectionNameType>;
  exerciseInstructions: Map<VO.ExerciseInstructionIdType, Exercises.VO.ExerciseIdType>;
};

export class PlanHistory {
  constructor(private readonly facts: PlanHistoryFacts) {}

  calculate(config: VO.PlanHistoryPageConfig): VO.PlanHistoryPage {
    const state: PlanHistoryState = { sections: new Map(), exerciseInstructions: new Map() };

    const entries = this.facts.events
      .map((event, sequence) => {
        if (
          event.name === Events.PLAN_SECTION_CREATED_EVENT ||
          event.name === Events.PLAN_SECTION_RENAMED_EVENT
        ) {
          state.sections.set(event.payload.planSectionId, event.payload.planSectionName);
        }

        if (
          event.name === Events.PLAN_SECTION_EXERCISE_INSTRUCTION_ADDED_EVENT ||
          event.name === Events.PLAN_SECTION_EXERCISE_INSTRUCTION_EXERCISE_CHANGED_EVENT
        ) {
          state.exerciseInstructions.set(
            event.payload.exerciseInstruction.id,
            event.payload.exerciseInstruction.exerciseId,
          );
        }

        return {
          name: event.name,
          details: this.details(event, state),
          sequence: tools.Int.nonNegative(sequence),
          createdAt: event.createdAt,
        };
      })
      .toReversed()
      .filter((entry) => config.before === undefined || entry.sequence < config.before);

    const page = entries.slice(0, config.limit);
    const last = page.at(-1);

    return { entries: page, next: entries.length > config.limit && last ? last.sequence : null };
  }

  private details(event: Aggregates.PlanEventType, state: PlanHistoryState): VO.PlanHistoryEntryDetails {
    switch (event.name) {
      case Events.PLAN_CREATED_EVENT:
      case Events.PLAN_RENAMED_EVENT:
        return { planName: event.payload.planName };
      case Events.PLAN_DESCRIPTION_SET_EVENT:
        return { text: event.payload.description ?? null };
      case Events.PLAN_SECTION_CREATED_EVENT:
      case Events.PLAN_SECTION_RENAMED_EVENT:
      case Events.PLAN_SECTION_REMOVED_EVENT:
        return { sectionName: state.sections.get(event.payload.planSectionId) as VO.PlanSectionNameType };
      case Events.PLAN_SECTION_WARMUP_SET_EVENT:
        return {
          sectionName: state.sections.get(event.payload.planSectionId) as VO.PlanSectionNameType,
          text: event.payload.warmup ?? null,
        };
      case Events.PLAN_SECTION_COOLDOWN_SET_EVENT:
        return {
          sectionName: state.sections.get(event.payload.planSectionId) as VO.PlanSectionNameType,
          text: event.payload.cooldown ?? null,
        };
      case Events.PLAN_SECTION_EXERCISE_INSTRUCTION_ADDED_EVENT:
      case Events.PLAN_SECTION_EXERCISE_INSTRUCTION_UPDATED_EVENT: {
        const { id, sets, reps, progression, rir } = event.payload.exerciseInstruction;

        return {
          sectionName: state.sections.get(event.payload.planSectionId) as VO.PlanSectionNameType,
          exerciseName: this.exerciseName(id, state),
          prescription: { sets, reps, progression, rir },
        };
      }
      case Events.PLAN_SECTION_EXERCISE_INSTRUCTION_EXERCISE_CHANGED_EVENT:
        return {
          sectionName: state.sections.get(event.payload.planSectionId) as VO.PlanSectionNameType,
          exerciseName: this.exerciseName(event.payload.exerciseInstruction.id, state),
        };
      case Events.PLAN_SECTION_EXERCISE_INSTRUCTION_MOVED_EVENT:
        return {
          sectionName: state.sections.get(event.payload.planSectionId) as VO.PlanSectionNameType,
          exerciseName: this.exerciseName(event.payload.exerciseInstructionId, state),
          position: event.payload.position,
        };
      case Events.PLAN_SECTION_EXERCISE_INSTRUCTION_REMOVED_EVENT:
        return {
          sectionName: state.sections.get(event.payload.planSectionId) as VO.PlanSectionNameType,
          exerciseName: this.exerciseName(event.payload.exerciseInstructionId, state),
        };
      default:
        return {};
    }
  }

  private exerciseName(
    id: VO.ExerciseInstructionIdType,
    state: PlanHistoryState,
  ): Exercises.VO.ExerciseNameType | null {
    const exerciseId = state.exerciseInstructions.get(id);

    return this.facts.exercises.find((exercise) => exercise.id === exerciseId)?.name ?? null;
  }
}
