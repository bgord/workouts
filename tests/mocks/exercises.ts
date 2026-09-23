// cspell:disable
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Auth from "+auth";
import * as Exercises from "+exercises";
import { actionAvailable, commit, correlationId, expectAnyId, T0 } from "./shared";

export const exerciseId = v.parse(Exercises.VO.ExerciseId, "723c1e17-b97f-4b58-8a11-55f9e20ad065");
export const exerciseName = v.parse(Exercises.VO.ExerciseName, "Bench Press Barbell Horizontal");
export const exerciseDescription = v.parse(
  Exercises.VO.ExerciseDescription,
  "Press the barbell upwards, while lying on the horizontal bench.",
);
export const exerciseImageKey = v.parse(tools.ObjectKey, `exercises/${exerciseId}/original.webp`);
export const exerciseImageEtag = bg.Hash.fromString(
  "0000000000000000000000000000000000000000000000000000000000000000",
).get();

export const anotherExerciseId = v.parse(Exercises.VO.ExerciseId, "5cd386ef-8f86-4ead-b845-d69159e2aeb0");

export const anotherExerciseName = v.parse(Exercises.VO.ExerciseName, "Horizontal Bench Press Barbell");
export const anotherExerciseDescription = v.parse(
  Exercises.VO.ExerciseDescription,
  "Press the barbell upwards, while lying on the bench.",
);
export const anotherExerciseImageKey = v.parse(tools.ObjectKey, `exercises/${exerciseId}/original.webp`);

export const exercise: Exercises.VO.Exercise = {
  id: exerciseId,
  name: exerciseName,
  description: exerciseDescription,
  image: exerciseImageKey,
  imageEtag: exerciseImageEtag,
};

export const exerciseCategoryId = v.parse(
  Exercises.VO.ExerciseCategoryId,
  "b1c4b703-c124-4153-ade8-c0587851334b",
);
export const exerciseCategoryName = v.parse(Exercises.VO.ExerciseCategoryName, "Upper Chest");

export const anotherExerciseCategoryId = v.parse(
  Exercises.VO.ExerciseCategoryId,
  "bb59c1dd-ffd6-416d-9123-a4cd1c508065",
);
export const anotherExerciseCategoryName = v.parse(Exercises.VO.ExerciseCategoryName, "Chest Upper");

export const exerciseCategory: Exercises.VO.ExerciseCategory = {
  id: exerciseCategoryId,
  name: exerciseCategoryName,
};

export const anotherExerciseCategory: Exercises.VO.ExerciseCategory = {
  id: anotherExerciseCategoryId,
  name: anotherExerciseCategoryName,
};

export const exerciseWithCategories: Exercises.VO.ExerciseWithCategories = {
  ...exercise,
  categories: [exerciseCategory],
};

export const exerciseListResponse: Exercises.Queries.ExerciseListResponse = {
  data: [exerciseWithCategories],
  actions: { add: actionAvailable },
};

export const exerciseCategoryListResponse: Exercises.Queries.ExerciseCategoryListResponse = {
  data: [exerciseCategory],
  actions: {
    manage: actionAvailable,
    add: actionAvailable,
    rename: actionAvailable,
    delete: actionAvailable,
  },
};

export const exerciseGetResponse: Exercises.Queries.ExerciseGetResponse = {
  data: exerciseWithCategories,
  assignableCategories: [anotherExerciseCategory],
  actions: {
    update: actionAvailable,
    imageChange: actionAvailable,
    delete: actionAvailable,
    categoryAssign: actionAvailable,
    categoryUnassign: actionAvailable,
  },
};

export const exerciseStream = v.parse(bg.EventStream, `exercise_${exerciseId}`);
export const exerciseCategoryStream = v.parse(bg.EventStream, `exercise_category_${exerciseCategoryId}`);

export const GenericExerciseAddedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: exerciseStream,
  version: 1,
  commit,
  name: "EXERCISE_ADDED_EVENT",
  payload: {
    id: exerciseId,
    name: exerciseName,
    description: exerciseDescription,
    image: exerciseImageKey,
    imageEtag: exerciseImageEtag,
    userId: Auth.VO.ADMIN_USER_ID,
  },
} satisfies Exercises.Events.ExerciseAddedEventType;

export const GenericExerciseDeletedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: exerciseStream,
  version: 1,
  commit,
  name: "EXERCISE_DELETED_EVENT",
  payload: { id: exerciseId, image: exerciseImageKey, requesterId: Auth.VO.ADMIN_USER_ID },
} satisfies Exercises.Events.ExerciseDeletedEventType;

export const GenericExerciseUpdatedNameEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: exerciseStream,
  version: 1,
  commit,
  name: "EXERCISE_UPDATED_EVENT",
  payload: {
    id: exerciseId,
    name: anotherExerciseName,
    description: exerciseDescription,
    requesterId: Auth.VO.ADMIN_USER_ID,
  },
} satisfies Exercises.Events.ExerciseUpdatedEventType;

export const GenericExerciseUpdatedDescriptionEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: exerciseStream,
  version: 1,
  commit,
  name: "EXERCISE_UPDATED_EVENT",
  payload: {
    id: exerciseId,
    name: exerciseName,
    description: anotherExerciseDescription,
    requesterId: Auth.VO.ADMIN_USER_ID,
  },
} satisfies Exercises.Events.ExerciseUpdatedEventType;

export const GenericExerciseUpdatedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: exerciseStream,
  version: 1,
  commit,
  name: "EXERCISE_UPDATED_EVENT",
  payload: {
    id: exerciseId,
    name: anotherExerciseName,
    description: anotherExerciseDescription,
    requesterId: Auth.VO.ADMIN_USER_ID,
  },
} satisfies Exercises.Events.ExerciseUpdatedEventType;

export const GenericExerciseImageChangedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: exerciseStream,
  version: 1,
  commit,
  name: "EXERCISE_IMAGE_CHANGED_EVENT",
  payload: {
    id: exerciseId,
    image: exerciseImageKey,
    imageEtag: exerciseImageEtag,
    requesterId: Auth.VO.ADMIN_USER_ID,
  },
} satisfies Exercises.Events.ExerciseImageChangedEventType;

export const GenericExerciseCategoryAddedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: exerciseCategoryStream,
  version: 1,
  commit,
  name: "EXERCISE_CATEGORY_ADDED_EVENT",
  payload: { id: exerciseCategoryId, name: exerciseCategoryName, userId: Auth.VO.ADMIN_USER_ID },
} satisfies Exercises.Events.ExerciseCategoryAddedEventType;

export const GenericExerciseCategoryDeletedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: exerciseCategoryStream,
  version: 1,
  commit,
  name: "EXERCISE_CATEGORY_DELETED_EVENT",
  payload: { id: exerciseCategoryId, requesterId: Auth.VO.ADMIN_USER_ID },
} satisfies Exercises.Events.ExerciseCategoryDeletedEventType;

export const GenericExerciseCategoryRenamedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: exerciseCategoryStream,
  version: 1,
  commit,
  name: "EXERCISE_CATEGORY_RENAMED_EVENT",
  payload: { id: exerciseCategoryId, name: anotherExerciseCategoryName, requesterId: Auth.VO.ADMIN_USER_ID },
} satisfies Exercises.Events.ExerciseCategoryRenamedEventType;

export const GenericExerciseCategoryAssignedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: exerciseStream,
  version: 1,
  commit,
  name: "EXERCISE_CATEGORY_ASSIGNED_EVENT",
  payload: { exerciseId, exerciseCategoryId, requesterId: Auth.VO.ADMIN_USER_ID },
} satisfies Exercises.Events.ExerciseCategoryAssignedEventType;

export const GenericExerciseCategoryUnassignedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: exerciseStream,
  version: 1,
  commit,
  name: "EXERCISE_CATEGORY_UNASSIGNED_EVENT",
  payload: { exerciseId, exerciseCategoryId, requesterId: Auth.VO.ADMIN_USER_ID },
} satisfies Exercises.Events.ExerciseCategoryUnassignedEventType;
