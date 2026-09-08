import type * as bg from "@bgord/bun";
import type * as Workouts from "+workouts";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  repo: Workouts.Ports.WorkoutRepositoryPort;
};

export const handleWorkoutNoteSetCommand =
  (deps: Dependencies) => async (command: Workouts.Commands.WorkoutNoteSetCommandType) => {
    const workout = await deps.repo.load(command.payload.workoutId);
    command.revision.validate(workout.revision.value);
    workout.setNote(command.payload.note, command.payload.requesterId);
    await deps.repo.save(workout);
  };
