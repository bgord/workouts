import { describe, expect, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as Exercises from "+exercises";
import { bootstrap } from "+infra/bootstrap";
import * as mocks from "./mocks";

const path = tools.FilePathRelative.fromString("infra/exercise-catalog.json");

const image = "exercise-catalog/bench-press-barbell-horizontal.webp";

const imageContent = "bench-press-image";
const imageBytes = new TextEncoder().encode(imageContent).buffer;

const catalog = {
  exercises: [
    {
      name: mocks.exerciseName,
      description: mocks.exerciseDescription,
      image,
      exerciseCategories: [mocks.exerciseCategoryName],
    },
  ],
};

describe("ExerciseCatalogSeeder", async () => {
  const di = await bootstrap();

  const seeder = new Exercises.Services.ExerciseCatalogSeeder({
    ...di.Adapters.System,
    ...di.Tools,
    ListExercisesQuery: di.Adapters.Exercises.ListExercisesQuery,
    ListExerciseCategoriesQuery: di.Adapters.Exercises.ListExerciseCategoriesQuery,
    ListCategoriesAssignedToExerciseQuery: di.Adapters.Exercises.ListCategoriesAssignedToExerciseQuery,
  });

  test("malformed catalog", async () => {
    using spies = new DisposableStack();
    spies.use(spyOn(di.Adapters.System.FileReaderJson, "read")).mockResolvedValue({});
    const commandBusEmit = spies.use(spyOn(di.Tools.CommandBus, "emit"));

    expect(async () => seeder.seed(path)).toThrow();
    expect(commandBusEmit).not.toHaveBeenCalled();
  });

  test("empty catalog", async () => {
    using spies = new DisposableStack();
    spies.use(spyOn(di.Adapters.System.FileReaderJson, "read")).mockResolvedValue({ exercises: [] });
    const commandBusEmit = spies.use(spyOn(di.Tools.CommandBus, "emit"));
    spies.use(spyOn(di.Adapters.Exercises.ListExercisesQuery, "execute")).mockResolvedValue([]);
    spies.use(spyOn(di.Adapters.Exercises.ListExerciseCategoriesQuery, "execute")).mockResolvedValue([]);

    const result = await seeder.seed(path);

    expect(result).toEqual({
      exerciseCategoriesCreated: 0,
      exercisesCreated: 0,
      exerciseCategoriesAssigned: 0,
    });
    expect(commandBusEmit).not.toHaveBeenCalled();
  });

  test("invalid exercise name", async () => {
    using spies = new DisposableStack();
    spies
      .use(spyOn(di.Adapters.System.FileReaderJson, "read"))
      .mockResolvedValue({ exercises: [{ ...catalog.exercises[0], name: "x" }] });
    const commandBusEmit = spies.use(spyOn(di.Tools.CommandBus, "emit"));

    expect(async () => seeder.seed(path)).toThrow("exercise.name.invalid");
    expect(commandBusEmit).not.toHaveBeenCalled();
  });

  test("unreadable image file", async () => {
    using spies = new DisposableStack();
    spies.use(spyOn(di.Adapters.System.FileReaderJson, "read")).mockResolvedValue(catalog);
    spies.use(spyOn(di.Adapters.Exercises.ListExercisesQuery, "execute")).mockResolvedValue([]);
    spies.use(spyOn(di.Adapters.Exercises.ListExerciseCategoriesQuery, "execute")).mockResolvedValue([]);
    spies
      .use(spyOn(di.Adapters.System.FileReaderRaw, "read"))
      .mockImplementation(mocks.throwIntentionalError);

    expect(async () => bg.CorrelationStorage.run(mocks.correlationId, () => seeder.seed(path))).toThrow(
      mocks.IntentionalError,
    );
  });

  test("happy path", async () => {
    using spies = new DisposableStack();
    spies.use(spyOn(di.Adapters.System.FileReaderJson, "read")).mockResolvedValue(catalog);
    spies.use(spyOn(di.Tools.CommandBus, "emit"));
    spies.use(spyOn(di.Adapters.Exercises.ListExercisesQuery, "execute")).mockResolvedValue([]);
    spies.use(spyOn(di.Adapters.Exercises.ListExerciseCategoriesQuery, "execute")).mockResolvedValue([]);
    spies.use(spyOn(di.Adapters.System.FileReaderRaw, "read")).mockResolvedValue(imageBytes);
    const temporaryFileWrite = spies.use(spyOn(di.Adapters.System.TemporaryFile, "write"));

    const result = await bg.CorrelationStorage.run(mocks.correlationId, () => seeder.seed(path));

    expect(await temporaryFileWrite.mock.calls[0]?.[1].text()).toEqual(imageContent);
    expect(result).toEqual({
      exerciseCategoriesCreated: 1,
      exercisesCreated: 1,
      exerciseCategoriesAssigned: 1,
    });
  });

  test("happy path - a new category for an existing exercise", async () => {
    using spies = new DisposableStack();
    spies.use(spyOn(di.Adapters.System.FileReaderJson, "read")).mockResolvedValue(catalog);
    spies.use(spyOn(di.Tools.CommandBus, "emit"));
    spies.use(spyOn(di.Adapters.Exercises.ListExercisesQuery, "execute")).mockResolvedValue([mocks.exercise]);
    spies
      .use(spyOn(di.Adapters.Exercises.ListExerciseCategoriesQuery, "execute"))
      .mockResolvedValue([mocks.exerciseCategory]);
    spies
      .use(spyOn(di.Adapters.Exercises.ListCategoriesAssignedToExerciseQuery, "execute"))
      .mockResolvedValue([mocks.anotherExerciseCategory]);

    const result = await bg.CorrelationStorage.run(mocks.correlationId, () => seeder.seed(path));

    expect(result).toEqual({
      exerciseCategoriesCreated: 0,
      exercisesCreated: 0,
      exerciseCategoriesAssigned: 1,
    });
  });

  test("happy path - a duplicated catalog entry is created once", async () => {
    using spies = new DisposableStack();
    spies
      .use(spyOn(di.Adapters.System.FileReaderJson, "read"))
      .mockResolvedValue({ exercises: [catalog.exercises[0], catalog.exercises[0]] });
    spies.use(spyOn(di.Tools.CommandBus, "emit"));
    spies.use(spyOn(di.Adapters.Exercises.ListExercisesQuery, "execute")).mockResolvedValue([]);
    spies.use(spyOn(di.Adapters.Exercises.ListExerciseCategoriesQuery, "execute")).mockResolvedValue([]);
    spies
      .use(spyOn(di.Adapters.Exercises.ListCategoriesAssignedToExerciseQuery, "execute"))
      .mockResolvedValue([mocks.exerciseCategory]);

    const result = await bg.CorrelationStorage.run(mocks.correlationId, () => seeder.seed(path));

    expect(result.exercisesCreated).toEqual(1);
  });

  test("happy path - idempotency", async () => {
    using spies = new DisposableStack();
    spies.use(spyOn(di.Adapters.System.FileReaderJson, "read")).mockResolvedValue(catalog);
    spies.use(spyOn(di.Tools.CommandBus, "emit"));
    spies.use(spyOn(di.Adapters.Exercises.ListExercisesQuery, "execute")).mockResolvedValue([mocks.exercise]);
    spies
      .use(spyOn(di.Adapters.Exercises.ListExerciseCategoriesQuery, "execute"))
      .mockResolvedValue([mocks.exerciseCategory]);
    spies
      .use(spyOn(di.Adapters.Exercises.ListCategoriesAssignedToExerciseQuery, "execute"))
      .mockResolvedValue([mocks.exerciseCategory]);

    const result = await seeder.seed(path);

    expect(result).toEqual({
      exerciseCategoriesCreated: 0,
      exercisesCreated: 0,
      exerciseCategoriesAssigned: 0,
    });
  });
});
