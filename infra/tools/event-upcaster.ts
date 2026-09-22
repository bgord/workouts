import * as bg from "@bgord/bun";
import * as Plans from "+plans";
import * as Workouts from "+workouts";

const progression = Plans.VO.ProgressionMethodOptions.double_progression;

export const EventUpcaster = new bg.EventUpcasterChainAdapter({
  [Plans.Events.PLAN_SECTION_EXERCISE_INSTRUCTION_ADDED_EVENT]: [
    new bg.EventUpcasterStep({
      fromVersion: 1,
      toVersion: 2,
      upcast: (payload) => ({
        ...payload,
        exerciseInstruction: { ...payload.exerciseInstruction, progression },
      }),
    }),
  ],
  [Plans.Events.PLAN_SECTION_EXERCISE_INSTRUCTION_UPDATED_EVENT]: [
    new bg.EventUpcasterStep({
      fromVersion: 1,
      toVersion: 2,
      upcast: (payload) => ({
        ...payload,
        exerciseInstruction: { ...payload.exerciseInstruction, progression },
      }),
    }),
  ],
  [Workouts.Events.WORKOUT_EXERCISE_ADDED_EVENT]: [
    new bg.EventUpcasterStep({
      fromVersion: 1,
      toVersion: 2,
      upcast: (payload) => ({ ...payload, prescription: { ...payload.prescription, progression } }),
    }),
  ],
});
