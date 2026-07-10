import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as Exercises from "+exercises";
import { ExerciseImageKeyFactory } from "../value-objects/exercise-image-key";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  TemporaryFile: bg.TemporaryFilePort;
  RemoteFileStorage: bg.RemoteFileStoragePort;
  EventStore: bg.EventStorePort<Exercises.Events.ExerciseAddedEventType>;
};

export const handleExerciseAddCommand =
  (deps: Dependencies) => async (command: Exercises.Commands.ExerciseAddCommandType) => {
    const temporary = tools.FilePathAbsolute.fromString(command.payload.absoluteFilePath);

    const key = ExerciseImageKeyFactory.stable(command.payload.id);
    await deps.RemoteFileStorage.putFromPath({ key, path: temporary });
    await deps.TemporaryFile.cleanup(temporary.getFilename());

    const event = bg.event(
      Exercises.Events.ExerciseAddedEvent,
      "exercises",
      {
        id: command.payload.id,
        name: command.payload.name,
        description: command.payload.description,
        image: key,
      },
      deps,
    );

    await deps.EventStore.save([event]);
  };
