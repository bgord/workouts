import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Auth from "+auth";
import type * as Exercises from "+exercises";
import * as Commands from "+exercises/commands";
import * as VO from "+exercises/value-objects";

export type ExerciseCatalogSeedResultType = { exercisesCreated: number };

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  TemporaryFile: bg.TemporaryFilePort;
  FileReaderJson: bg.FileReaderJsonPort;
  FileReaderRaw: bg.FileReaderRawPort;
  CommandBus: bg.CommandBusPort<Exercises.Commands.ExerciseAddCommandType>;
  ListExercisesQuery: Exercises.Queries.ListExercises;
};

export class ExerciseCatalogSeeder {
  constructor(private readonly deps: Dependencies) {}

  async seed(path: tools.FilePathRelative): Promise<ExerciseCatalogSeedResultType> {
    const catalog = v.parse(VO.ExerciseCatalog, await this.deps.FileReaderJson.read(path));

    const existing = await this.deps.ListExercisesQuery.execute();
    const names = new Set<VO.ExerciseNameType>(existing.map((exercise) => exercise.name));

    const result = { exercisesCreated: 0 };

    for (const entry of catalog.exercises) {
      if (names.has(entry.name)) continue;

      const filename = tools.Filename.fromParts(
        this.deps.IdProvider.generate(),
        entry.image.getFilename().getExtension(),
      );
      const image = await this.deps.FileReaderRaw.read(entry.image);
      const temporary = await this.deps.TemporaryFile.write(filename, new File([image], filename.get()));

      await this.deps.CommandBus.emit(
        bg.command(
          Commands.ExerciseAddCommand,
          {
            payload: {
              id: v.parse(VO.ExerciseId, this.deps.IdProvider.generate()),
              absoluteFilePath: temporary.get(),
              name: entry.name,
              description: entry.description,
              userId: Auth.VO.SYSTEM_USER_ID,
            },
          },
          this.deps,
        ),
      );

      names.add(entry.name);
      result.exercisesCreated++;
    }

    return result;
  }
}
