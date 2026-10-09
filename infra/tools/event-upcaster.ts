import * as bg from "@bgord/bun";
import * as Exercises from "+exercises";
import * as Plans from "+plans";
import * as Workouts from "+workouts";

const progression = Plans.VO.ProgressionMethodOptions.double_progression;

export const EventUpcaster = new bg.EventUpcasterChainAdapter({
  [Exercises.Events.EXERCISE_ADDED_EVENT]: [
    new bg.EventUpcasterStep({
      fromVersion: 1,
      toVersion: 2,
      upcast: (payload) => ({ ...payload, resistance: Exercises.VO.ExerciseResistanceOptions.weighted }),
    }),
    new bg.EventUpcasterStep({
      fromVersion: 2,
      toVersion: 3,
      upcast: (payload) => ({ ...payload, laterality: Exercises.VO.ExerciseLateralityOptions.bilateral }),
    }),
    new bg.EventUpcasterStep({
      fromVersion: 3,
      toVersion: 4,
      upcast: (payload) => ({
        ...payload,
        loadStep: {
          [Exercises.VO.ExerciseResistanceOptions.weighted]: Exercises.VO.ExerciseLoadStepOptions.kg_2_5,
          [Exercises.VO.ExerciseResistanceOptions.bodyweight]: Exercises.VO.ExerciseLoadStepOptions.none,
        }[payload.resistance as Exercises.VO.ExerciseResistanceOptions],
      }),
    }),
  ],
  [Exercises.Events.EXERCISE_CATEGORY_ASSIGNED_EVENT]: [
    new bg.EventUpcasterStep({
      fromVersion: 1,
      toVersion: 2,
      upcast: (payload) => ({ ...payload, role: Exercises.VO.ExerciseCategoryRoleOptions.primary }),
    }),
  ],
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
    new bg.EventUpcasterStep({
      fromVersion: 2,
      toVersion: 3,
      upcast: ({ exerciseImageEtag, ...payload }) => payload,
    }),
    new bg.EventUpcasterStep({
      fromVersion: 3,
      toVersion: 4,
      upcast: (payload) => ({ ...payload, resistance: Exercises.VO.ExerciseResistanceOptions.weighted }),
    }),
    new bg.EventUpcasterStep({
      fromVersion: 4,
      toVersion: 5,
      upcast: (payload) => ({ ...payload, laterality: Exercises.VO.ExerciseLateralityOptions.bilateral }),
    }),
  ],
});
