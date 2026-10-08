import * as bg from "@bgord/bun";
import type * as Exercises from "+exercises";
import { ExerciseLoadStepSetEvent } from "../events/EXERCISE_LOAD_STEP_SET_EVENT";
import { CatalogIsManagedByAdmin } from "../invariants/catalog-is-managed-by-admin";
import { ExerciseExists } from "../invariants/exercise-exists";
import { ExerciseLoadStepHasChanged } from "../invariants/exercise-load-step-has-changed";
import { ExerciseLoadStepIsApplicable } from "../invariants/exercise-load-step-is-applicable";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommitConfig: bg.StaticConfigPort<bg.CommitShaValueType>;
  EventStore: bg.EventStorePort<Exercises.Events.ExerciseLoadStepSetEventType>;
  GetExerciseQuery: Exercises.Queries.GetExercise;
};

export const handleExerciseLoadStepSetCommand =
  (deps: Dependencies) => async (command: Exercises.Commands.ExerciseLoadStepSetCommandType) => {
    CatalogIsManagedByAdmin.enforce({ requesterId: command.payload.requesterId });

    const exercise = await deps.GetExerciseQuery.execute(command.payload.id);

    ExerciseExists.enforce({ exercise });
    ExerciseLoadStepHasChanged.enforce({ current: exercise!.loadStep, incoming: command.payload.loadStep });
    ExerciseLoadStepIsApplicable.enforce({
      resistance: exercise!.resistance,
      loadStep: command.payload.loadStep,
    });

    const event = bg.event(
      ExerciseLoadStepSetEvent,
      `exercise_${command.payload.id}`,
      {
        id: command.payload.id,
        loadStep: command.payload.loadStep,
        requesterId: command.payload.requesterId,
      },
      deps,
    );

    await deps.EventStore.save([event]);
  };
