import * as bg from "@bgord/bun";
import type * as Exercises from "+exercises";
import { ExerciseCategoryDeletedEvent } from "../events/EXERCISE_CATEGORY_DELETED_EVENT";
import { ExerciseCategoryBelongsToUser } from "../invariants/exercise-category-belongs-to-user";
import { ExerciseCategoryExists } from "../invariants/exercise-category-exists";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommitConfig: bg.StaticConfigPort<bg.CommitShaValueType>;
  EventStore: bg.EventStorePort<Exercises.Events.ExerciseCategoryDeletedEventType>;
  GetExerciseCategoryQuery: Exercises.Queries.GetExerciseCategory;
};

export const handleExerciseCategoryDeleteCommand =
  (deps: Dependencies) => async (command: Exercises.Commands.ExerciseCategoryDeleteCommandType) => {
    const exerciseCategory = await deps.GetExerciseCategoryQuery.execute(command.payload.id);

    ExerciseCategoryExists.enforce({ exerciseCategory });
    ExerciseCategoryBelongsToUser.enforce({
      userId: exerciseCategory?.userId,
      requesterId: command.payload.userId,
    });

    const event = bg.event(
      ExerciseCategoryDeletedEvent,
      `exercise_category_${command.payload.id}`,
      { id: command.payload.id, userId: command.payload.userId },
      deps,
    );

    await deps.EventStore.save([event]);
  };
