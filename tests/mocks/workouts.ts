// cspell:disable
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Exercises from "+exercises";
import * as Plans from "+plans";
import * as Workouts from "+workouts";
import { userId } from "./auth";
import {
  anotherExerciseId,
  anotherExerciseLaterality,
  anotherExerciseName,
  exerciseDescription,
  exerciseId,
  exerciseImageEtag,
  exerciseLaterality,
  exerciseName,
  exerciseResistance,
} from "./exercises";
import {
  amrapRepsRange,
  exerciseInstructionId,
  planId,
  planName,
  planSectionCooldown,
  planSectionId,
  planSectionName,
  planSectionWarmup,
  progression,
  repsRange,
  rirTarget,
  sets,
} from "./plans";
import { commit, correlationId, expectAnyId, revision, T0 } from "./shared";

export const workoutId = v.parse(Workouts.VO.WorkoutId, "f1c4b0a2-6d3e-4f81-9a7c-2b5e8d0f3a64");
export const anotherWorkoutId = v.parse(Workouts.VO.WorkoutId, "3b9d7e21-5c4a-4f6b-8e2d-1a7c9f0b4d58");
export const workoutStream = v.parse(bg.EventStream, `workout_${workoutId}`);

export const workoutScheduledFor = v.parse(Workouts.VO.WorkoutScheduledFor, "2025-01-01");
export const anotherWorkoutScheduledFor = v.parse(Workouts.VO.WorkoutScheduledFor, "2025-01-08");
export const pastWorkoutScheduledFor = v.parse(Workouts.VO.WorkoutScheduledFor, "2024-12-31");

export const workoutExerciseId = v.parse(
  Workouts.VO.WorkoutExerciseId,
  "1d9b7f60-2c34-4a58-9e1b-7f0a3c5d6e21",
);

export const workoutPlanName = v.parse(Workouts.VO.WorkoutPlanName, planName);
export const workoutPlanSectionName = v.parse(Workouts.VO.WorkoutPlanSectionName, planSectionName);
export const workoutPlanSectionWarmup = v.parse(Workouts.VO.WorkoutPlanSectionWarmup, planSectionWarmup);
export const workoutPlanSectionCooldown = v.parse(
  Workouts.VO.WorkoutPlanSectionCooldown,
  planSectionCooldown,
);
export const workoutExerciseName = v.parse(Workouts.VO.WorkoutExerciseName, exerciseName);
export const anotherWorkoutExerciseName = v.parse(Workouts.VO.WorkoutExerciseName, anotherExerciseName);
export const workoutExerciseDescription = v.parse(
  Workouts.VO.WorkoutExerciseDescription,
  exerciseDescription,
);
export const workoutExerciseResistance = v.parse(Workouts.VO.WorkoutExerciseResistance, exerciseResistance);
export const workoutExerciseLaterality = v.parse(Workouts.VO.WorkoutExerciseLaterality, exerciseLaterality);
export const anotherWorkoutExerciseLaterality = v.parse(
  Workouts.VO.WorkoutExerciseLaterality,
  anotherExerciseLaterality,
);

export const workoutSummary: Workouts.VO.WorkoutSummary = {
  id: workoutId,
  planId,
  planName: workoutPlanName,
  planSectionId,
  planSectionName: workoutPlanSectionName,
  scheduledFor: workoutScheduledFor,
  status: Workouts.VO.WorkoutStatusEnum.draft,
  completedAt: null,
  revision: revision.value,
};

export const workoutSummaryInProgress: Workouts.VO.WorkoutSummary = {
  ...workoutSummary,
  status: Workouts.VO.WorkoutStatusEnum.in_progress,
};

export const workoutSummaryCompleted: Workouts.VO.WorkoutSummary = {
  ...workoutSummary,
  status: Workouts.VO.WorkoutStatusEnum.completed,
  completedAt: T0.ms,
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

export const exercisePrescription = v.parse(Workouts.VO.ExercisePrescription, {
  sets,
  reps: repsRange,
  progression,
});

export const amrapExercisePrescription = v.parse(Workouts.VO.ExercisePrescription, {
  sets,
  reps: amrapRepsRange,
  progression: Plans.VO.ProgressionMethodOptions.rep_progression,
});

export const amrapDoubleProgressionExercisePrescription = v.parse(Workouts.VO.ExercisePrescription, {
  sets,
  reps: amrapRepsRange,
  progression,
});

export const rirExercisePrescription = v.parse(Workouts.VO.ExercisePrescription, {
  sets,
  reps: repsRange,
  progression,
  rir: rirTarget,
});

export const amrapRirExercisePrescription = v.parse(Workouts.VO.ExercisePrescription, {
  sets,
  reps: amrapRepsRange,
  progression: Plans.VO.ProgressionMethodOptions.rep_progression,
  rir: rirTarget,
});

export const linearExercisePrescription = v.parse(Workouts.VO.ExercisePrescription, {
  sets,
  reps: v.parse(Plans.VO.RepsRange, { min: 5, max: 5 }),
  progression: Plans.VO.ProgressionMethodOptions.linear_progression,
});

export const loadStep = tools.Weight.fromKilograms(2.5);

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
  resistance: workoutExerciseResistance,
  laterality: workoutExerciseLaterality,
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

export const missedExerciseRecentPerformance: Workouts.Queries.ExerciseRecentPerformance = {
  scheduledFor: workoutScheduledFor,
  prescription: exercisePrescription,
  sets: exercisePerformance.sets,
};

export const hitExerciseRecentPerformance: Workouts.Queries.ExerciseRecentPerformance = {
  ...missedExerciseRecentPerformance,
  prescription: v.parse(Workouts.VO.ExercisePrescription, {
    sets: v.parse(Plans.VO.Sets, 2),
    reps: amrapRepsRange,
    progression,
  }),
};

export const exerciseRecentPerformances = { scheduledFor: workoutScheduledFor, performances: [] };

export const stalledExerciseRecentPerformances = {
  scheduledFor: workoutScheduledFor,
  performances: [
    { ...missedExerciseRecentPerformance, scheduledFor: v.parse(tools.DayIsoId, "2024-12-25") },
    { ...missedExerciseRecentPerformance, scheduledFor: v.parse(tools.DayIsoId, "2024-12-18") },
    { ...missedExerciseRecentPerformance, scheduledFor: v.parse(tools.DayIsoId, "2024-12-11") },
  ],
};

export const exercisePerformanceWithRir = {
  ...exercisePerformance,
  sets: [
    {
      setNumber: v.parse(Workouts.VO.SetNumber, 1),
      reps: v.parse(Workouts.VO.Reps, 5),
      load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(90).get()),
      rir: v.parse(Workouts.VO.Rir, 2),
    },
    {
      setNumber: v.parse(Workouts.VO.SetNumber, 2),
      reps: v.parse(Workouts.VO.Reps, 10),
      load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(90).get()),
      rir: v.parse(Workouts.VO.Rir, 1),
    },
  ],
};

export const exercisePerformanceWithPartialRir = {
  ...exercisePerformance,
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
      rir: v.parse(Workouts.VO.Rir, 1),
    },
  ],
};

export const bodyweightExercisePerformance = {
  workoutId,
  scheduledFor: workoutScheduledFor,
  resistance: Exercises.VO.ExerciseResistanceOptions.bodyweight,
  laterality: workoutExerciseLaterality,
  sets: [
    {
      setNumber: v.parse(Workouts.VO.SetNumber, 1),
      reps: v.parse(Workouts.VO.Reps, 12),
      load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(0).get()),
      rir: null,
    },
    {
      setNumber: v.parse(Workouts.VO.SetNumber, 2),
      reps: v.parse(Workouts.VO.Reps, 10),
      load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(0).get()),
      rir: null,
    },
  ],
} satisfies Workouts.Queries.ExercisePerformance;

export const workoutExportRow = {
  workoutId,
  completedAt: T0.ms,
  planName: workoutPlanName,
  planSectionName: workoutPlanSectionName,
  exerciseName: workoutExerciseName,
  resistance: workoutExerciseResistance,
  laterality: workoutExerciseLaterality,
  setNumber: v.parse(Workouts.VO.SetNumber, 1),
  reps: v.parse(Workouts.VO.Reps, 9),
  load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(80).get()),
  rir: v.parse(Workouts.VO.Rir, 2),
};

export const workoutCsv = [
  "workoutId,completedAt,planName,planSectionName,exerciseName,resistance,laterality,setNumber,reps,load,rir",
  `${workoutId},${T0.ms},${planName},${planSectionName},${exerciseName},${exerciseResistance},${exerciseLaterality},1,9,80000,2`,
].join("");

export const exerciseTarget = v.parse(Workouts.VO.ExerciseTarget, {
  sets,
  reps: v.parse(Workouts.VO.Reps, 9),
  load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(80).get()),
});

export const anotherExerciseTarget = v.parse(Workouts.VO.ExerciseTarget, {
  sets,
  reps: v.parse(Workouts.VO.Reps, 10),
  load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(80).get()),
});

export const exerciseTargetWithAnotherLoad = v.parse(Workouts.VO.ExerciseTarget, {
  sets,
  reps: v.parse(Workouts.VO.Reps, 9),
  load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(85).get()),
});

export const bodyweightExerciseTarget = v.parse(Workouts.VO.ExerciseTarget, {
  sets,
  reps: v.parse(Workouts.VO.Reps, 9),
  load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(0).get()),
});

export const workoutExercise: Workouts.VO.WorkoutExercise = {
  id: workoutExerciseId,
  exerciseId,
  exerciseName: workoutExerciseName,
  resistance: workoutExerciseResistance,
  laterality: workoutExerciseLaterality,
  prescription: exercisePrescription,
  target: exerciseTarget,
  loggedSets: [loggedSet],
};

export const workoutExerciseWithoutTarget: Workouts.VO.WorkoutExercise = {
  id: anotherWorkoutExerciseId,
  exerciseId: anotherExerciseId,
  exerciseName: anotherWorkoutExerciseName,
  resistance: workoutExerciseResistance,
  laterality: workoutExerciseLaterality,
  prescription: exercisePrescription,
  loggedSets: [],
};

export const workoutExerciseWithoutTargetLogged: Workouts.VO.WorkoutExercise = {
  ...workoutExerciseWithoutTarget,
  loggedSets: [loggedSet],
};

export const workoutExercisesAtLimit: Array<Workouts.VO.WorkoutExercise> = Array.from(
  { length: Workouts.VO.WorkoutExerciseLimitMax },
  () => workoutExercise,
);

export const workout: Workouts.VO.WorkoutSnapshot = {
  id: workoutId,
  planId,
  planName: workoutPlanName,
  planSectionId,
  planSectionName: workoutPlanSectionName,
  planSectionWarmup: workoutPlanSectionWarmup,
  planSectionCooldown: workoutPlanSectionCooldown,
  scheduledFor: workoutScheduledFor,
  status: Workouts.VO.WorkoutStatusEnum.in_progress,
  completedAt: null,
  note: null,
  revision: revision.value,
  exercises: [workoutExercise],
};

export const exercisePerformanceWeakestSet = v.parse(Workouts.VO.ExerciseTarget, {
  sets: v.parse(Plans.VO.Sets, 2),
  reps: v.parse(Workouts.VO.Reps, 5),
  load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(90).get()),
});

export const exerciseTargetProgression: Workouts.VO.ExerciseTargetProgression = {
  last: exercisePerformanceWeakestSet,
  regress: v.parse(Workouts.VO.ExerciseTarget, {
    sets: v.parse(Plans.VO.Sets, 2),
    reps: v.parse(Workouts.VO.Reps, 12),
    load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(87.5).get()),
  }),
  progress: v.parse(Workouts.VO.ExerciseTarget, {
    sets: v.parse(Plans.VO.Sets, 2),
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
    exerciseDescription: workoutExerciseDescription,
    loggedSets: exercise.loggedSets.map((set) => ({
      ...set,
      rir: null,
      rirBelowTarget: false,
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
      catalogView: { available: true, enabled: true, hints: [] },
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
    planName: workoutPlanName,
    planSectionId,
    planSectionName: workoutPlanSectionName,
    planSectionWarmup: workoutPlanSectionWarmup,
    planSectionCooldown: workoutPlanSectionCooldown,
    scheduledFor: workoutScheduledFor,
    userId,
  },
} satisfies Workouts.Events.WorkoutCreatedEventType;

export const GenericWorkoutCreatedEventPast = {
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
    planName: workoutPlanName,
    planSectionId,
    planSectionName: workoutPlanSectionName,
    planSectionWarmup: workoutPlanSectionWarmup,
    planSectionCooldown: workoutPlanSectionCooldown,
    scheduledFor: pastWorkoutScheduledFor,
    userId,
  },
} satisfies Workouts.Events.WorkoutCreatedEventType;

export const GenericWorkoutExerciseAddedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: workoutStream,
  version: 5,
  commit,
  name: "WORKOUT_EXERCISE_ADDED_EVENT",
  payload: {
    workoutId,
    workoutExerciseId,
    exerciseId,
    exerciseName: workoutExerciseName,
    exerciseDescription: workoutExerciseDescription,
    resistance: workoutExerciseResistance,
    laterality: workoutExerciseLaterality,
    prescription: exercisePrescription,
    requesterId: userId,
  },
} satisfies Workouts.Events.WorkoutExerciseAddedEventType;

export const GenericWorkoutExerciseAddedEventBodyweight = {
  ...GenericWorkoutExerciseAddedEvent,
  payload: {
    ...GenericWorkoutExerciseAddedEvent.payload,
    resistance: Exercises.VO.ExerciseResistanceOptions.bodyweight,
  },
} satisfies Workouts.Events.WorkoutExerciseAddedEventType;

export const GenericWorkoutExerciseAddedEventRir = {
  ...GenericWorkoutExerciseAddedEvent,
  payload: { ...GenericWorkoutExerciseAddedEvent.payload, prescription: rirExercisePrescription },
} satisfies Workouts.Events.WorkoutExerciseAddedEventType;

export const GenericWorkoutExerciseAddedEventAnother = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: workoutStream,
  version: 5,
  commit,
  name: "WORKOUT_EXERCISE_ADDED_EVENT",
  payload: {
    workoutId,
    workoutExerciseId: anotherWorkoutExerciseId,
    exerciseId,
    exerciseName: workoutExerciseName,
    exerciseDescription: workoutExerciseDescription,
    resistance: workoutExerciseResistance,
    laterality: workoutExerciseLaterality,
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

export const GenericWorkoutExerciseTargetSetEventAnother = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: workoutStream,
  version: 1,
  commit,
  name: "WORKOUT_EXERCISE_TARGET_SET_EVENT",
  payload: { workoutId, workoutExerciseId, target: anotherExerciseTarget, requesterId: userId },
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

export const GenericWorkoutSetLoggedEventWithRir = {
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

export const GenericWorkoutSetCorrectedEventWithRir = {
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

export const GenericWorkoutRescheduledEventPast = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: workoutStream,
  version: 1,
  commit,
  name: "WORKOUT_RESCHEDULED_EVENT",
  payload: { workoutId, scheduledFor: pastWorkoutScheduledFor, requesterId: userId },
} satisfies Workouts.Events.WorkoutRescheduledEventType;

export const GenericWorkoutSetLoggedEventAnother = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: workoutStream,
  version: 1,
  commit,
  name: "WORKOUT_SET_LOGGED_EVENT",
  payload: { workoutId, workoutExerciseId, loggedSet: anotherLoggedSet, requesterId: userId },
} satisfies Workouts.Events.WorkoutSetLoggedEventType;

export const workoutWithExerciseHistory = [GenericWorkoutCreatedEvent, GenericWorkoutExerciseAddedEvent];

export const workoutWithTargetHistory = [...workoutWithExerciseHistory, GenericWorkoutExerciseTargetSetEvent];

export const workoutInProgressHistory = [...workoutWithTargetHistory, GenericWorkoutStartedEvent];

export const workoutWithLoggedSetHistory = [...workoutInProgressHistory, GenericWorkoutSetLoggedEvent];

export const workoutCompletedHistory = [...workoutWithLoggedSetHistory, GenericWorkoutCompletedEvent];
