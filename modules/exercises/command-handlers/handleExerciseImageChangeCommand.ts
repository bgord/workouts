import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import type * as Exercises from "+exercises";
import { ExerciseImageChangedEvent } from "../events/EXERCISE_IMAGE_CHANGED_EVENT";
import { ExerciseExists } from "../invariants/exercise-exists";
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
  EventStore: bg.EventStorePort<Exercises.Events.ExerciseImageChangedEventType>;
  GetExerciseQuery: Exercises.Queries.GetExercise;
};

export const handleExerciseImageChangeCommand =
  (deps: Dependencies) => async (command: Exercises.Commands.ExerciseImageChangeCommandType) => {
    const temporary = tools.FilePathAbsolute.fromString(command.payload.absoluteFilePath);

    const exercise = await deps.GetExerciseQuery.execute(command.payload.id);

    if (!ExerciseExists.passes({ exercise })) {
      await deps.TemporaryFile.cleanup(temporary.getFilename());
      throw new ExerciseExists.error();
    }

    const info = await deps.ImageInfo.inspect(temporary);

    if (!ExerciseImageConstraints.passes(info)) {
      await deps.TemporaryFile.cleanup(temporary.getFilename());
      throw new ExerciseImageConstraints.error();
    }

    const final = await deps.ImageProcessor.process({
      strategy: "in_place",
      input: temporary,
      to: v.parse(tools.Extension, "webp"),
      maxSide: ExerciseImageSide,
    });

    const key = ExerciseImageKeyFactory.stable(command.payload.id);
    await deps.RemoteFileStorage.putFromPath({ key, path: final });
    await deps.TemporaryFile.cleanup(final.getFilename());

    const event = bg.event(
      ExerciseImageChangedEvent,
      `exercise_${command.payload.id}`,
      { id: command.payload.id, image: key },
      deps,
    );

    await deps.EventStore.save([event]);
  };
