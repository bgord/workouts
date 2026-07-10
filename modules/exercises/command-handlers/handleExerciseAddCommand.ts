import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import type * as Exercises from "+exercises";
import { ExerciseAddedEvent } from "../events/EXERCISE_ADDED_EVENT";
import { ExerciseImageConstraints } from "../invariants/exercise-image-constraints";
import { ExerciseImageKeyFactory } from "../value-objects/exercise-image-key";
import { ExerciseImageSide } from "../value-objects/exercise-image-side";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  TemporaryFile: bg.TemporaryFilePort;
  ImageInfo: bg.ImageInfoPort;
  ImageProcessor: bg.ImageProcessorPort;
  RemoteFileStorage: bg.RemoteFileStoragePort;
  EventStore: bg.EventStorePort<Exercises.Events.ExerciseAddedEventType>;
};

export const handleExerciseAddCommand =
  (deps: Dependencies) => async (command: Exercises.Commands.ExerciseAddCommandType) => {
    const extension = v.parse(tools.Extension, "webp");
    const temporary = tools.FilePathAbsolute.fromString(command.payload.absoluteFilePath);

    const info = await deps.ImageInfo.inspect(temporary);

    if (!ExerciseImageConstraints.passes(info)) {
      await deps.TemporaryFile.cleanup(temporary.getFilename());
      throw new ExerciseImageConstraints.error();
    }

    await deps.ImageProcessor.process({
      strategy: "in_place",
      input: temporary,
      to: extension,
      maxSide: ExerciseImageSide,
    });

    const key = ExerciseImageKeyFactory.stable(command.payload.id);
    await deps.RemoteFileStorage.putFromPath({ key, path: temporary });
    await deps.TemporaryFile.cleanup(temporary.getFilename());

    const event = bg.event(
      ExerciseAddedEvent,
      `exercises_${command.payload.id}`,
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
