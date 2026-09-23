// cspell:disable
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Workouts from "+workouts";
import { userId } from "./auth";
import {
  anotherExerciseId,
  anotherExerciseName,
  exerciseDescription,
  exerciseId,
  exerciseImageEtag,
  exerciseName,
} from "./exercises";
import {
  exerciseInstructionId,
  planId,
  planName,
  planSectionCooldown,
  planSectionId,
  planSectionName,
  planSectionWarmup,
  progression,
  reps,
  sets,
} from "./plans";
import { commit, correlationId, expectAnyId, revision, T0 } from "./shared";

export const workoutId = v.parse(Workouts.VO.WorkoutId, "f1c4b0a2-6d3e-4f81-9a7c-2b5e8d0f3a64");
export const workoutStream = v.parse(bg.EventStream, `workout_${workoutId}`);

export const workoutScheduledFor = v.parse(Workouts.VO.WorkoutScheduledFor, "2025-01-01");
export const anotherWorkoutScheduledFor = v.parse(Workouts.VO.WorkoutScheduledFor, "2025-01-08");
export const pastWorkoutScheduledFor = v.parse(Workouts.VO.WorkoutScheduledFor, "2024-12-31");

export const workoutExerciseId = v.parse(
  Workouts.VO.WorkoutExerciseId,
  "1d9b7f60-2c34-4a58-9e1b-7f0a3c5d6e21",
);

export const workoutSummary: Workouts.VO.WorkoutSummary = {
  id: workoutId,
  planId,
  planName,
  planSectionId,
  planSectionName,
  scheduledFor: workoutScheduledFor,
  status: Workouts.VO.WorkoutStatusEnum.draft,
  completedAt: null,
  revision: revision.value,
};

export const workoutListPlan: Workouts.Queries.WorkoutListPlan = {
  id: planId,
  name: planName,
  sections: [
    {
      id: planSectionId,
      name: planSectionName,
      exerciseInstructions: [{ id: exerciseInstructionId, exercise: { name: exerciseName } }],
    },
  ],
};

export const anotherWorkoutExerciseId = v.parse(
  Workouts.VO.WorkoutExerciseId,
  "6b2e4a17-9c05-4d3f-8a61-0e7d2f4b5c93",
);

export const workoutExercisePosition = v.parse(Workouts.VO.WorkoutExercisePosition, 0);
export const anotherWorkoutExercisePosition = v.parse(Workouts.VO.WorkoutExercisePosition, 1);

export const exercisePrescription = v.parse(Workouts.VO.ExercisePrescription, { sets, reps, progression });

export const loggedSetId = v.parse(Workouts.VO.LoggedSetId, "5f1c9b7e-3a2d-4c8b-9e6f-1a2b3c4d5e6f");

export const anotherLoggedSetId = v.parse(Workouts.VO.LoggedSetId, "6a2d0c8f-4b3e-4d9c-8f7a-2b3c4d5e6f70");

export const loggedSet = v.parse(Workouts.VO.LoggedSet, {
  id: loggedSetId,
  setNumber: v.parse(Workouts.VO.SetNumber, 1),
  reps: v.parse(Workouts.VO.Reps, 9),
  load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(80).get()),
});

export const anotherLoggedSet = v.parse(Workouts.VO.LoggedSet, {
  id: anotherLoggedSetId,
  setNumber: v.parse(Workouts.VO.SetNumber, 2),
  reps: v.parse(Workouts.VO.Reps, 9),
  load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(80).get()),
});

export const loggedSetWithRir = v.parse(Workouts.VO.LoggedSet, {
  id: loggedSetId,
  setNumber: v.parse(Workouts.VO.SetNumber, 1),
  reps: v.parse(Workouts.VO.Reps, 9),
  load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(80).get()),
  rir: v.parse(Workouts.VO.Rir, 2),
});

export const exercisePerformance = {
  workoutId,
  scheduledFor: workoutScheduledFor,
  sets: [
    {
      setNumber: v.parse(Workouts.VO.SetNumber, 1),
      reps: v.parse(Workouts.VO.Reps, 5),
      load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(90).get()),
      rir: null,
    },
    {
      setNumber: v.parse(Workouts.VO.SetNumber, 2),
      reps: v.parse(Workouts.VO.Reps, 10),
      load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(90).get()),
      rir: null,
    },
  ],
};

export const workoutExportRow = {
  workoutId,
  completedAt: T0.ms,
  planName,
  planSectionName,
  exerciseName,
  setNumber: v.parse(Workouts.VO.SetNumber, 1),
  reps: v.parse(Workouts.VO.Reps, 9),
  load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(80).get()),
  rir: v.parse(Workouts.VO.Rir, 2),
};

export const workoutCsv = [
  "workoutId,completedAt,planName,planSectionName,exerciseName,setNumber,reps,load,rir",
  `${workoutId},${T0.ms},${planName},${planSectionName},${exerciseName},1,9,80000,2`,
].join("");

export const exerciseTarget = v.parse(Workouts.VO.ExerciseTarget, {
  sets,
  reps: v.parse(Workouts.VO.Reps, 9),
  load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(80).get()),
});

export const workoutExercise: Workouts.VO.WorkoutExercise = {
  id: workoutExerciseId,
  exerciseId,
  exerciseName,
  prescription: exercisePrescription,
  target: exerciseTarget,
  loggedSets: [loggedSet],
};

export const workoutExerciseWithoutTarget: Workouts.VO.WorkoutExercise = {
  id: anotherWorkoutExerciseId,
  exerciseId: anotherExerciseId,
  exerciseName: anotherExerciseName,
  prescription: exercisePrescription,
  loggedSets: [],
};

export const workoutExercisesAtLimit: Array<Workouts.VO.WorkoutExercise> = Array.from(
  { length: Workouts.VO.WorkoutExerciseLimitMax },
  () => workoutExercise,
);

export const workout: Workouts.VO.Workout = {
  id: workoutId,
  planId,
  planName,
  planSectionId,
  planSectionName,
  planSectionWarmup,
  planSectionCooldown,
  scheduledFor: workoutScheduledFor,
  status: Workouts.VO.WorkoutStatusEnum.in_progress,
  completedAt: null,
  note: null,
  revision: revision.value,
  exercises: [workoutExercise],
};

export const exercisePerformanceWeakestSet = v.parse(Workouts.VO.ExerciseTarget, {
  sets: v.parse(Workouts.VO.Sets, 2),
  reps: v.parse(Workouts.VO.Reps, 5),
  load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(90).get()),
});

export const exerciseTargetProgression: Workouts.VO.ExerciseTargetProgression = {
  last: exercisePerformanceWeakestSet,
  regress: v.parse(Workouts.VO.ExerciseTarget, {
    sets: v.parse(Workouts.VO.Sets, 2),
    reps: v.parse(Workouts.VO.Reps, 4),
    load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(90).get()),
  }),
  progress: v.parse(Workouts.VO.ExerciseTarget, {
    sets: v.parse(Workouts.VO.Sets, 2),
    reps: v.parse(Workouts.VO.Reps, 6),
    load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(90).get()),
  }),
};

export const exerciseTargetDiff: Workouts.VO.ExerciseTargetDiff = {
  sets: v.parse(tools.Integer, 1),
  reps: v.parse(tools.Integer, 4),
  load: v.parse(tools.Integer, -tools.Weight.fromKilograms(10).get()),
};

export const exercisePreviousPerformance: Workouts.Queries.ExercisePreviousPerformance = {
  scheduledFor: pastWorkoutScheduledFor,
  sets: exercisePerformance.sets,
  diff: exerciseTargetDiff,
};

export const workoutWithExerciseActions: Workouts.Queries.WorkoutGetResponse["data"] = {
  ...workout,
  exercises: workout.exercises.map((exercise) => ({
    ...exercise,
    target: exerciseTarget,
    exerciseImageEtag,
    exerciseDescription,
    loggedSets: exercise.loggedSets.map((set) => ({
      ...set,
      rir: null,
      actions: {
        correct: { available: true, enabled: true, hints: [] },
        remove: { available: true, enabled: true, hints: [] },
      },
    })),
    previousPerformance: exercisePreviousPerformance,
    targetProgression: exerciseTargetProgression,
    actions: {
      targetSet: { available: true, enabled: true, hints: [] },
      remove: { available: true, enabled: true, hints: [] },
      moveUp: { available: true, enabled: true, hints: [] },
      moveDown: { available: true, enabled: true, hints: [] },
      setLog: { available: false, enabled: false, hints: [] },
    },
  })),
};

export const GenericWorkoutCreatedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: workoutStream,
  version: 1,
  commit,
  name: "WORKOUT_CREATED_EVENT",
  payload: {
    workoutId,
    planId,
    planName,
    planSectionId,
    planSectionName,
    planSectionWarmup,
    planSectionCooldown,
    scheduledFor: workoutScheduledFor,
    userId,
  },
} satisfies Workouts.Events.WorkoutCreatedEventType;

export const PastGenericWorkoutCreatedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: workoutStream,
  version: 1,
  commit,
  name: "WORKOUT_CREATED_EVENT",
  payload: {
    workoutId,
    planId,
    planName,
    planSectionId,
    planSectionName,
    planSectionWarmup,
    planSectionCooldown,
    scheduledFor: pastWorkoutScheduledFor,
    userId,
  },
} satisfies Workouts.Events.WorkoutCreatedEventType;

export const GenericWorkoutExerciseAddedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: workoutStream,
  version: 2,
  commit,
  name: "WORKOUT_EXERCISE_ADDED_EVENT",
  payload: {
    workoutId,
    workoutExerciseId,
    exerciseId,
    exerciseName,
    exerciseImageEtag,
    exerciseDescription,
    prescription: exercisePrescription,
    requesterId: userId,
  },
} satisfies Workouts.Events.WorkoutExerciseAddedEventType;

export const workoutExerciseAddedEvent = (): Workouts.Events.WorkoutExerciseAddedEventType => ({
  ...GenericWorkoutExerciseAddedEvent,
  payload: {
    ...GenericWorkoutExerciseAddedEvent.payload,
    workoutExerciseId: v.parse(Workouts.VO.WorkoutExerciseId, crypto.randomUUID()),
  },
});

export const AnotherGenericWorkoutExerciseAddedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: workoutStream,
  version: 2,
  commit,
  name: "WORKOUT_EXERCISE_ADDED_EVENT",
  payload: {
    workoutId,
    workoutExerciseId: anotherWorkoutExerciseId,
    exerciseId,
    exerciseName,
    exerciseImageEtag,
    exerciseDescription,
    prescription: exercisePrescription,
    requesterId: userId,
  },
} satisfies Workouts.Events.WorkoutExerciseAddedEventType;

export const GenericWorkoutExerciseRemovedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: workoutStream,
  version: 1,
  commit,
  name: "WORKOUT_EXERCISE_REMOVED_EVENT",
  payload: { workoutId, workoutExerciseId, requesterId: userId },
} satisfies Workouts.Events.WorkoutExerciseRemovedEventType;

export const GenericWorkoutExerciseMovedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: workoutStream,
  version: 1,
  commit,
  name: "WORKOUT_EXERCISE_MOVED_EVENT",
  payload: { workoutId, workoutExerciseId, position: anotherWorkoutExercisePosition, requesterId: userId },
} satisfies Workouts.Events.WorkoutExerciseMovedEventType;

export const GenericWorkoutExerciseTargetSetEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: workoutStream,
  version: 1,
  commit,
  name: "WORKOUT_EXERCISE_TARGET_SET_EVENT",
  payload: { workoutId, workoutExerciseId, target: exerciseTarget, requesterId: userId },
} satisfies Workouts.Events.WorkoutExerciseTargetSetEventType;

export const GenericWorkoutStartedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: workoutStream,
  version: 1,
  commit,
  name: "WORKOUT_STARTED_EVENT",
  payload: { workoutId, requesterId: userId },
} satisfies Workouts.Events.WorkoutStartedEventType;

export const GenericWorkoutSetLoggedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: workoutStream,
  version: 1,
  commit,
  name: "WORKOUT_SET_LOGGED_EVENT",
  payload: { workoutId, workoutExerciseId, loggedSet, requesterId: userId },
} satisfies Workouts.Events.WorkoutSetLoggedEventType;

export const GenericWorkoutSetLoggedWithRirEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: workoutStream,
  version: 1,
  commit,
  name: "WORKOUT_SET_LOGGED_EVENT",
  payload: { workoutId, workoutExerciseId, loggedSet: loggedSetWithRir, requesterId: userId },
} satisfies Workouts.Events.WorkoutSetLoggedEventType;

export const correctedLoggedSetWithRir = v.parse(Workouts.VO.LoggedSet, {
  id: loggedSetId,
  setNumber: v.parse(Workouts.VO.SetNumber, 1),
  reps: v.parse(Workouts.VO.Reps, 6),
  load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(85).get()),
  rir: v.parse(Workouts.VO.Rir, 1),
});

export const GenericWorkoutSetCorrectedWithRirEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: workoutStream,
  version: 1,
  commit,
  name: "WORKOUT_SET_CORRECTED_EVENT",
  payload: { workoutId, workoutExerciseId, loggedSet: correctedLoggedSetWithRir, requesterId: userId },
} satisfies Workouts.Events.WorkoutSetCorrectedEventType;

export const correctedLoggedSet = v.parse(Workouts.VO.LoggedSet, {
  id: loggedSetId,
  setNumber: v.parse(Workouts.VO.SetNumber, 1),
  reps: v.parse(Workouts.VO.Reps, 6),
  load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(85).get()),
});

export const GenericWorkoutSetCorrectedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: workoutStream,
  version: 1,
  commit,
  name: "WORKOUT_SET_CORRECTED_EVENT",
  payload: { workoutId, workoutExerciseId, loggedSet: correctedLoggedSet, requesterId: userId },
} satisfies Workouts.Events.WorkoutSetCorrectedEventType;

export const GenericWorkoutSetRemovedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: workoutStream,
  version: 1,
  commit,
  name: "WORKOUT_SET_REMOVED_EVENT",
  payload: { workoutId, workoutExerciseId, loggedSetId, requesterId: userId },
} satisfies Workouts.Events.WorkoutSetRemovedEventType;

export const GenericWorkoutCompletedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: workoutStream,
  version: 1,
  commit,
  name: "WORKOUT_COMPLETED_EVENT",
  payload: { workoutId, requesterId: userId },
} satisfies Workouts.Events.WorkoutCompletedEventType;

export const GenericWorkoutDiscardedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: workoutStream,
  version: 1,
  commit,
  name: "WORKOUT_DISCARDED_EVENT",
  payload: { workoutId, requesterId: userId },
} satisfies Workouts.Events.WorkoutDiscardedEventType;

export const workoutNote = v.parse(Workouts.VO.WorkoutNote, "Felt heavy, dropped to 80kg on set 3");

export const GenericWorkoutNoteSetEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: workoutStream,
  version: 1,
  commit,
  name: "WORKOUT_NOTE_SET_EVENT",
  payload: { workoutId, note: workoutNote, requesterId: userId },
} satisfies Workouts.Events.WorkoutNoteSetEventType;

export const GenericWorkoutNoteUnsetEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: workoutStream,
  version: 1,
  commit,
  name: "WORKOUT_NOTE_SET_EVENT",
  payload: { workoutId, note: undefined, requesterId: userId },
} satisfies Workouts.Events.WorkoutNoteSetEventType;

export const GenericWorkoutRescheduledEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: workoutStream,
  version: 1,
  commit,
  name: "WORKOUT_RESCHEDULED_EVENT",
  payload: { workoutId, scheduledFor: anotherWorkoutScheduledFor, requesterId: userId },
} satisfies Workouts.Events.WorkoutRescheduledEventType;

export const PastGenericWorkoutRescheduledEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: workoutStream,
  version: 1,
  commit,
  name: "WORKOUT_RESCHEDULED_EVENT",
  payload: { workoutId, scheduledFor: pastWorkoutScheduledFor, requesterId: userId },
} satisfies Workouts.Events.WorkoutRescheduledEventType;

export const AnotherGenericWorkoutSetLoggedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: workoutStream,
  version: 1,
  commit,
  name: "WORKOUT_SET_LOGGED_EVENT",
  payload: { workoutId, workoutExerciseId, loggedSet: anotherLoggedSet, requesterId: userId },
} satisfies Workouts.Events.WorkoutSetLoggedEventType;
