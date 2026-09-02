import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Auth from "+auth";
import type * as Exercises from "+exercises";
import * as Commands from "+exercises/commands";
import * as VO from "+exercises/value-objects";

export type ExerciseCatalogSeedResultType = {
  exerciseCategoriesCreated: number;
  exercisesCreated: number;
  exerciseCategoriesAssigned: number;
};

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  TemporaryFile: bg.TemporaryFilePort;
  FileReaderJson: bg.FileReaderJsonPort;
  FileReaderRaw: bg.FileReaderRawPort;
  CommandBus: bg.CommandBusPort<
    | Exercises.Commands.ExerciseAddCommandType
    | Exercises.Commands.ExerciseCategoryAddCommandType
    | Exercises.Commands.ExerciseAssignCategoryCommandType
  >;
  ListExercisesQuery: Exercises.Queries.ListExercises;
  ListExerciseCategoriesQuery: Exercises.Queries.ListExerciseCategories;
  ListCategoriesAssignedToExerciseQuery: Exercises.Queries.ListCategoriesAssignedToExercise;
};

export class ExerciseCatalogSeeder {
  constructor(private readonly deps: Dependencies) {}

  async seed(path: tools.FilePathRelative): Promise<ExerciseCatalogSeedResultType> {
    const catalog = v.parse(VO.ExerciseCatalog, await this.deps.FileReaderJson.read(path));

    const result = { exerciseCategoriesCreated: 0, exercisesCreated: 0, exerciseCategoriesAssigned: 0 };

    const exerciseCategoryIds = new Map<VO.ExerciseCategoryNameType, VO.ExerciseCategoryIdType>(
      (await this.deps.ListExerciseCategoriesQuery.execute()).map((category) => [category.name, category.id]),
    );
    const exerciseIds = new Map<VO.ExerciseNameType, VO.ExerciseIdType>(
      (await this.deps.ListExercisesQuery.execute()).map((exercise) => [exercise.name, exercise.id]),
    );

    for (const name of new Set(catalog.exercises.flatMap((entry) => entry.exerciseCategories))) {
      if (exerciseCategoryIds.has(name)) continue;

      const id = v.parse(VO.ExerciseCategoryId, this.deps.IdProvider.generate());

      await this.deps.CommandBus.emit(
        bg.command(
          Commands.ExerciseCategoryAddCommand,
          { payload: { id, name, userId: Auth.VO.SYSTEM_USER_ID } },
          this.deps,
        ),
      );

      exerciseCategoryIds.set(name, id);
      result.exerciseCategoriesCreated++;
    }

    for (const entry of catalog.exercises) {
      const existingExerciseId = exerciseIds.get(entry.name);

      const assigned = existingExerciseId
        ? await this.deps.ListCategoriesAssignedToExerciseQuery.execute(existingExerciseId)
        : [];

      const exerciseId = existingExerciseId ?? v.parse(VO.ExerciseId, this.deps.IdProvider.generate());

      if (!existingExerciseId) {
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
                id: exerciseId,
                absoluteFilePath: temporary.get(),
                name: entry.name,
                description: entry.description,
                userId: Auth.VO.SYSTEM_USER_ID,
              },
            },
            this.deps,
          ),
        );

        exerciseIds.set(entry.name, exerciseId);
        result.exercisesCreated++;
      }

      for (const name of entry.exerciseCategories) {
        const exerciseCategoryId = exerciseCategoryIds.get(name);

        if (!exerciseCategoryId) continue;
        if (assigned.some((category) => category.id === exerciseCategoryId)) continue;

        await this.deps.CommandBus.emit(
          bg.command(
            Commands.ExerciseAssignCategoryCommand,
            { payload: { exerciseId, exerciseCategoryId, requesterId: Auth.VO.SYSTEM_USER_ID } },
            this.deps,
          ),
        );

        result.exerciseCategoriesAssigned++;
      }
    }

    return result;
  }
}
