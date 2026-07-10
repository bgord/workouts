import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import type * as Exercises from "+exercises";
import { ExerciseAddedEvent } from "../events/EXERCISE_ADDED_EVENT";
import { ExerciseImageConstraints } from "../invariants/exercise-image-constraints";
import { ExerciseNameIsUnique } from "../invariants/exercise-name-is-unique";
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
    const temporary = tools.FilePathAbsolute.fromString(command.payload.absoluteFilePath);

    // TODO
    if (!ExerciseNameIsUnique.passes({ count: tools.Int.nonNegative(0) })) {
      await deps.TemporaryFile.cleanup(temporary.getFilename());
      throw new ExerciseNameIsUnique.error();
    }

    const extension = v.parse(tools.Extension, "webp");

    const info = await deps.ImageInfo.inspect(temporary);

    if (!ExerciseImageConstraints.passes(info)) {
      await deps.TemporaryFile.cleanup(temporary.getFilename());
      throw new ExerciseImageConstraints.error();
    }

    const final = await deps.ImageProcessor.process({
      strategy: "in_place",
      input: temporary,
      to: extension,
      maxSide: ExerciseImageSide,
    });

    const key = ExerciseImageKeyFactory.stable(command.payload.id);
    await deps.RemoteFileStorage.putFromPath({ key, path: final });
    await deps.TemporaryFile.cleanup(final.getFilename());

    const event = bg.event(
      ExerciseAddedEvent,
      `exercise_${command.payload.id}`,
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
